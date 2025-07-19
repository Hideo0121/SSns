<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailBroadcastTarget extends Model
{
    protected $fillable = [
        'broadcast_id',
        'user_id'
    ];

    public function broadcast()
    {
        return $this->belongsTo(EmailBroadcastMessage::class, 'broadcast_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
