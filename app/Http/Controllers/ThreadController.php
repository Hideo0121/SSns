<?php

namespace App\Http\Controllers;

use App\Models\Thread;
use App\Models\Category;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThreadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Thread::with(['user', 'category', 'comments', 'favorites']);
        
        // カテゴリフィルタ
        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }
        
        // 検索機能
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }
        
        $threads = $query->orderBy('created_at', 'desc')
                        ->paginate(10)
                        ->withQueryString();
        
        $categories = Category::orderBy('name')->get();
        
        return Inertia::render('Board/Index', [
            'threads' => $threads,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::orderBy('name')->get();
        
        return Inertia::render('Board/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'new_category' => ['nullable', 'string', 'max:100']
        ]);
        
        // 新しいカテゴリが指定された場合は作成する
        if (!empty($validated['new_category'])) {
            $category = Category::firstOrCreate(
                ['name' => trim($validated['new_category'])]
            );
            $validated['category_id'] = $category->id;
        }
        
        // カテゴリが指定されていない場合はエラー
        if (empty($validated['category_id'])) {
            return back()->withErrors([
                'category' => 'カテゴリを選択するか、新しいカテゴリ名を入力してください。'
            ]);
        }
        
        $validated['user_id'] = auth()->user()->id;
        
        // new_categoryは不要なので削除
        unset($validated['new_category']);
        
        $thread = Thread::create($validated);
        
        return redirect()->route('threads.show', $thread)
                        ->with('success', 'トピックが正常に作成されました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Thread $thread)
    {
        $thread->load([
            'user',
            'category',
            'comments.user',
            'favorites'
        ]);
        
        $isFavorited = false;
        if (auth()->check() && auth()->user()) {
            $isFavorited = $thread->isFavoritedBy(auth()->user()->id);
        }
        
        // お気に入り数を正確に取得
        $favoritesCount = $thread->favorites()->count();
        
        // デバッグ情報をログに出力
        \Log::info('Thread show - Favorites count: ' . $favoritesCount);
        \Log::info('Thread show - Is favorited: ' . ($isFavorited ? 'true' : 'false'));
        
        return Inertia::render('Board/Show', [
            'thread' => $thread,
            'isFavorited' => $isFavorited,
            'favoritesCount' => $favoritesCount
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Thread $thread)
    {
        // 基本的な権限チェック：スレッドの作成者のみ編集可能
        if ($thread->user_id !== auth()->user()->id) {
            abort(403, 'このトピックを編集する権限がありません。');
        }
        
        $categories = Category::orderBy('name')->get();
        
        return Inertia::render('Board/Edit', [
            'thread' => $thread,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Thread $thread)
    {
        // 基本的な権限チェック：スレッドの作成者のみ更新可能
        if ($thread->user_id !== auth()->user()->id) {
            abort(403, 'このトピックを更新する権限がありません。');
        }
        
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'new_category' => ['nullable', 'string', 'max:100']
        ]);
        
        // 新しいカテゴリが指定された場合は作成する
        if (!empty($validated['new_category'])) {
            $category = Category::firstOrCreate(
                ['name' => trim($validated['new_category'])]
            );
            $validated['category_id'] = $category->id;
        }
        
        // カテゴリが指定されていない場合はエラー
        if (empty($validated['category_id'])) {
            return back()->withErrors([
                'category' => 'カテゴリを選択するか、新しいカテゴリ名を入力してください。'
            ]);
        }
        
        // new_categoryは不要なので削除
        unset($validated['new_category']);
        
        $thread->update($validated);
        
        return redirect()->route('threads.show', $thread)
                        ->with('success', 'トピックが正常に更新されました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Thread $thread)
    {
        // 基本的な権限チェック：スレッドの作成者のみ削除可能
        if ($thread->user_id !== auth()->user()->id) {
            abort(403, 'このトピックを削除する権限がありません。');
        }
        
        $thread->delete();
        
        return redirect()->route('threads.index')
                        ->with('success', 'トピックが正常に削除されました。');
    }

    /**
     * Toggle favorite status
     */
    public function toggleFavorite(Thread $thread)
    {
        if (!auth()->check() || !auth()->user()) {
            abort(401, '認証が必要です。');
        }
        
        $userId = auth()->user()->id;
        $favorite = Favorite::where('user_id', $userId)
                          ->where('thread_id', $thread->id)
                          ->first();
        
        if ($favorite) {
            $favorite->delete();
            $message = 'お気に入りから削除しました。';
        } else {
            Favorite::create([
                'user_id' => $userId,
                'thread_id' => $thread->id
            ]);
            $message = 'お気に入りに追加しました。';
        }
        
        return redirect()->route('threads.show', $thread)
                        ->with('success', $message);
    }
}
