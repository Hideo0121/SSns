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
        Schema::table('email_broadcast_messages', function (Blueprint $table) {
            $table->json('attachment_info')->nullable()->after('body')->comment('添付ファイル情報（ファイル名、サイズなど）');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('email_broadcast_messages', function (Blueprint $table) {
            $table->dropColumn('attachment_info');
        });
    }
};
