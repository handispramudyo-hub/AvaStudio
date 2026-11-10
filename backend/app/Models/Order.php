<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name',
        'roblox_username',
        'whatsapp',
        'avatar_id',
        'requested_style',
        'budget',
        'request_notes',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'budget' => 'integer',
    ];

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Avatar::class);
    }
}
