<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Avatar extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'cover_image',
        'starting_price',
        'badge',
        'is_featured',
        'status',
        'views_count',
        'sort_order',
    ];

    protected $casts = [
        'starting_price' => 'integer',
        'is_featured' => 'boolean',
        'views_count' => 'integer',
        'sort_order' => 'integer',
    ];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'avatar_category');
    }

    public function images(): HasMany
    {
        return $this->hasMany(AvatarImage::class)->orderBy('sort_order', 'asc');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
