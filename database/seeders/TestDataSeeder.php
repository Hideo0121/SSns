<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Thread;
use App\Models\Comment;
use App\Models\Message;
use App\Models\EmailBroadcastMessage;
use App\Models\MaintenanceLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // テスト用ユーザーを作成
        $admin = User::create([
            'name' => '管理者',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'user_code' => 'ADMIN001',
            'email_verified_at' => now(),
        ]);

        $generalUser = User::create([
            'name' => '一般ユーザー',
            'email' => 'user@test.com',
            'password' => Hash::make('password'),
            'role' => 'general',
            'user_code' => 'USER001',
            'email_verified_at' => now(),
        ]);

        $staffUser = User::create([
            'name' => 'スタッフ田中',
            'email' => 'tanaka@test.com',
            'password' => Hash::make('password'),
            'role' => 'general',
            'user_code' => 'STAFF001',
            'email_verified_at' => now(),
        ]);

        // テスト用ユーザーを50件作成
        $users = User::factory()->count(50)->create();
        $admin = $users[0];
        $generalUser = $users[1];
        $staffUser = $users[2];

        // カテゴリーを作成
        $generalCategory = Category::create([
            'name' => '一般',
            'description' => '一般的な話題',
        ]);

        $workCategory = Category::create([
            'name' => '業務',
            'description' => '業務に関する話題',
        ]);

        $noticeCategory = Category::create([
            'name' => 'お知らせ',
            'description' => '重要なお知らせ',
        ]);

        // スレッドを作成
        $thread1 = Thread::create([
            'title' => '新年度の目標について',
            'content' => '新年度が始まりましたので、各自の目標を共有しましょう。',
            'category_id' => $workCategory->id,
            'user_id' => $admin->id,
        ]);

        $thread2 = Thread::create([
            'title' => 'システム更新のお知らせ',
            'content' => '来月システムの更新を予定しています。詳細は追って連絡します。',
            'category_id' => $noticeCategory->id,
            'user_id' => $admin->id,
        ]);

        $thread3 = Thread::create([
            'title' => 'ランチのおすすめ',
            'content' => '近くで美味しいランチ場所があれば教えてください。',
            'category_id' => $generalCategory->id,
            'user_id' => $generalUser->id,
        ]);

        // コメントを作成
        Comment::create([
            'content' => '今年は売上20%アップを目指したいと思います！',
            'thread_id' => $thread1->id,
            'user_id' => $staffUser->id,
        ]);

        Comment::create([
            'content' => '素晴らしい目標ですね。応援しています。',
            'thread_id' => $thread1->id,
            'user_id' => $admin->id,
        ]);

        Comment::create([
            'content' => 'システム更新の間、業務に影響はありますか？',
            'thread_id' => $thread2->id,
            'user_id' => $generalUser->id,
        ]);

        Comment::create([
            'content' => '駅前のカフェレストランがおすすめです。パスタが美味しいですよ。',
            'thread_id' => $thread3->id,
            'user_id' => $staffUser->id,
        ]);

        // メッセージを作成
        Message::create([
            'subject' => '会議の件',
            'content' => '明日の会議の資料準備はいかがですか？',
            'sender_id' => $admin->id,
            'recipient_id' => $staffUser->id,
        ]);

        Message::create([
            'subject' => 'Re: 会議の件',
            'content' => '資料の準備は完了しています。よろしくお願いします。',
            'sender_id' => $staffUser->id,
            'recipient_id' => $admin->id,
        ]);

        // 一斉配信メッセージを作成
        EmailBroadcastMessage::create([
            'subject' => '年末年始の休業について',
            'content' => '年末年始の休業期間をお知らせします。12月29日〜1月3日まで休業とさせていただきます。',
            'user_id' => $admin->id,
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        // メンテナンスログを作成
        MaintenanceLog::create([
            'title' => 'サーバーメンテナンス',
            'description' => '定期メンテナンスを実施しました。',
            'start_time' => now()->subHours(2),
            'end_time' => now()->subHour(),
            'user_id' => $admin->id,
        ]);

        MaintenanceLog::create([
            'title' => 'データベース最適化',
            'description' => 'データベースの最適化を実行しました。',
            'start_time' => now()->subDays(7),
            'end_time' => now()->subDays(7)->addHours(1),
            'user_id' => $admin->id,
        ]);

        $this->command->info('テストデータの作成が完了しました。');
        $this->command->info('ログイン情報:');
        $this->command->info('管理者: admin@test.com / password');
        $this->command->info('一般ユーザー: user@test.com / password');
        $this->command->info('スタッフ: tanaka@test.com / password');
    }
}
