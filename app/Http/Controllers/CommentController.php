<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Thread;
use Illuminate\Http\Request;

class CommentController extends Controller
{


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Thread $thread)
    {
        $validated = $request->validate([
            'content' => ['required', 'string']
        ]);
        
        $validated['user_id'] = auth()->user()->id;
        $validated['thread_id'] = $thread->id;
        
        Comment::create($validated);
        
        return redirect()->route('threads.show', $thread)
                        ->with('success', 'コメントが正常に投稿されました。');
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        // 基本的な権限チェック：コメントの作成者のみ編集可能
        if ($comment->user_id !== auth()->user()->id) {
            abort(403, 'このコメントを編集する権限がありません。');
        }
        
        $validated = $request->validate([
            'content' => ['required', 'string']
        ]);
        
        $comment->update($validated);
        
        return redirect()->route('threads.show', $comment->thread)
                        ->with('success', 'コメントが正常に更新されました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        // 基本的な権限チェック：コメントの作成者のみ削除可能
        if ($comment->user_id !== auth()->user()->id) {
            abort(403, 'このコメントを削除する権限がありません。');
        }
        
        $thread = $comment->thread;
        $comment->delete();
        
        return redirect()->route('threads.show', $thread)
                        ->with('success', 'コメントが正常に削除されました。');
    }
}
