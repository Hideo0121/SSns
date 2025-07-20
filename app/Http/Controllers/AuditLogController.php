<?php

namespace App\Http\Controllers;

use App\Services\AuditLogService;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditLogController extends Controller
{
    /**
     * Display audit logs
     */
    public function index(Request $request)
    {
        // 監査ログ画面アクセス時のログ記録を一時的に無効化（パフォーマンステスト）
        // AuditLogService::logView(null, '監査ログ画面を表示');

        $filters = $request->only([
            'start_date',
            'end_date',
            'action',
            'model_type',
            'user_id',
            'search',
            'per_page'
        ]);

        $auditLogs = AuditLogService::getAuditLogs($filters);

        // フィルター用データ
        $users = User::select('id', 'name', 'user_code')
            ->orderBy('name')
            ->get();

        $availableActions = AuditLogService::getAvailableActions();
        $availableModelTypes = AuditLogService::getAvailableModelTypes();

        return Inertia::render('AuditLog/Index', [
            'auditLogs' => $auditLogs,
            'filters' => $filters,
            'users' => $users,
            'availableActions' => $availableActions,
            'availableModelTypes' => $availableModelTypes,
        ]);
    }

    /**
     * Export audit logs to CSV
     */
    public function export(Request $request)
    {
        // エクスポート操作をログに記録
        AuditLogService::logAction(
            'export',
            '監査ログをCSVエクスポート',
            null,
            $request->only(['start_date', 'end_date', 'action', 'model_type', 'user_id', 'search'])
        );

        $filters = $request->only([
            'start_date',
            'end_date',
            'action',
            'model_type',
            'user_id',
            'search'
        ]);

        $auditLogs = AuditLogService::exportToCsv($filters);

        $filename = 'audit_logs_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $response = new StreamedResponse(function () use ($auditLogs) {
            $handle = fopen('php://output', 'w');

            // BOM for UTF-8
            fwrite($handle, "\xEF\xBB\xBF");

            // CSV header
            fputcsv($handle, [
                'ID',
                '日時',
                'ユーザー',
                'ユーザーコード',
                'アクション',
                '対象モデル',
                '対象ID',
                '説明',
                'IPアドレス',
                'ユーザーエージェント',
                'URL',
                'HTTPメソッド',
                '変更前',
                '変更後'
            ]);

            // CSV data
            foreach ($auditLogs as $log) {
                fputcsv($handle, [
                    $log->id,
                    $log->created_at->format('Y-m-d H:i:s'),
                    $log->user?->name ?? '不明',
                    $log->user?->user_code ?? '',
                    $log->action,
                    $log->model_type ? class_basename($log->model_type) : '',
                    $log->model_id ?? '',
                    $log->description,
                    $log->ip_address,
                    $log->user_agent,
                    $log->url,
                    $log->method,
                    $log->old_values ? json_encode($log->old_values, JSON_UNESCAPED_UNICODE) : '',
                    $log->new_values ? json_encode($log->new_values, JSON_UNESCAPED_UNICODE) : '',
                ]);
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

        return $response;
    }

    /**
     * Show detailed audit log
     */
    public function show($id)
    {
        $auditLog = AuditLog::with('user')->findOrFail($id);

        // 詳細表示をログに記録
        AuditLogService::logView($auditLog, "監査ログ詳細を表示: ID {$id}");

        return Inertia::render('AuditLog/Show', [
            'auditLog' => $auditLog,
        ]);
    }
}
