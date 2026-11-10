<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AvatarImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'avatar_id',
        'image_path',
        'alt_text',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Avatar::class);
    }
}
