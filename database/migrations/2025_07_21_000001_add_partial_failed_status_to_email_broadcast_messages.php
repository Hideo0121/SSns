<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // PostgreSQLでのenum値の追加
        DB::statement("ALTER TABLE email_broadcast_messages DROP CONSTRAINT IF EXISTS email_broadcast_messages_status_check");
        
        // 新しい制約を追加（partial_failedを含む）
        DB::statement("ALTER TABLE email_broadcast_messages ADD CONSTRAINT email_broadcast_messages_status_check CHECK (status IN ('draft', 'sending', 'sent', 'failed', 'partial_failed'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 元の制約に戻す
        DB::statement("ALTER TABLE email_broadcast_messages DROP CONSTRAINT IF EXISTS email_broadcast_messages_status_check");
        DB::statement("ALTER TABLE email_broadcast_messages ADD CONSTRAINT email_broadcast_messages_status_check CHECK (status IN ('draft', 'sending', 'sent', 'failed'))");
    }
};
