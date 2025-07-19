<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ImageUploadController extends Controller
{
    /**
     * Upload avatar image
     */
    public function uploadAvatar(Request $request, User $user = null)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048']
        ]);

        $targetUser = $user ?? auth()->user();
        
        // 権限チェック（自分自身または管理者のみ）
        if (!auth()->user()->isAdmin() && auth()->id() !== $targetUser->id) {
            return response()->json(['error' => '権限がありません'], 403);
        }

        try {
            $file = $request->file('avatar');
            $filename = 'avatar_' . $targetUser->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // 画像をリサイズして保存
            $image = Image::make($file)
                         ->fit(200, 200)
                         ->encode('jpg', 80);
            
            $path = 'avatars/' . $filename;
            Storage::disk('public')->put($path, $image);
            
            // 古い画像を削除
            if ($targetUser->avatar_photo) {
                Storage::disk('public')->delete($targetUser->avatar_photo);
            }
            
            // データベース更新
            $targetUser->update([
                'avatar_photo' => $path
            ]);
            
            return response()->json([
                'success' => true,
                'avatar_url' => Storage::url($path),
                'message' => 'プロフィール画像が正常に更新されました'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => '画像のアップロードに失敗しました: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete avatar image
     */
    public function deleteAvatar(User $user = null)
    {
        $targetUser = $user ?? auth()->user();
        
        // 権限チェック
        if (!auth()->user()->isAdmin() && auth()->id() !== $targetUser->id) {
            return response()->json(['error' => '権限がありません'], 403);
        }

        try {
            if ($targetUser->avatar_photo) {
                Storage::disk('public')->delete($targetUser->avatar_photo);
                
                $targetUser->update([
                    'avatar_photo' => null
                ]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'プロフィール画像が削除されました'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => '画像の削除に失敗しました: ' . $e->getMessage()
            ], 500);
        }
    }
}
