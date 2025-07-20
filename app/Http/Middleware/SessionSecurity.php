<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SessionSecurity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // IPアドレスチェック
        if ($request->session()->has('user_ip')) {
            if ($request->session()->get('user_ip') !== $request->ip()) {
                $request->session()->flush();
                auth()->logout();
                return redirect()->route('login')->with('error', 'セキュリティ上の理由によりログアウトしました。');
            }
        } else if (auth()->check()) {
            $request->session()->put('user_ip', $request->ip());
        }

        // User-Agentチェック
        if ($request->session()->has('user_agent')) {
            if ($request->session()->get('user_agent') !== $request->userAgent()) {
                $request->session()->flush();
                auth()->logout();
                return redirect()->route('login')->with('error', 'セキュリティ上の理由によりログアウトしました。');
            }
        } else if (auth()->check()) {
            $request->session()->put('user_agent', $request->userAgent());
        }

        // セッション再生成（ログイン時）
        if (auth()->check() && !$request->session()->has('session_regenerated')) {
            $request->session()->regenerate();
            $request->session()->put('session_regenerated', true);
        }

        return $next($request);
    }
}
