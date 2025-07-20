<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;

/**
 * API v1 基底コントローラー
 * 
 * API v1の共通機能を提供します。
 * バージョン固有の機能がある場合はここに追加します。
 */
class V1Controller extends ApiController
{
    /**
     * APIバージョン情報を取得
     *
     * @return string
     */
    protected function getApiVersion(): string
    {
        return 'v1';
    }

    /**
     * バージョン情報付きメタデータを生成
     *
     * @param array $meta 追加メタデータ
     * @return array
     */
    protected function getVersionedMeta(array $meta = []): array
    {
        return array_merge([
            'api_version' => $this->getApiVersion(),
            'timestamp' => now()->toISOString(),
        ], $meta);
    }

    /**
     * バージョン情報付き成功レスポンス
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @param array $meta
     * @return \Illuminate\Http\JsonResponse
     */
    protected function versionedSuccessResponse($data = null, string $message = '', int $statusCode = 200, array $meta = []): \Illuminate\Http\JsonResponse
    {
        return $this->successResponse($data, $message, $statusCode, $this->getVersionedMeta($meta));
    }
}
