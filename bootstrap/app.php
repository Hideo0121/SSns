<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\SessionSecurity::class,
        ]);

        // APIミドルウェア - Sanctumを有効にする
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminOnly::class,
            'session.security' => \App\Http\Middleware\SessionSecurity::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // API 用のエラーハンドリング
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => '認証が必要です',
                    'error_code' => 'UNAUTHORIZED',
                    'meta' => [
                        'version' => '1.0',
                        'timestamp' => now()->toISOString()
                    ]
                ], 401);
            }
        });

        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'この操作を実行する権限がありません',
                    'error_code' => 'FORBIDDEN',
                    'meta' => [
                        'version' => '1.0',
                        'timestamp' => now()->toISOString()
                    ]
                ], 403);
            }
        });

        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'リソースが見つかりません',
                    'error_code' => 'NOT_FOUND',
                    'meta' => [
                        'version' => '1.0',
                        'timestamp' => now()->toISOString()
                    ]
                ], 404);
            }
        });

        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'バリデーションエラーが発生しました',
                    'error_code' => 'VALIDATION_ERROR',
                    'details' => $e->errors(),
                    'meta' => [
                        'version' => '1.0',
                        'timestamp' => now()->toISOString()
                    ]
                ], 422);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage() ?: 'HTTPエラーが発生しました',
                    'error_code' => 'HTTP_ERROR_' . $e->getStatusCode(),
                    'meta' => [
                        'version' => '1.0',
                        'timestamp' => now()->toISOString()
                    ]
                ], $e->getStatusCode());
            }
        });

        $exceptions->render(function (\Throwable $e, $request) {
            if ($request->is('api/*')) {
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                return response()->json([
                    'success' => false,
                    'message' => config('app.debug') ? $e->getMessage() : 'サーバー内部エラーが発生しました',
                    'error_code' => 'INTERNAL_SERVER_ERROR',
                    'meta' => [
                        'version' => '1.0',
                        'timestamp' => now()->toISOString()
                    ]
                ], $statusCode);
            }
        });
    })->create();
