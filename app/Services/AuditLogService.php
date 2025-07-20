<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditLogService
{
    /**
     * Log an audit event
     */
    public static function log(
        string $action,
        Model $model = null,
        array $oldValues = null,
        array $newValues = null,
        string $description = null,
        Request $request = null
    ): AuditLog {
        $request = $request ?: request();
        
        // 認証されたユーザーの実際のIDを取得
        $userId = null;
        if (Auth::check()) {
            $user = Auth::user();
            $userId = $user->id; // user_codeではなくidを使用
        }
        
        return AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model?->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'url' => $request?->fullUrl(),
            'method' => $request?->method(),
            'description' => $description,
        ]);
    }

    /**
     * Log model creation
     */
    public static function logCreate(Model $model, string $description = null): AuditLog
    {
        return self::log(
            'create',
            $model,
            null,
            $model->getAttributes(),
            $description ?: "Created {$model->getTable()} record"
        );
    }

    /**
     * Log model update
     */
    public static function logUpdate(Model $model, array $oldValues, string $description = null): AuditLog
    {
        return self::log(
            'update',
            $model,
            $oldValues,
            $model->getChanges(),
            $description ?: "Updated {$model->getTable()} record"
        );
    }

    /**
     * Log model deletion
     */
    public static function logDelete(Model $model, string $description = null): AuditLog
    {
        return self::log(
            'delete',
            $model,
            $model->getAttributes(),
            null,
            $description ?: "Deleted {$model->getTable()} record"
        );
    }

    /**
     * Log view action
     */
    public static function logView(Model $model = null, string $description = null): AuditLog
    {
        return self::log(
            'view',
            $model,
            null,
            null,
            $description ?: ($model ? "Viewed {$model->getTable()} record" : "Page accessed")
        );
    }

    /**
     * Log custom action
     */
    public static function logAction(
        string $action,
        string $description,
        Model $model = null,
        array $data = null
    ): AuditLog {
        return self::log(
            $action,
            $model,
            null,
            $data,
            $description
        );
    }

    /**
     * Get audit logs with filters
     */
    public static function getAuditLogs(array $filters = [])
    {
        $query = AuditLog::with('user')
            ->orderBy('created_at', 'desc');

        // Date range filter
        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->dateRange($filters['start_date'], $filters['end_date']);
        }

        // Action filter
        if (!empty($filters['action'])) {
            $query->action($filters['action']);
        }

        // Model type filter
        if (!empty($filters['model_type'])) {
            $query->modelType($filters['model_type']);
        }

        // User filter
        if (!empty($filters['user_id'])) {
            $query->byUser($filters['user_id']);
        }

        // Search in description
        if (!empty($filters['search'])) {
            $query->where('description', 'like', '%' . $filters['search'] . '%');
        }

        return $query->paginate($filters['per_page'] ?? 25); // ページサイズを25に削減
    }

    /**
     * Export audit logs to CSV
     */
    public static function exportToCsv(array $filters = [])
    {
        $query = AuditLog::with('user')->orderBy('created_at', 'desc');

        // Apply same filters as getAuditLogs
        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->dateRange($filters['start_date'], $filters['end_date']);
        }

        if (!empty($filters['action'])) {
            $query->action($filters['action']);
        }

        if (!empty($filters['model_type'])) {
            $query->modelType($filters['model_type']);
        }

        if (!empty($filters['user_id'])) {
            $query->byUser($filters['user_id']);
        }

        if (!empty($filters['search'])) {
            $query->where('description', 'like', '%' . $filters['search'] . '%');
        }

        return $query->get();
    }

    /**
     * Get available actions for filtering
     */
    public static function getAvailableActions(): array
    {
        return AuditLog::distinct('action')
            ->pluck('action')
            ->filter()
            ->sort()
            ->values()
            ->toArray();
    }

    /**
     * Get available model types for filtering
     */
    public static function getAvailableModelTypes(): array
    {
        return AuditLog::distinct('model_type')
            ->pluck('model_type')
            ->filter()
            ->map(function ($modelType) {
                return class_basename($modelType);
            })
            ->sort()
            ->values()
            ->toArray();
    }
}
