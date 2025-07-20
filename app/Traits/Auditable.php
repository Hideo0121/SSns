<?php

namespace App\Traits;

use App\Services\AuditLogService;

trait Auditable
{
    /**
     * Auditable original values storage
     */
    protected $auditableOriginalValues = [];

    /**
     * Boot the auditable trait
     */
    protected static function bootAuditable()
    {
        // Model created
        static::created(function ($model) {
            AuditLogService::logCreate($model);
        });

        // Model updating: 更新前の値を保存
        static::updating(function ($model) {
            $model->auditableOriginalValues = $model->getAuditableOriginal();
        });

        // Model updated: ログに更新前・更新後を出力
        static::updated(function ($model) {
            $original = $model->auditableOriginalValues ?? [];
            AuditLogService::logUpdate($model, $original);
        });

        // Model deleted
        static::deleted(function ($model) {
            AuditLogService::logDelete($model);
        });
    }

    /**
     * Get the auditable attributes (override in model if needed)
     */
    public function getAuditableAttributes(): array
    {
        // デフォルトでは全ての fillable 属性を対象とする
        return $this->getFillable();
    }

    /**
     * Check if an attribute should be audited
     */
    public function shouldAuditAttribute(string $attribute): bool
    {
        $auditableAttributes = $this->getAuditableAttributes();
       
        // 空の場合は全ての fillable 属性を対象
        if (empty($auditableAttributes)) {
            return in_array($attribute, $this->getFillable());
        }

        return in_array($attribute, $auditableAttributes);
    }

    /**
     * Get auditable changes (filtered)
     */
    public function getAuditableChanges(): array
    {
        $changes = $this->getChanges();
        $auditable = [];

        foreach ($changes as $attribute => $value) {
            if ($this->shouldAuditAttribute($attribute)) {
                $auditable[$attribute] = $value;
            }
        }

        return $auditable;
    }

    /**
     * Get auditable original values (filtered)
     */
    public function getAuditableOriginal(): array
    {
        $original = $this->getOriginal();
        $auditable = [];

        foreach ($original as $attribute => $value) {
            if ($this->shouldAuditAttribute($attribute)) {
                $auditable[$attribute] = $value;
            }
        }

        return $auditable;
    }
}
