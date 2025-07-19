<?php

namespace App\Http\Controllers;

use App\Services\MailService;
use App\Models\EmailBroadcastMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MailController extends Controller
{
    protected $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
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
        $filters = $request->only(['role', 'search']);
        $availableUsers = $this->mailService->getAvailableUsers($filters);

        return Inertia::render('Mail/Create', [
            'availableUsers' => $availableUsers,
            'filters' => $filters
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'target_users' => ['required', 'array', 'min:1'],
            'target_users.*' => ['required', 'integer', 'exists:users,id']
        ]);

        $result = $this->mailService->sendBroadcastMail(
            $validated,
            $validated['target_users']
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
        $mail->load(['admin', 'targets.user']);

        return Inertia::render('Mail/Show', [
            'mail' => $mail
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
