<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Api\StoreUserRequest;
use App\Http\Requests\Api\UpdateUserRequest;

class StaffController extends V1Controller
{
    /**
     * スタッフ一覧取得
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();

            // 検索機能
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('user_code', 'like', "%{$search}%");
                });
            }

            // 権限フィルター
            if ($request->has('role')) {
                $query->where('role', $request->input('role'));
            }

            // ページネーション
            $perPage = $request->input('per_page', 20);
            $staff = $query->paginate($perPage);

            return $this->successResponse(
                $staff,
                'スタッフ一覧を取得しました'
            );
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }

    /**
     * スタッフ詳細取得
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $staff = User::findOrFail($id);
            
            return $this->successResponse(
                $staff,
                'スタッフ詳細を取得しました'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse();
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }

    /**
     * スタッフ作成
     *
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $staff = User::create($request->validated());
            
            return $this->successResponse(
                $staff,
                'スタッフを作成しました',
                201
            );
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }

    /**
     * スタッフ更新
     *
     * @param UpdateUserRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            $staff = User::findOrFail($id);
            $staff->update($request->validated());
            
            return $this->successResponse(
                $staff,
                'スタッフ情報を更新しました'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse();
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }

    /**
     * スタッフ削除
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $staff = User::findOrFail($id);
            
            // 自分自身の削除を防ぐ
            if ($staff->id === auth()->id()) {
                return $this->errorResponse(
                    '自分自身を削除することはできません',
                    400,
                    'CANNOT_DELETE_SELF'
                );
            }
            
            $staff->delete();
            
            return $this->successResponse(
                null,
                'スタッフを削除しました'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse();
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }
}
