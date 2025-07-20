<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // 認証確認
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => '認証が必要です',
                'error_code' => 'UNAUTHORIZED'
            ], 401);
        }

        $user = auth()->user();
        
        // 役割確認
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'この操作を実行する権限がありません',
                'error_code' => 'FORBIDDEN',
                'required_roles' => $roles,
                'current_role' => $user->role
            ], 403);
        }

        return $next($request);
    }
}
