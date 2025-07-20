<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Thread;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Api\StoreThreadRequest;
use App\Http\Requests\Api\UpdateThreadRequest;

class ThreadController extends V1Controller
{
    /**
     * トピック一覧取得
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Thread::with(['user', 'category']);

            // カテゴリフィルター
            if ($request->has('category_id')) {
                $query->where('category_id', $request->input('category_id'));
            }

            // 検索機能
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            }

            // ソート
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // ページネーション
            $perPage = $request->input('per_page', 20);
            $threads = $query->paginate($perPage);

            return $this->successResponse(
                $threads,
                'トピック一覧を取得しました'
            );
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }

    /**
     * トピック詳細取得
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $thread = Thread::with([
                'user',
                'category',
                'comments.user'
            ])->findOrFail($id);
            
            return $this->successResponse(
                $thread,
                'トピック詳細を取得しました'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse();
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }

    /**
     * トピック作成
     *
     * @param StoreThreadRequest $request
     * @return JsonResponse
     */
    public function store(StoreThreadRequest $request): JsonResponse
    {
        try {
            $thread = Thread::create([
                ...$request->validated(),
                'user_id' => auth()->id()
            ]);
            
            $thread->load(['user', 'category']);
            
            return $this->successResponse(
                $thread,
                'トピックを作成しました',
                201
            );
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }

    /**
     * トピック更新
     *
     * @param UpdateThreadRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateThreadRequest $request, int $id): JsonResponse
    {
        try {
            $thread = Thread::findOrFail($id);
            
            // 権限チェック
            if ($thread->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
                return $this->forbiddenResponse();
            }
            
            $thread->update($request->validated());
            $thread->load(['user', 'category']);
            
            return $this->successResponse(
                $thread,
                'トピックを更新しました'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse();
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }

    /**
     * トピック削除
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $thread = Thread::findOrFail($id);
            
            // 権限チェック
            if ($thread->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
                return $this->forbiddenResponse();
            }
            
            $thread->delete();
            
            return $this->successResponse(
                null,
                'トピックを削除しました'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse();
        } catch (\Exception $e) {
            return $this->serverErrorResponse();
        }
    }
}
