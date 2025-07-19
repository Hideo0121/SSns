<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'user_code' => 'admin001',
                'name' => '管理者',
                'email' => 'admin@ssns.local',
                'password' => bcrypt('password'),
                'role' => '全権管理者',
                'phone_number' => '03-1234-5678',
                'mobile_phone_number' => '090-1234-5678',
            ],
            [
                'user_code' => 'staff001',
                'name' => 'スタッフA',
                'email' => 'staff1@ssns.local',
                'password' => bcrypt('password'),
                'role' => 'スタッフ',
                'phone_number' => '03-1234-5679',
                'mobile_phone_number' => '090-1234-5679',
            ],
            [
                'user_code' => 'staff002',
                'name' => 'スタッフB',
                'email' => 'staff2@ssns.local',
                'password' => bcrypt('password'),
                'role' => 'スタッフ',
                'phone_number' => '03-1234-5680',
                'mobile_phone_number' => '090-1234-5680',
            ],
        ];

        foreach ($users as $user) {
            \App\Models\User::create($user);
        }
    }
}
