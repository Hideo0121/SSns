<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Session\TokenMismatchException;

class Handler extends ExceptionHandler
{
    /**
     * Report or log an exception.
     */
    public function report(Throwable $exception): void
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        // 419 TokenMismatchException（CSRF/セッション切れ）時はログイン画面へリダイレクト
        if ($exception instanceof TokenMismatchException) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'セッションが切れました。再度ログインしてください。',
                    'redirect' => route('login')
                ], 419);
            }
            
            return redirect()->route('login')
                ->with('error', 'セッションが切れました。再度ログインしてください。');
        }

        return parent::render($request, $exception);
    }
}
