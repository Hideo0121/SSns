<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();
        
        // 検索機能
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('user_code', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // 権限フィルタ
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }
        
        $staff = $query->select(['id', 'name', 'user_code', 'email', 'role', 'avatar_photo', 'created_at'])
                      ->orderBy('created_at', 'desc')
                      ->paginate(10)
                      ->withQueryString();
        
        return Inertia::render('Staff/Index', [
            'staff' => $staff,
            'filters' => $request->only(['search', 'role'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Staff/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // バリデーションルールを動的に構築
        $rules = [
            'user_code' => ['required', 'string', 'max:255', 'unique:users'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:全権管理者,一般管理者,スタッフ'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'mobile_phone_number' => ['nullable', 'string', 'max:255'],
        ];
        
        // ファイルアップロードがある場合のみprofile_imageをバリデーション
        $hasValidFile = $request->hasFile('profile_image') && 
                       $request->file('profile_image') !== null && 
                       $request->file('profile_image')->isValid() &&
                       $request->file('profile_image')->getSize() > 0;
        
        if ($hasValidFile) {
            $rules['profile_image'] = ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120']; // 5MB制限
        }
        
        $validated = $request->validate($rules);
        
        $validated['password'] = Hash::make($validated['password']);
        
        // アップロードされたプロフィール画像を保存とリサイズ
        if ($hasValidFile) {
            $validated['avatar_photo'] = $this->processAndSaveImage($request->file('profile_image'));
        }
        
        // profile_imageはデータベースに保存しないので削除（存在する場合のみ）
        if (isset($validated['profile_image'])) {
            unset($validated['profile_image']);
        }
        
        $user = User::create($validated);
        
        return redirect()->route('staff.index')
                        ->with('success', 'スタッフが正常に登録されました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $staff)
    {
        return Inertia::render('Staff/Show', [
            'staff' => $staff
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $staff)
    {
        return Inertia::render('Staff/Edit', [
            'staff' => $staff
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $staff)
    {
        // バリデーションルールを動的に構築
        $rules = [
            'user_code' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($staff->id)],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($staff->id)],
            'role' => ['required', 'in:全権管理者,一般管理者,スタッフ'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'mobile_phone_number' => ['nullable', 'string', 'max:255'],
        ];
        
        // ファイルアップロードがある場合のみprofile_imageをバリデーション
        $hasValidFile = $request->hasFile('profile_image') && 
                       $request->file('profile_image') !== null && 
                       $request->file('profile_image')->isValid() &&
                       $request->file('profile_image')->getSize() > 0;
        
        if ($hasValidFile) {
            $rules['profile_image'] = ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120']; // 5MB制限
        }
        
        $validated = $request->validate($rules);
        
        // パスワードが入力されている場合のみ更新
        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        }
        
        // アップロードされたプロフィール画像を保存とリサイズ
        if ($hasValidFile) {
            // 古い画像があれば削除
            if ($staff->avatar_photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($staff->avatar_photo);
            }
            
            $validated['avatar_photo'] = $this->processAndSaveImage($request->file('profile_image'));
        }
        
        // profile_imageはデータベースに保存しないので削除（存在する場合のみ）
        if (isset($validated['profile_image'])) {
            unset($validated['profile_image']);
        }
        
        $staff->update($validated);
        
        return redirect()->route('staff.index')
                        ->with('success', 'スタッフ情報が正常に更新されました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $staff)
    {
        // アバター画像があれば削除
        if ($staff->avatar_photo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($staff->avatar_photo);
        }
        
        $staff->delete();
        
        return redirect()->route('staff.index')
                        ->with('success', 'スタッフが正常に削除されました。');
    }

    /**
     * 画像を処理（リサイズ・圧縮）して保存
     */
    private function processAndSaveImage($file)
    {
        try {
            // ImageManagerを初期化
            $manager = new ImageManager(new Driver());
            
            // 安全なファイル名を生成
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $extension = strtolower($file->getClientOriginalExtension());
            
            // 拡張子に基づいてファイル名を調整
            if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
                $extension = 'jpg';
            }
            $filename = pathinfo($filename, PATHINFO_FILENAME) . '.' . $extension;
            
            $avatarPath = 'avatars/' . $filename;
            $destinationPath = storage_path('app/public/avatars');
            $fullPath = $destinationPath . '/' . $filename;
            
            // ディレクトリが存在することを確認
            if (!is_dir($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            // 画像を読み込み、リサイズして保存
            $image = $manager->read($file->getPathname());
            
            // アスペクト比を維持して最大400x400にリサイズ
            $image->scale(width: 400, height: 400);
            
            // 品質を設定して保存（JPEG: 85%, PNG: 90%）
            if (in_array($extension, ['jpg', 'jpeg'])) {
                $image->toJpeg(85)->save($fullPath);
            } elseif ($extension === 'png') {
                $image->toPng()->save($fullPath);
            } elseif ($extension === 'gif') {
                $image->toGif()->save($fullPath);
            } else {
                // デフォルトはJPEG
                $image->toJpeg(85)->save($fullPath);
            }
            
            return $avatarPath;
            
        } catch (\Exception $e) {
            // 画像処理に失敗した場合はログに記録し、元のファイルをそのまま保存
            \Log::error('Image processing failed, saving original file:', [
                'message' => $e->getMessage()
            ]);
            
            // フォールバック: 元のファイルをそのまま保存
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $avatarPath = 'avatars/' . $filename;
            $destinationPath = storage_path('app/public/avatars');
            
            if (!is_dir($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            $file->move($destinationPath, $filename);
            return $avatarPath;
        }
    }
}
