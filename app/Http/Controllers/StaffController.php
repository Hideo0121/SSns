<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

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
        
        $staff = $query->orderBy('created_at', 'desc')
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
        $validated = $request->validate([
            'user_code' => ['required', 'string', 'max:255', 'unique:users'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:全権管理者,一般管理者,スタッフ'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'mobile_phone_number' => ['nullable', 'string', 'max:255'],
        ]);
        
        $validated['password'] = Hash::make($validated['password']);
        
        User::create($validated);
        
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
        $validated = $request->validate([
            'user_code' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($staff->id)],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($staff->id)],
            'role' => ['required', 'in:全権管理者,一般管理者,スタッフ'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'mobile_phone_number' => ['nullable', 'string', 'max:255'],
        ]);
        
        // パスワードが入力されている場合のみ更新
        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
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
        $staff->delete();
        
        return redirect()->route('staff.index')
                        ->with('success', 'スタッフが正常に削除されました。');
    }
}
