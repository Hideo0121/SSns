import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import Toast from '@/Components/Toast';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Paper,
    Box,
    Typography,
    Grid
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Work as WorkIcon,
    Phone as PhoneIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

export default function Edit({ staff }) {
    const { auth } = usePage().props;
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    
    const { data, setData, put, processing, errors } = useForm({
        user_code: staff.user_code || '',
        name: staff.name || '',
        email: staff.email || '',
        password: '',
        password_confirmation: '',
        role: staff.role || '一般',
        phone_number: staff.phone_number || '',
        mobile_phone_number: staff.mobile_phone_number || '',
        profile_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.update', staff.id), {
            onSuccess: () => {
                setToast({
                    open: true,
                    message: 'スタッフ情報を更新しました',
                    severity: 'success'
                });
            },
            onError: () => {
                setToast({
                    open: true,
                    message: '更新に失敗しました',
                    severity: 'error'
                });
            }
        });
    };

    return (
        <>
            <Head title={`${staff.name} - 編集`} />
            
            <div style={{ 
                margin: 0,
                fontFamily: "'Roboto', sans-serif",
                background: '#f3f7ff',
                minHeight: '100vh'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                    padding: '16px 24px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: '#fff',
                            borderRadius: '50%',
                            marginRight: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#1976d2'
                        }}>
                            S
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '500' }}>
                            スタッフ管理システム
                        </div>
                    </div>
                    
                    <div style={{
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
                        {auth.user.name}
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
                    </div>
                </div>

                {/* Navigation Bar */}
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
                            スタッフ編集 - {staff.name}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            type="submit"
                            form="staff-edit-form"
                            variant="contained"
                            color="primary"
                            disabled={processing}
                            startIcon={<SaveIcon />}
                            sx={{
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                textTransform: 'none'
                            }}
                        >
                            {processing ? '更新中...' : '更新'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            sx={{
                                color: '#d32f2f',
                                borderColor: '#d32f2f',
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#c62828',
                                    backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                }
                            }}
                        >
                            削除
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ 
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '24px'
                }}>
                    {/* Basic Information Section */}
                    <Paper 
                        elevation={2} 
                        sx={{ 
                            borderRadius: '12px',
                            marginBottom: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div style={{
                            padding: '24px 32px 16px',
                            borderBottom: '2px solid #e3f2fd'
                        }}>
                            <Typography 
                                variant="h6" 
                                component="h3" 
                                sx={{ 
                                    color: '#1565c0',
                                    fontWeight: 'bold',
                                    margin: 0,
                                    fontSize: '20px'
                                }}
                            >
                                基本情報
                            </Typography>
                        </div>
                        
                        <div style={{ padding: '32px' }}>
                            <form id="staff-edit-form" onSubmit={submit}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '200px 1fr',
                                    gap: '32px',
                                    marginTop: '16px'
                                }}>
                                    {/* プロフィール画像アップロード */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            width: '120px',
                                            height: '120px',
                                            border: (data.profile_image || staff.profile_image) ? '4px solid #1976d2' : '4px dashed #1976d2',
                                            borderRadius: '50%',
                                            background: data.profile_image ? `url(${URL.createObjectURL(data.profile_image)}) center/cover` : 
                                                       staff.profile_image ? `url(${staff.profile_image}) center/cover` : '#f3f7ff',
                                            color: '#1976d2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 16px',
                                            fontSize: '32px',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            {!(data.profile_image || staff.profile_image) && <PersonIcon sx={{ fontSize: '32px' }} />}
                                        </div>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            sx={{
                                                background: 'transparent',
                                                color: '#1976d2',
                                                border: '2px solid #1976d2',
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontWeight: '500',
                                                fontSize: '14px',
                                                textTransform: 'none',
                                                marginBottom: '8px',
                                                maxWidth: '180px',
                                                '&:hover': {
                                                    borderColor: '#1565c0',
                                                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                                }
                                            }}
                                        >
                                            <span style={{ fontSize: '18px' }}>📤</span>
                                            写真変更
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setData('profile_image', file);
                                                    }
                                                }}
                                            />
                                        </Button>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            marginTop: '4px'
                                        }}>
                                            JPG、PNG（最大2MB）
                                        </div>
                                        {errors.profile_image && (
                                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                                {errors.profile_image}
                                            </Typography>
                                        )}
                                    </div>

                                    {/* 基本情報入力 */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
                                        gap: '24px'
                                    }}>
                                        {/* ユーザーコード */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                gutterBottom 
                                                sx={{ 
                                                    color: '#1565c0',
                                                    fontWeight: '500',
                                                    fontSize: '14px',
                                                    mb: 1
                                                }}
                                            >
                                                ユーザーコード<span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span>
                                            </Typography>
                                            <PersonIcon sx={{ 
                                                position: 'absolute',
                                                left: '16px',
                                                top: '45px',
                                                color: '#9e9e9e',
                                                zIndex: 1
                                            }} />
                                            <TextField
                                                value={data.user_code}
                                                onChange={(e) => setData('user_code', e.target.value)}
                                                error={!!errors.user_code}
                                                helperText={errors.user_code || '半角英数字、20文字以内'}
                                                fullWidth
                                                required
                                                placeholder="例：user001"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        paddingLeft: '48px',
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderWidth: '2px',
                                                        }
                                                    },
                                                    '& .MuiFormHelperText-root': {
                                                        marginLeft: '48px'
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {/* 氏名 */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                gutterBottom 
                                                sx={{ 
                                                    color: '#1565c0',
                                                    fontWeight: '500',
                                                    fontSize: '14px',
                                                    mb: 1
                                                }}
                                            >
                                                氏名<span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span>
                                            </Typography>
                                            <PersonIcon sx={{ 
                                                position: 'absolute',
                                                left: '16px',
                                                top: '45px',
                                                color: '#9e9e9e',
                                                zIndex: 1
                                            }} />
                                            <TextField
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                error={!!errors.name}
                                                helperText={errors.name || '50文字以内'}
                                                fullWidth
                                                required
                                                placeholder="山田太郎"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        paddingLeft: '48px',
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderWidth: '2px',
                                                        }
                                                    },
                                                    '& .MuiFormHelperText-root': {
                                                        marginLeft: '48px'
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {/* メールアドレス */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                gutterBottom 
                                                sx={{ 
                                                    color: '#1565c0',
                                                    fontWeight: '500',
                                                    fontSize: '14px',
                                                    mb: 1
                                                }}
                                            >
                                                メールアドレス<span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span>
                                            </Typography>
                                            <EmailIcon sx={{ 
                                                position: 'absolute',
                                                left: '16px',
                                                top: '45px',
                                                color: '#9e9e9e',
                                                zIndex: 1
                                            }} />
                                            <TextField
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                error={!!errors.email}
                                                helperText={errors.email || 'ログインID兼用'}
                                                fullWidth
                                                required
                                                placeholder="taro.yamada@example.com"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        paddingLeft: '48px',
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderWidth: '2px',
                                                        }
                                                    },
                                                    '& .MuiFormHelperText-root': {
                                                        marginLeft: '48px'
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {/* 役職 */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                gutterBottom 
                                                sx={{ 
                                                    color: '#1565c0',
                                                    fontWeight: '500',
                                                    fontSize: '14px',
                                                    mb: 1
                                                }}
                                            >
                                                役職<span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span>
                                            </Typography>
                                            <WorkIcon sx={{ 
                                                position: 'absolute',
                                                left: '16px',
                                                top: '45px',
                                                color: '#9e9e9e',
                                                zIndex: 1
                                            }} />
                                            <FormControl fullWidth required error={!!errors.role}>
                                                <Select
                                                    value={data.role}
                                                    onChange={(e) => setData('role', e.target.value)}
                                                    displayEmpty
                                                    sx={{
                                                        paddingLeft: '32px',
                                                        borderRadius: '8px',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderWidth: '2px',
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="" disabled>役職を選択してください</MenuItem>
                                                    <MenuItem value="全権管理者">🔴 全権管理者</MenuItem>
                                                    <MenuItem value="一般管理者">🟡 一般管理者</MenuItem>
                                                    <MenuItem value="一般">🔵 一般</MenuItem>
                                                </Select>
                                                {errors.role && (
                                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: '48px' }}>
                                                        {errors.role}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        </Box>

                                        {/* パスワード */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                gutterBottom 
                                                sx={{ 
                                                    color: '#1565c0',
                                                    fontWeight: '500',
                                                    fontSize: '14px',
                                                    mb: 1
                                                }}
                                            >
                                                パスワード
                                            </Typography>
                                            <LockIcon sx={{ 
                                                position: 'absolute',
                                                left: '16px',
                                                top: '45px',
                                                color: '#9e9e9e',
                                                zIndex: 1
                                            }} />
                                            <TextField
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                error={!!errors.password}
                                                helperText={errors.password || '変更する場合のみ入力（英数字を含む8文字以上）'}
                                                fullWidth
                                                placeholder="新しいパスワード"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        paddingLeft: '48px',
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderWidth: '2px',
                                                        }
                                                    },
                                                    '& .MuiFormHelperText-root': {
                                                        marginLeft: '48px'
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {/* パスワード確認 */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                gutterBottom 
                                                sx={{ 
                                                    color: '#1565c0',
                                                    fontWeight: '500',
                                                    fontSize: '14px',
                                                    mb: 1
                                                }}
                                            >
                                                パスワード確認
                                            </Typography>
                                            <LockIcon sx={{ 
                                                position: 'absolute',
                                                left: '16px',
                                                top: '45px',
                                                color: '#9e9e9e',
                                                zIndex: 1
                                            }} />
                                            <TextField
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                error={!!errors.password_confirmation}
                                                helperText={errors.password_confirmation || 'パスワードを再入力'}
                                                fullWidth
                                                placeholder="パスワードを再入力"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        paddingLeft: '48px',
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderWidth: '2px',
                                                        }
                                                    },
                                                    '& .MuiFormHelperText-root': {
                                                        marginLeft: '48px'
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {/* 電話番号 */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                gutterBottom 
                                                sx={{ 
                                                    color: '#1565c0',
                                                    fontWeight: '500',
                                                    fontSize: '14px',
                                                    mb: 1
                                                }}
                                            >
                                                電話番号
                                            </Typography>
                                            <PhoneIcon sx={{ 
                                                position: 'absolute',
                                                left: '16px',
                                                top: '45px',
                                                color: '#9e9e9e',
                                                zIndex: 1
                                            }} />
                                            <TextField
                                                type="tel"
                                                value={data.phone_number}
                                                onChange={(e) => setData('phone_number', e.target.value)}
                                                error={!!errors.phone_number}
                                                helperText={errors.phone_number || 'ハイフン有無問わず'}
                                                fullWidth
                                                placeholder="03-1234-5678"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        paddingLeft: '48px',
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderWidth: '2px',
                                                        }
                                                    },
                                                    '& .MuiFormHelperText-root': {
                                                        marginLeft: '48px'
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {/* 携帯電話 */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                gutterBottom 
                                                sx={{ 
                                                    color: '#1565c0',
                                                    fontWeight: '500',
                                                    fontSize: '14px',
                                                    mb: 1
                                                }}
                                            >
                                                携帯電話
                                            </Typography>
                                            <PhoneIcon sx={{ 
                                                position: 'absolute',
                                                left: '16px',
                                                top: '45px',
                                                color: '#9e9e9e',
                                                zIndex: 1
                                            }} />
                                            <TextField
                                                type="tel"
                                                value={data.mobile_phone_number}
                                                onChange={(e) => setData('mobile_phone_number', e.target.value)}
                                                error={!!errors.mobile_phone_number}
                                                helperText={errors.mobile_phone_number || '緊急連絡先'}
                                                fullWidth
                                                placeholder="090-1234-5678"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        paddingLeft: '48px',
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderWidth: '2px',
                                                        }
                                                    },
                                                    '& .MuiFormHelperText-root': {
                                                        marginLeft: '48px'
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Paper>
                </div>
            </div>

            <Toast
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </>
    );
}