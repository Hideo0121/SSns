<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Auditable;

class Thread extends Model
{
    use Auditable;
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'category_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function isFavoritedBy($userId)
    {
        return $this->favorites()->where('user_id', $userId)->exists();
    }

    public function getCommentsCountAttribute()
    {
        return $this->comments()->count();
    }

    public function getFavoritesCountAttribute()
    {
        return $this->favorites()->count();
    }
}
