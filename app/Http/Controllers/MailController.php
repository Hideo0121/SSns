<?php

namespace App\Http\Controllers;

use App\Services\MailService;
use App\Services\AuditLogService;
use App\Models\EmailBroadcastMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MailController extends Controller
{
    protected $mailService;
    protected $auditLogService;

    public function __construct(MailService $mailService, AuditLogService $auditLogService)
    {
        $this->mailService = $mailService;
        $this->auditLogService = $auditLogService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $history = $this->mailService->getBroadcastHistory();
        $statistics = $this->mailService->getStatistics();

        return Inertia::render('Mail/Index', [
            'history' => $history,
            'statistics' => $statistics
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $this->auditLogService->logAction('メール作成画面表示', 'メール作成画面にアクセス');
        
        // 利用可能なユーザー一覧を取得
        $availableUsers = $this->mailService->getAvailableUsers();
        
        // URLパラメータから事前選択されたスタッフIDを取得
        $selectedStaffIds = [];
        if ($request->has('staff_ids')) {
            $staffIds = $request->get('staff_ids');
            if ($staffIds) {
                $selectedStaffIds = array_map('intval', explode(',', $staffIds));
            }
        }
        
        return Inertia::render('Mail/Create', [
            'availableUsers' => $availableUsers,
            'selectedStaffIds' => $selectedStaffIds
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // デバッグ: 現在の認証情報をログ出力
        \Log::info('メール送信リクエスト開始', [
            'auth_check' => auth()->check(),
            'auth_user_id' => auth()->user()?->id,
            'auth_user_code' => auth()->user()?->user_code,
            'auth_user_name' => auth()->user()?->name,
        ]);

        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'target_users' => ['required', 'array', 'min:1'],
            'target_users.*' => ['required', 'integer', 'exists:users,id'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:10240', 'mimes:pdf,jpg,jpeg,png,gif'] // 10MB制限
        ]);

        $result = $this->mailService->sendBroadcastMail(
            $validated,
            $validated['target_users'],
            $request->file('attachments', [])
        );

        if ($result['success']) {
            return redirect()->route('mail.show', $result['broadcast_id'])
                           ->with('success', 
                               "メール送信が完了しました。（成功: {$result['success_count']}件、失敗: {$result['fail_count']}件）"
                           );
        } else {
            return back()->withErrors([
                'general' => 'メール送信に失敗しました: ' . $result['error']
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(EmailBroadcastMessage $mail)
    {
        $this->auditLogService->logAction(
            'メール送信結果画面表示', 
            "メール送信結果を表示: {$mail->subject}",
            $mail
        );
        
        // 関連データを含めて取得
        $mail->load(['admin', 'targets.user']);
        
        return Inertia::render('Mail/Show', [
            'broadcastMessage' => $mail,
        ]);
    }

    /**
     * Get available users for mail sending
     */
    public function users(Request $request)
    {
        $filters = $request->only(['role', 'search']);
        $users = $this->mailService->getAvailableUsers($filters);

        return response()->json($users);
    }


}
