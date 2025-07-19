<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailBroadcastMessage extends Model
{
    protected $fillable = [
        'admin_user_id',
        'subject',
        'body',
        'sent_at',
        'status'
    ];

    protected $casts = [
        'sent_at' => 'datetime'
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }

    public function targets()
    {
        return $this->hasMany(EmailBroadcastTarget::class, 'broadcast_id');
    }

    public function getStatusColorAttribute()
    {
        switch ($this->status) {
            case 'sent':
                return 'success';
            case 'sending':
                return 'info';
            case 'failed':
            case 'partial_failed':
                return 'error';
            default:
                return 'default';
        }
    }

    public function getStatusLabelAttribute()
    {
        switch ($this->status) {
            case 'draft':
                return '下書き';
            case 'sending':
                return '送信中';
            case 'sent':
                return '送信完了';
            case 'failed':
                return '送信失敗';
            case 'partial_failed':
                return '一部失敗';
            default:
                return '不明';
        }
    }
}
