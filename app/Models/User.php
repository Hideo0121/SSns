<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\Auditable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Auditable;

    /**
     * Get the auditable attributes (exclude sensitive data)
     */
    public function getAuditableAttributes(): array
    {
        return [
            'user_code',
            'name',
            'email',
            'role',
            'phone_number',
            'mobile_phone_number',
            'avatar_photo',
        ];
    }

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_code',
        'name',
        'email',
        'password',
        'role',
        'phone_number',
        'mobile_phone_number',
        'avatar_photo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'auditableOriginalValues',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Set the avatar_photo attribute, filtering out invalid values.
     */
    public function setAvatarPhotoAttribute($value)
    {
        \Log::info('setAvatarPhotoAttribute called with:', [
            'value' => $value,
            'type' => gettype($value),
            'empty' => empty($value),
            'is_zero_string' => $value === '0',
            'is_zero_int' => $value === 0,
            'is_false' => $value === false
        ]);
        
        // 無効な値（0, '0', '', false など）はnullに変換
        if (empty($value) || $value === '0' || $value === 0 || $value === false) {
            \Log::info('Converting invalid value to null');
            $this->attributes['avatar_photo'] = null;
        } else {
            \Log::info('Setting valid value:', [$value]);
            $this->attributes['avatar_photo'] = $value;
        }
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function threads()
    {
        return $this->hasMany(Thread::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function broadcastMessages()
    {
        return $this->hasMany(EmailBroadcastMessage::class, 'admin_user_id');
    }

    public function maintenanceLogs()
    {
        return $this->hasMany(MaintenanceLog::class);
    }

    public function isAdmin()
    {
        return in_array($this->role, ['全権管理者', '一般管理者']);
    }

    public function isSuperAdmin()
    {
        return $this->role === '全権管理者';
    }

    public function getAuthIdentifierName()
    {
        return 'user_code';
    }

    public function findForPassport($username)
    {
        return $this->where('user_code', $username)->first();
    }

}
