import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import Toast from '@/Components/Toast';
import {
    TextField,
    Button,
    Paper,
    Box,
    Typography,
    Grid,
    Chip,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    IconButton,
    Checkbox,
    FormControlLabel,
    Alert
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Send as SendIcon,
    Save as SaveIcon,
    Subject as SubjectIcon,
    CloudUpload as CloudUploadIcon,
    AttachFile as AttachFileIcon,
    PictureAsPdf as PictureAsPdfIcon,
    Image as ImageIcon,
    Cancel as CancelIcon,
    People as PeopleIcon,
    Visibility as VisibilityIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';

export default function Create({ availableUsers, filters, selectedStaffIds = [], debugMessage }) {
    const { auth, flash } = usePage().props;
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
    const [recipientsDialog, setRecipientsDialog] = useState({ open: false });
    const [allStaffDialog, setAllStaffDialog] = useState({ open: false });
    
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        body: '',
        target_users: [],
        attachments: []
    });

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [attachedFiles, setAttachedFiles] = useState([]);

    // URLパラメータからスタッフIDを取得して事前選択
    useEffect(() => {
        // propsから渡されたselectedStaffIdsを優先
        if (selectedStaffIds && selectedStaffIds.length > 0 && availableUsers) {
            const preSelectedIds = selectedStaffIds.map(id => parseInt(id));
            const preSelected = availableUsers.filter(user => preSelectedIds.includes(user.id));
            setSelectedUsers(preSelected);
            setData('target_users', preSelectedIds);
        } else {
            // フォールバック: URLパラメータから取得
            const urlParams = new URLSearchParams(window.location.search);
            const staffIds = urlParams.get('staff_ids');
            
            if (staffIds && availableUsers) {
                const preSelectedIds = staffIds.split(',').map(id => parseInt(id));
                const preSelected = availableUsers.filter(user => preSelectedIds.includes(user.id));
                setSelectedUsers(preSelected);
                setData('target_users', preSelectedIds);
            }
        }
    }, [availableUsers, selectedStaffIds]);

    // 送信対象が0人の場合の初期チェック
    useEffect(() => {
        // availableUsersが読み込まれ、URLパラメータからの事前選択が完了した後にチェック
        if (availableUsers && availableUsers.length > 0) {
            const urlParams = new URLSearchParams(window.location.search);
            const staffIds = urlParams.get('staff_ids');
            
            // URLパラメータがない場合のみチェック
            if (!staffIds) {
                setToast({
                    open: true,
                    message: '送信対象がありません。スタッフ一覧に戻ります。',
                    severity: 'warning'
                });
                
                setTimeout(() => {
                    router.get(route('staff.index'));
                }, 2000);
            }
        }
    }, [availableUsers]); // selectedUsersを依存配列から除外

    // デバッグメッセージの表示
    useEffect(() => {
        if (debugMessage) {
            setToast({
                open: true,
                message: debugMessage,
                severity: 'info'
            });
        }
    }, [debugMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // バリデーション
        if (!data.subject.trim()) {
            setToast({
                open: true,
                message: '件名を入力してください',
                severity: 'error'
            });
            return;
        }
        
        if (!data.body.trim()) {
            setToast({
                open: true,
                message: 'メール本文を入力してください',
                severity: 'error'
            });
            return;
        }
        
        if (selectedUsers.length === 0) {
            setToast({
                open: true,
                message: '送信対象を選択してください',
                severity: 'error'
            });
            return;
        }
        
        setConfirmDialog({
            open: true,
            title: 'メール送信確認',
            message: `メールを送信しますか？\n\n送信対象: ${selectedUsers.length}名\n件名: ${data.subject || '（件名なし）'}\n${attachedFiles.length > 0 ? `添付ファイル: ${attachedFiles.length}件` : ''}`,
            onConfirm: () => {
                // target_usersをselectedUsersのIDで更新
                const targetUserIds = selectedUsers.map(user => user.id);
                
                // FormDataを使用してファイルアップロードを含む送信
                const formData = new FormData();
                formData.append('subject', data.subject);
                formData.append('body', data.body);
                targetUserIds.forEach((id, index) => {
                    formData.append(`target_users[${index}]`, id);
                });
                
                // 添付ファイルを追加
                data.attachments.forEach((file, index) => {
                    formData.append(`attachments[${index}]`, file);
                });
                
                post(route('mail.store'), {
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onSuccess: () => {
                        setToast({
                            open: true,
                            message: 'メールを送信しました',
                            severity: 'success'
                        });
                    },
                    onError: (errors) => {
                        console.error('Mail send errors:', errors);
                        setToast({
                            open: true,
                            message: 'メール送信に失敗しました',
                            severity: 'error'
                        });
                    }
                });
                setConfirmDialog({ ...confirmDialog, open: false });
            }
        });
    };

    const handleSaveDraft = () => {
        setToast({
            open: true,
            message: '下書きを保存しました',
            severity: 'success'
        });
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        processFiles(files);
        event.target.value = '';
    };

    const processFiles = (files) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        files.forEach(file => {
            if (!allowedTypes.includes(file.type)) {
                setToast({
                    open: true,
                    message: `${file.name} はサポートされていないファイル形式です。PDF、JPG、PNG、GIFファイルのみ添付可能です。`,
                    severity: 'error'
                });
                return;
            }

            if (file.size > maxSize) {
                setToast({
                    open: true,
                    message: `${file.name} のファイルサイズが大きすぎます。最大10MBまでのファイルを選択してください。`,
                    severity: 'error'
                });
                return;
            }

            // 重複チェック
            if (attachedFiles.some(f => f.name === file.name)) {
                setToast({
                    open: true,
                    message: `${file.name} は既に添付されています。`,
                    severity: 'error'
                });
                return;
            }

            const fileInfo = {
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
                type: file.type.startsWith('image/') ? 'image' : 'pdf',
                file: file
            };

            setAttachedFiles(prev => [...prev, fileInfo]);
            
            // フォームデータにも追加（既存のデータを保持）
            setData(prev => ({
                ...prev,
                attachments: [...prev.attachments, file]
            }));
            
            setToast({
                open: true,
                message: `${file.name} を添付しました`,
                severity: 'success'
            });
        });
    };

    // ドラッグ&ドロップ処理
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    const removeFile = (index) => {
        const fileName = attachedFiles[index].name;
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
        
        // フォームデータからも削除（既存のデータを保持）
        setData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
        
        setToast({
            open: true,
            message: `${fileName} を削除しました`,
            severity: 'info'
        });
    };

    const removeUser = (userId) => {
        const newSelectedUsers = selectedUsers.filter(user => user.id !== userId);
        const newTargetUsers = data.target_users.filter(id => id !== userId);
        
        setSelectedUsers(newSelectedUsers);
        setData('target_users', newTargetUsers);
        
        // 送信対象が0人になった場合
        if (newSelectedUsers.length === 0) {
            setToast({
                open: true,
                message: '送信対象がありません。スタッフ一覧に戻ります。',
                severity: 'warning'
            });
            
            // 2秒後にスタッフ一覧に戻る
            setTimeout(() => {
                router.get(route('staff.index'));
            }, 2000);
        }
    };

    const getUserInitial = (name) => {
        return name ? name.charAt(0) : 'U';
    };

    const showRecipients = () => {
        setRecipientsDialog({ open: true });
    };

    const showAllRecipients = () => {
        setAllStaffDialog({ open: true });
    };

    const toggleUserSelection = (user) => {
        const isSelected = selectedUsers.some(selected => selected.id === user.id);
        
        if (isSelected) {
            // 選択解除
            setSelectedUsers(prev => prev.filter(selected => selected.id !== user.id));
            setData('target_users', data.target_users.filter(id => id !== user.id));
        } else {
            // 選択追加
            setSelectedUsers(prev => [...prev, user]);
            setData('target_users', [...data.target_users, user.id]);
        }
    };

    const selectAllUsers = () => {
        setSelectedUsers(availableUsers);
        setData('target_users', availableUsers.map(user => user.id));
        setToast({
            open: true,
            message: `全${availableUsers.length}名を選択しました`,
            severity: 'success'
        });
    };

    const clearAllUsers = () => {
        setSelectedUsers([]);
        setData('target_users', []);
        setToast({
            open: true,
            message: '送信対象がありません。スタッフ一覧に戻ります。',
            severity: 'warning'
        });
        
        // 2秒後にスタッフ一覧に戻る
        setTimeout(() => {
            router.get(route('staff.index'));
        }, 2000);
    };

    const navigationBar = (
        <div style={{
            background: 'white',
            padding: '16px 24px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button
                    component={Link}
                    href={route('staff.index')}
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        color: '#1976d2',
                        borderColor: '#1976d2',
                        fontSize: '14px',
                        fontWeight: '500',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: '#1565c0',
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                        }
                    }}
                >
                    スタッフ一覧に戻る
                </Button>
                <h2 style={{ 
                    margin: 0, 
                    color: '#1565c0', 
                    fontWeight: 'bold',
                    fontSize: '18px'
                }}>
                    メール送信
                </h2>
            </div>
        </div>
    );

    return (
        <>
            <Head title="メール送信" />
            <StaffSystemLayout title="メール送信" navigationBar={navigationBar}>
                <div style={{ padding: '24px' }}>
                    <div style={{ 
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{
                        width: 32,
                        height: 32,
                        background: '#fff',
                        borderRadius: '50%',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#1976d2'
                    }}>
                        S
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: '500', fontSize: '18px' }}>
                        スタッフ管理システム
                    </Typography>
                </Box>
                <Box sx={{
                    background: 'transparent',
                    border: '1px solid white',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px'
                }}>
                    <span style={{ marginRight: '8px' }}>👤</span>
                    {auth.user?.name}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            marginLeft: '12px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        ログアウト
                    </Link>
                </Box>
                    {/* Flash Messages */}
                    {flash?.success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {flash.success}
                        </Alert>
                    )}

                    {flash?.error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {flash.error}
                        </Alert>
                    )}

                    {/* Form Actions */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<SendIcon />}
                            onClick={handleSubmit}
                            disabled={processing}
                            sx={{
                                background: '#1976d2',
                                fontWeight: 500,
                                '&:hover': {
                                    background: '#1565c0'
                                }
                            }}
                        >
                            送信
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveDraft}
                        sx={{
                            color: '#1976d2',
                            borderColor: '#1976d2',
                            fontWeight: 500
                        }}
                    >
                        下書き保存
                    </Button>
                </Box>

                    {/* Recipients Section */}
                    <Paper sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
                        <Box sx={{
                            px: 4,
                            py: 3,
                            borderBottom: '2px solid #e3f2fd'
                        }}>
                            <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                                送信対象
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Chip
                                icon={<PeopleIcon />}
                                label={`選択済みスタッフ: ${selectedUsers.length}名`}
                                sx={{
                                    background: '#1976d2',
                                    color: 'white',
                                    fontWeight: 500,
                                    '& .MuiChip-icon': {
                                        color: 'white'
                                    }
                                }}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<VisibilityIcon />}
                                onClick={showRecipients}
                                sx={{
                                    color: '#1976d2',
                                    borderColor: '#1976d2',
                                    fontWeight: 500
                                }}
                            >
                                対象者一覧を表示
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedUsers.slice(0, 3).map((user, index) => (
                                <Chip
                                    key={user.id}
                                    avatar={
                                        <Avatar sx={{
                                            width: 20,
                                            height: 20,
                                            background: '#1976d2',
                                            color: 'white',
                                            fontSize: '10px',
                                            fontWeight: 'bold'
                                        }}>
                                            {getUserInitial(user.name)}
                                        </Avatar>
                                    }
                                    label={user.name}
                                    onDelete={() => removeUser(user.id)}
                                    deleteIcon={<CancelIcon sx={{ color: '#d32f2f !important' }} />}
                                    sx={{
                                        background: '#e3f2fd',
                                        color: '#1976d2',
                                        fontSize: '12px',
                                        '& .MuiChip-deleteIcon': {
                                            color: '#d32f2f'
                                        }
                                    }}
                                />
                            ))}
                            {selectedUsers.length > 3 && (
                                <Chip
                                    label={`他${selectedUsers.length - 3}名...`}
                                    variant="outlined"
                                    onClick={showAllRecipients}
                                    sx={{
                                        color: '#1976d2',
                                        borderColor: '#1976d2',
                                        cursor: 'pointer'
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Paper>

                {/* Mail Compose Section */}
                <Paper sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
                    <Box sx={{
                        px: 4,
                        py: 3,
                        borderBottom: '2px solid #e3f2fd'
                    }}>
                        <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                            メール作成
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        {/* Subject Field */}
                        <Box sx={{ mb: 2, position: 'relative' }}>
                            <Typography variant="body2" sx={{ 
                                color: '#1565c0', 
                                fontWeight: 500, 
                                mb: 1,
                                fontSize: '14px'
                            }}>
                                件名
                            </Typography>
                            <SubjectIcon sx={{
                                position: 'absolute',
                                left: 16,
                                top: 46,
                                color: '#9e9e9e'
                            }} />
                            <TextField
                                fullWidth
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="件名を入力してください"
                                error={!!errors.subject}
                                helperText={errors.subject}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        paddingLeft: '48px',
                                        '& fieldset': {
                                            borderColor: '#e0e0e0',
                                            borderWidth: '2px'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1976d2'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1976d2'
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* Body Field */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ 
                                color: '#1565c0', 
                                fontWeight: 500, 
                                mb: 1,
                                fontSize: '14px'
                            }}>
                                本文
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={8}
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                placeholder="メール本文を入力してください"
                                error={!!errors.body}
                                helperText={errors.body}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        lineHeight: 1.5,
                                        '& fieldset': {
                                            borderColor: '#e0e0e0',
                                            borderWidth: '2px'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#1976d2'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1976d2'
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* Attachment Section */}
                        <Box>
                            <Typography variant="h6" sx={{ color: '#1565c0', mb: 2 }}>
                                添付ファイル
                            </Typography>

                            {/* Drop Zone */}
                            <Box
                                sx={{
                                    border: '2px dashed #1976d2',
                                    borderRadius: 3,
                                    p: 3,
                                    textAlign: 'center',
                                    background: '#f3f7ff',
                                    mb: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: '#e3f2fd',
                                        transform: 'scale(1.02)'
                                    }
                                }}
                                onClick={() => document.getElementById('file-input').click()}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 500 }}>
                                    ファイルをドラッグ＆ドロップ
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    または下のボタンでファイルを選択
                                </Typography>
                            </Box>

                            {/* File Upload */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <input
                                    type="file"
                                    id="file-input"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<AttachFileIcon />}
                                    onClick={() => document.getElementById('file-input').click()}
                                    sx={{
                                        color: '#1976d2',
                                        borderColor: '#1976d2',
                                        fontWeight: 500
                                    }}
                                >
                                    ファイル選択
                                </Button>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    最大10MB、PDF・画像ファイルに対応
                                </Typography>
                            </Box>

                            {/* Attached Files */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {attachedFiles.map((file, index) => (
                                    <Chip
                                        key={index}
                                        icon={file.type === 'pdf' ? 
                                            <PictureAsPdfIcon sx={{ color: '#d32f2f' }} /> : 
                                            <ImageIcon sx={{ color: '#2e7d32' }} />
                                        }
                                        label={`${file.name} (${file.size})`}
                                        onDelete={() => removeFile(index)}
                                        deleteIcon={<CancelIcon />}
                                        sx={{
                                            background: '#f5f5f5',
                                            border: '1px solid #e0e0e0',
                                            '& .MuiChip-deleteIcon': {
                                                color: '#d32f2f'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Preview Section */}
                <Paper sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Box sx={{
                        px: 4,
                        py: 3,
                        borderBottom: '2px solid #e3f2fd'
                    }}>
                        <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                            プレビュー
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <Box sx={{
                            background: '#fafafa',
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            p: 3
                        }}>
                            <Box sx={{ borderBottom: '1px solid #e0e0e0', pb: 2, mb: 2 }}>
                                <Typography variant="caption" sx={{ 
                                    color: '#666', 
                                    textTransform: 'uppercase',
                                    fontWeight: 500,
                                    display: 'block',
                                    mb: 0.5
                                }}>
                                    件名:
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                    {data.subject || '（件名なし）'}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="caption" sx={{ 
                                    color: '#666', 
                                    textTransform: 'uppercase',
                                    fontWeight: 500,
                                    display: 'block',
                                    mb: 0.5
                                }}>
                                    本文:
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    whiteSpace: 'pre-line', 
                                    lineHeight: 1.6,
                                    color: '#333'
                                }}>
                                    {data.body || '（本文なし）'}
                                </Typography>
                            </Box>

                            {attachedFiles.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" sx={{ 
                                        color: '#666', 
                                        textTransform: 'uppercase',
                                        fontWeight: 500
                                    }}>
                                        添付ファイル: {attachedFiles.length}件
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        minWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ 
                    color: '#1565c0', 
                    fontWeight: 600,
                    fontSize: '20px'
                }}>
                    {confirmDialog.title}
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ 
                        color: '#333', 
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line'
                    }}>
                        {confirmDialog.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1.5 }}>
                    <Button
                        onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
                        sx={{
                            background: '#f5f5f5',
                            color: '#666',
                            fontWeight: 500,
                            '&:hover': {
                                background: '#e0e0e0'
                            }
                        }}
                    >
                        キャンセル
                    </Button>
                    <Button
                        onClick={confirmDialog.onConfirm}
                        variant="contained"
                        sx={{
                            background: '#1976d2',
                            fontWeight: 500,
                            '&:hover': {
                                background: '#1565c0'
                            }
                        }}
                    >
                        実行
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 対象者一覧ダイアログ */}
            <Dialog
                open={recipientsDialog.open}
                onClose={() => setRecipientsDialog({ open: false })}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        maxHeight: '80vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <PeopleIcon />
                    メール送信対象者一覧 ({selectedUsers.length}名)
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    {selectedUsers.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: '#666' }}>
                            <PeopleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                            <Typography variant="h6" gutterBottom>
                                対象者が選択されていません
                            </Typography>
                            <Typography variant="body2">
                                メール送信対象者を選択してください
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                            {selectedUsers.map((user, index) => (
                                <Box key={user.id}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 2,
                                        '&:hover': {
                                            background: '#f5f5f5'
                                        }
                                    }}>
                                        <Avatar sx={{
                                            width: 40,
                                            height: 40,
                                            background: user.profile_image ? 'none' : '#1976d2',
                                            color: 'white',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            mr: 2,
                                            backgroundImage: user.profile_image ? `url(/storage/${user.profile_image})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}>
                                            {!user.profile_image && getUserInitial(user.name)}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                {user.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {user.role} | {user.user_code}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={user.role}
                                            size="small"
                                            sx={{
                                                background: user.role === '全権管理者' ? '#f44336' 
                                                           : user.role === '一般管理者' ? '#ff9800' 
                                                           : '#2196f3',
                                                color: 'white',
                                                fontWeight: 500,
                                                mr: 1
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => removeUser(user.id)}
                                            sx={{
                                                color: '#d32f2f',
                                                '&:hover': {
                                                    background: 'rgba(211, 47, 47, 0.1)'
                                                }
                                            }}
                                        >
                                            <CancelIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    {index < selectedUsers.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, background: '#f8f9fa' }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            合計 {selectedUsers.length} 名にメールを送信します
                        </Typography>
                        <Button
                            onClick={() => setRecipientsDialog({ open: false })}
                            variant="contained"
                            sx={{
                                background: '#1976d2',
                                fontWeight: 500,
                                px: 3,
                                '&:hover': {
                                    background: '#1565c0'
                                }
                            }}
                        >
                            閉じる
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* 全スタッフ一覧ダイアログ */}
            <Dialog
                open={allStaffDialog.open}
                onClose={() => setAllStaffDialog({ open: false })}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon />
                        全スタッフ一覧 ({availableUsers?.length || 0}名)
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            size="small"
                            onClick={selectAllUsers}
                            sx={{
                                color: 'white',
                                border: '1px solid white',
                                fontSize: '12px',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            全選択
                        </Button>
                        <Button
                            size="small"
                            onClick={clearAllUsers}
                            sx={{
                                color: 'white',
                                border: '1px solid white',
                                fontSize: '12px',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            全解除
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    {!availableUsers || availableUsers.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: '#666' }}>
                            <PeopleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                            <Typography variant="h6" gutterBottom>
                                スタッフが見つかりません
                            </Typography>
                            <Typography variant="body2">
                                登録されているスタッフがありません
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                            {availableUsers.map((user, index) => {
                                const isSelected = selectedUsers.some(selected => selected.id === user.id);
                                return (
                                    <Box key={user.id}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 2,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                background: '#f5f5f5'
                                            },
                                            background: isSelected ? 'rgba(25, 118, 210, 0.04)' : 'transparent'
                                        }}
                                        onClick={() => toggleUserSelection(user)}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => toggleUserSelection(user)}
                                                sx={{
                                                    color: '#1976d2',
                                                    '&.Mui-checked': {
                                                        color: '#1976d2'
                                                    }
                                                }}
                                            />
                                            <Avatar sx={{
                                                width: 40,
                                                height: 40,
                                                background: user.profile_image ? 'none' : '#1976d2',
                                                color: 'white',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                mr: 2,
                                                backgroundImage: user.profile_image ? `url(/storage/${user.profile_image})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}>
                                                {!user.profile_image && getUserInitial(user.name)}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                    {user.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.role} | {user.user_code}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                sx={{
                                                    background: user.role === '全権管理者' ? '#f44336' 
                                                               : user.role === '一般管理者' ? '#ff9800' 
                                                               : '#2196f3',
                                                    color: 'white',
                                                    fontWeight: 500,
                                                    mr: 1
                                                }}
                                            />
                                        </Box>
                                        {index < availableUsers.length - 1 && <Divider />}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, background: '#f8f9fa' }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            {selectedUsers.length} / {availableUsers?.length || 0} 名を選択中
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                onClick={() => setAllStaffDialog({ open: false })}
                                sx={{
                                    color: '#666',
                                    fontWeight: 500
                                }}
                            >
                                キャンセル
                            </Button>
                            <Button
                                onClick={() => setAllStaffDialog({ open: false })}
                                variant="contained"
                                sx={{
                                    background: '#1976d2',
                                    fontWeight: 500,
                                    px: 3,
                                    '&:hover': {
                                        background: '#1565c0'
                                    }
                                }}
                            >
                                選択完了
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>

            <Toast
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={() => setToast({ ...toast, open: false })}
            />
                </div>
            </div>
        </StaffSystemLayout>
        </>
    );
}
