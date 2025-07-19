<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => '一般'],
            ['name' => 'お知らせ'],
            ['name' => 'イベント'],
            ['name' => 'その他'],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}
