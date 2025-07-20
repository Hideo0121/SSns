<?php

namespace App\Services;

use App\Models\EmailBroadcastMessage;
use App\Models\EmailBroadcastTarget;
use App\Models\User;
use App\Mail\BroadcastMail;
use App\Services\AuditLogService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MailService
{
    protected $auditLogService;

    public function __construct(AuditLogService $auditLogService)
    {
        $this->auditLogService = $auditLogService;
    }

    /**
     * 一括メール送信を実行
     */
    public function sendBroadcastMail(array $data, array $targetUserIds, array $attachments = [])
    {
        try {
            // ログインユーザーのIDを取得（user_codeではなくid）
            $adminUser = auth()->user();
            if (!$adminUser) {
                throw new \Exception('認証されていません');
            }

            // 添付ファイル情報を準備
            $attachmentInfo = [];
            foreach ($attachments as $file) {
                $attachmentInfo[] = [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType(),
                    'size_mb' => round($file->getSize() / (1024 * 1024), 2)
                ];
            }

            // メール配信メッセージを作成
            $broadcastMessage = EmailBroadcastMessage::create([
                'admin_user_id' => $adminUser->id, // 確実にidを使用
                'subject' => $data['subject'],
                'body' => $data['body'],
                'status' => 'sending',
                'attachment_info' => $attachmentInfo
            ]);

            // 配信対象を登録
            foreach ($targetUserIds as $userId) {
                EmailBroadcastTarget::create([
                    'broadcast_id' => $broadcastMessage->id,
                    'user_id' => $userId
                ]);
            }

            // 対象ユーザーを取得
            $targetUsers = User::whereIn('id', $targetUserIds)->get();

            // メール送信処理
            $successCount = 0;
            $failCount = 0;

            foreach ($targetUsers as $user) {
                try {
                    $mail = new BroadcastMail($data['subject'], $data['body'], $user->name, $attachments);
                    Mail::to($user->email)->send($mail);
                    $successCount++;
                    
                    Log::info('メール送信成功', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'subject' => $data['subject']
                    ]);
                } catch (\Exception $e) {
                    Log::error('メール送信失敗', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'subject' => $data['subject'],
                        'error' => $e->getMessage()
                    ]);
                    $failCount++;
                }
            }

            // 送信結果に応じてステータス更新
            $status = $failCount > 0 ? 'partial_failed' : 'sent';
            $broadcastMessage->update([
                'status' => $status,
                'sent_at' => now()
            ]);

            // 監査ログに記録
            $targetUserNames = $targetUsers->pluck('name')->join(', ');
            $this->auditLogService->logAction(
                'メール送信',
                "件名: {$data['subject']}, 送信対象: {$targetUserNames} ({$successCount}名成功, {$failCount}名失敗)",
                $broadcastMessage,
                [
                    'subject' => $data['subject'],
                    'target_count' => count($targetUserIds),
                    'success_count' => $successCount,
                    'fail_count' => $failCount,
                    'attachment_count' => count($attachments)
                ]
            );

            return [
                'success' => true,
                'broadcast_id' => $broadcastMessage->id,
                'success_count' => $successCount,
                'fail_count' => $failCount,
                'total_count' => count($targetUserIds)
            ];

        } catch (\Exception $e) {
            Log::error('メール配信エラー', [
                'error' => $e->getMessage(),
                'user_id' => auth()->user()?->id ?? 'unknown',
                'user_code' => auth()->user()?->user_code ?? 'unknown',
                'data' => $data
            ]);

            // エラー時の監査ログ記録
            $this->auditLogService->logAction(
                'メール送信エラー',
                "メール送信失敗 - 件名: {$data['subject']}, エラー: {$e->getMessage()}",
                null,
                [
                    'subject' => $data['subject'],
                    'error' => $e->getMessage(),
                    'target_count' => count($targetUserIds ?? [])
                ]
            );

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * メール送信履歴を取得
     */
    public function getBroadcastHistory($perPage = 15)
    {
        return EmailBroadcastMessage::with(['admin', 'targets.user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * 送信可能なユーザー一覧を取得
     */
    public function getAvailableUsers($filters = [])
    {
        $query = User::query();

        // 権限フィルタ
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        // 検索フィルタ
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('user_code', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->whereNotNull('email')
                    ->orderBy('name')
                    ->get(['id', 'user_code', 'name', 'email', 'role']);
    }

    /**
     * メール配信統計を取得
     */
    public function getStatistics()
    {
        $totalMessages = EmailBroadcastMessage::count();
        $sentMessages = EmailBroadcastMessage::where('status', 'sent')->count();
        $failedMessages = EmailBroadcastMessage::whereIn('status', ['failed', 'partial_failed'])->count();
        
        $recentMessages = EmailBroadcastMessage::where('created_at', '>=', now()->subDays(7))
                                               ->count();

        return [
            'total_messages' => $totalMessages,
            'sent_messages' => $sentMessages,
            'failed_messages' => $failedMessages,
            'recent_messages' => $recentMessages,
            'success_rate' => $totalMessages > 0 ? round(($sentMessages / $totalMessages) * 100, 1) : 0
        ];
    }
}