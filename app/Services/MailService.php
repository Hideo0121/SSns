<?php

namespace App\Services;

use App\Models\EmailBroadcastMessage;
use App\Models\EmailBroadcastTarget;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MailService
{
    /**
     * 一括メール送信を実行
     */
    public function sendBroadcastMail(array $data, array $targetUserIds)
    {
        try {
            // メール配信メッセージを作成
            $broadcastMessage = EmailBroadcastMessage::create([
                'admin_user_id' => auth()->id(),
                'subject' => $data['subject'],
                'body' => $data['body'],
                'status' => 'sending'
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
                    Mail::raw($data['body'], function ($message) use ($user, $data) {
                        $message->to($user->email, $user->name)
                               ->subject($data['subject']);
                    });
                    $successCount++;
                } catch (\Exception $e) {
                    Log::error('メール送信失敗', [
                        'user_id' => $user->id,
                        'email' => $user->email,
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
                'data' => $data
            ]);

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