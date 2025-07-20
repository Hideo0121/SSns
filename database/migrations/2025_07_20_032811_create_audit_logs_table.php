<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('action'); // create, update, delete, view, etc.
            $table->string('model_type')->nullable(); // User, Thread, Comment, etc.
            $table->unsignedBigInteger('model_id')->nullable(); // 対象レコードのID
            $table->json('old_values')->nullable(); // 変更前の値
            $table->json('new_values')->nullable(); // 変更後の値
            $table->string('ip_address', 45)->nullable(); // IPv6対応
            $table->string('user_agent')->nullable();
            $table->string('url')->nullable();
            $table->string('method', 10)->nullable(); // GET, POST, PUT, DELETE
            $table->text('description')->nullable(); // 操作の説明
            $table->timestamps();
            
            // インデックス（パフォーマンス最適化）
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
            $table->index(['action', 'created_at']);
            $table->index(['created_at']); // 最新順ソート用
            $table->index(['user_id']); // ユーザー別フィルタ用
            $table->index(['action']); // アクション別フィルタ用
            $table->index(['model_type']); // モデル別フィルタ用
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
