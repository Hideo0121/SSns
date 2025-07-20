<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\StaffController;
use App\Http\Controllers\Api\V1\ThreadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API v1 routes
Route::prefix('v1')->group(function () {
    
    // 認証不要のヘルスチェック
    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'status' => 'ok',
                'version' => 'v1',
                'server_time' => now()->toISOString(),
                'features' => [
                    'csrf_protection' => true,
                    'session_security' => true,
                    'api_versioning' => true,
                    'error_handling' => true
                ]
            ],
            'message' => 'API サーバーは正常に稼働しています'
        ]);
    });
    
    // テスト用エンドポイント (開発環境のみ - 認証不要)
    if (app()->environment('local', 'testing')) {
        Route::get('test/error/{code?}', function ($code = null) {
            if (!$code) {
                return response()->json([
                    'success' => true,
                    'message' => 'エラーテスト用エンドポイント',
                    'available_codes' => ['400', '403', '404', '422', '500']
                ]);
            }
            
            switch ($code) {
                case '400':
                    abort(400, 'Bad Request Test');
                case '403':
                    abort(403, 'Forbidden Test');
                case '404':
                    abort(404, 'Not Found Test');
                case '422':
                    throw new \Illuminate\Validation\ValidationException(
                        validator(['test' => null], ['test' => 'required'])
                    );
                case '500':
                    throw new \Exception('Internal Server Error Test');
                default:
                    return response()->json([
                        'success' => false,
                        'message' => '無効なエラーコード',
                        'available_codes' => ['400', '403', '404', '422', '500']
                    ], 400);
            }
        });
    }
    
    Route::middleware('auth:sanctum')->group(function () {
        // スタッフ管理 API (管理者のみ)
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('staff', StaffController::class)->names([
                'index' => 'api.staff.index',
                'store' => 'api.staff.store',
                'show' => 'api.staff.show',
                'update' => 'api.staff.update',
                'destroy' => 'api.staff.destroy',
            ]);
        });
        
        // 掲示板 API
        Route::apiResource('threads', ThreadController::class)->names([
            'index' => 'api.threads.index',
            'store' => 'api.threads.store',
            'show' => 'api.threads.show',
            'update' => 'api.threads.update',
            'destroy' => 'api.threads.destroy',
        ]);
        
        // カテゴリ一覧
        Route::get('/categories', function () {
            $categories = \App\Models\Category::select('id', 'name', 'description')
                ->orderBy('name')
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $categories,
                'message' => 'カテゴリ一覧を取得しました'
            ]);
        });
        
        // 現在のユーザー情報
        Route::get('user', function (Request $request) {
            return response()->json([
                'success' => true,
                'data' => $request->user(),
                'message' => 'ユーザー情報を取得しました',
                'meta' => [
                    'version' => '1.0',
                    'timestamp' => now()->toISOString()
                ]
            ]);
        });
    });
});

// API v2 routes (将来の拡張用)
Route::prefix('v2')->group(function () {
    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'status' => 'ok',
                'version' => 'v2',
                'server_time' => now()->toISOString(),
                'note' => 'V2 API は開発中です'
            ],
            'message' => 'API v2 ヘルスチェック'
        ]);
    });
    
    Route::middleware('auth:sanctum')->group(function () {
        // v2での新機能や破壊的変更を含む API
    });
});
