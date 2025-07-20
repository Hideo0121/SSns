<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

abstract class ApiController extends Controller
{
    /**
     * API成功レスポンス
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function successResponse($data = null, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString()
            ]
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * APIエラーレスポンス
     *
     * @param string $message
     * @param int $statusCode
     * @param string|null $errorCode
     * @param array $details
     * @return JsonResponse
     */
    protected function errorResponse(
        string $message = 'Error occurred',
        int $statusCode = 400,
        ?string $errorCode = null,
        array $details = []
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
            'error_code' => $errorCode ?? 'E' . $statusCode,
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString()
            ]
        ];

        if (!empty($details)) {
            $response['details'] = $details;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * バリデーションエラーレスポンス
     *
     * @param array $errors
     * @return JsonResponse
     */
    protected function validationErrorResponse(array $errors): JsonResponse
    {
        return $this->errorResponse(
            'バリデーションエラーが発生しました',
            422,
            'VALIDATION_ERROR',
            $errors
        );
    }

    /**
     * 認証エラーレスポンス
     *
     * @return JsonResponse
     */
    protected function unauthorizedResponse(): JsonResponse
    {
        return $this->errorResponse(
            '認証が必要です',
            401,
            'UNAUTHORIZED'
        );
    }

    /**
     * 権限エラーレスポンス
     *
     * @return JsonResponse
     */
    protected function forbiddenResponse(): JsonResponse
    {
        return $this->errorResponse(
            'この操作を実行する権限がありません',
            403,
            'FORBIDDEN'
        );
    }

    /**
     * リソース未発見エラーレスポンス
     *
     * @return JsonResponse
     */
    protected function notFoundResponse(): JsonResponse
    {
        return $this->errorResponse(
            'リソースが見つかりません',
            404,
            'NOT_FOUND'
        );
    }

    /**
     * サーバーエラーレスポンス
     *
     * @return JsonResponse
     */
    protected function serverErrorResponse(): JsonResponse
    {
        return $this->errorResponse(
            'サーバー内部エラーが発生しました',
            500,
            'INTERNAL_SERVER_ERROR'
        );
    }
}
