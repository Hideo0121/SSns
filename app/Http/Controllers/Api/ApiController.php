<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * API共通基底コントローラー
 * 
 * すべてのAPIコントローラーの基底クラスとして機能し、
 * API共通のレスポンス形式やヘルパーメソッドを提供します。
 */
class ApiController extends Controller
{
    /**
     * 成功レスポンスを返す
     *
     * @param mixed $data レスポンスデータ
     * @param string $message メッセージ
     * @param int $statusCode ステータスコード
     * @param array $meta メタ情報
     * @return JsonResponse
     */
    protected function successResponse($data = null, string $message = '', int $statusCode = 200, array $meta = []): JsonResponse
    {
        $response = [
            'success' => true,
            'data' => $data,
        ];

        if (!empty($message)) {
            $response['message'] = $message;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * エラーレスポンスを返す
     *
     * @param string $message エラーメッセージ
     * @param int $statusCode ステータスコード
     * @param mixed $errors エラー詳細
     * @param array $meta メタ情報
     * @return JsonResponse
     */
    protected function errorResponse(string $message, int $statusCode = 400, $errors = null, array $meta = []): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * バリデーションエラーレスポンスを返す
     *
     * @param mixed $errors バリデーションエラー
     * @param string $message メッセージ
     * @return JsonResponse
     */
    protected function validationErrorResponse($errors, string $message = 'バリデーションエラー'): JsonResponse
    {
        return $this->errorResponse($message, 422, $errors);
    }

    /**
     * Not Foundエラーレスポンスを返す
     *
     * @param string $message メッセージ
     * @return JsonResponse
     */
    protected function notFoundResponse(string $message = 'リソースが見つかりません'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * 認証エラーレスポンスを返す
     *
     * @param string $message メッセージ
     * @return JsonResponse
     */
    protected function unauthorizedResponse(string $message = '認証が必要です'): JsonResponse
    {
        return $this->errorResponse($message, 401);
    }

    /**
     * 権限エラーレスポンスを返す
     *
     * @param string $message メッセージ
     * @return JsonResponse
     */
    protected function forbiddenResponse(string $message = 'アクセス権限がありません'): JsonResponse
    {
        return $this->errorResponse($message, 403);
    }

    /**
     * ページネーション付きレスポンスを返す
     *
     * @param mixed $data ページネーションデータ
     * @param string $message メッセージ
     * @return JsonResponse
     */
    protected function paginatedResponse($data, string $message = ''): JsonResponse
    {
        $meta = [
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
            ]
        ];

        return $this->successResponse($data->items(), $message, 200, $meta);
    }
}
