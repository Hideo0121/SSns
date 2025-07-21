import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import Toast from '@/Components/Toast';
import ConfirmDialog from '@/Components/ConfirmDialog';
import {
    Paper,
    Box,
    Typography,
    Chip,
    Button,
    Grid,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Phone as PhoneIcon,
    PhoneAndroid as PhoneAndroidIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';

export default function Show({ staff }) {
    const { auth } = usePage().props;
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', severity: '', onConfirm: null });

    const getRoleColor = (role) => {
        switch (role) {
            case '全権管理者':
                return 'error';
            case '一般管理者':
                return 'warning';
            default:
                return 'info';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // サンプル操作履歴データ
    const operationHistory = [
        {
            id: 1,
            date: '2025-07-17 14:30',
            operator: 'admin',
            operatorName: '管理者',
            action: '新規登録',
            actionType: 'success',
            description: 'スタッフ情報を新規作成'
        },
        {
            id: 2,
            date: '2025-07-16 09:15',
            operator: 'manager',
            operatorName: 'マネージャー',
            action: '情報更新',
            actionType: 'info',
            description: '電話番号を変更'
        },
        {
            id: 3,
            date: '2025-07-15 16:45',
            operator: 'admin',
            operatorName: '管理者',
            action: '権限変更',
            actionType: 'warning',
            description: `権限を「一般」から「${staff.role}」に変更`
        },
        {
            id: 4,
            date: '2025-07-14 11:20',
            operator: 'system',
            operatorName: 'システム',
            action: 'ログイン',
            actionType: 'info',
            description: 'システムにアクセス'
        }
    ];

    const handleDelete = () => {
        setConfirmDialog({
            open: true,
            title: 'スタッフ削除確認',
            message: `${staff.name}さんを削除してよろしいですか？\nこの操作は取り消せません。`,
            severity: 'delete',
            onConfirm: () => confirmDelete()
        });
    };

    const confirmDelete = () => {
        router.delete(route('staff.destroy', staff.id), {
            onSuccess: () => {
                setToast({
                    open: true,
                    message: 'スタッフを削除しました',
                    severity: 'success'
                });
                setConfirmDialog({ open: false, title: '', message: '', severity: '', onConfirm: null });
                // 削除成功後、一覧画面に戻る
                router.visit(route('staff.index'));
            },
            onError: () => {
                setToast({
                    open: true,
                    message: '削除に失敗しました',
                    severity: 'error'
                });
                setConfirmDialog({ open: false, title: '', message: '', severity: '', onConfirm: null });
            }
        });
    };

    return (
        <>
            <Head title={`${staff.name} - 詳細`} />
            
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
                            スタッフ詳細情報
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            component={Link}
                            href={route('staff.edit', staff.id)}
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            sx={{
                                fontSize: '14px',
                                fontWeight: '500',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                textTransform: 'none'
                            }}
                        >
                            編集
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
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
                    {/* Basic Information */}
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
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '200px 1fr',
                                gap: '32px',
                                marginTop: '16px'
                            }}>
                                {/* プロフィール写真 */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        background: staff.avatar_photo ? 'none' : '#1976d2',
                                        backgroundImage: staff.avatar_photo ? `url(/storage/${staff.avatar_photo})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        border: '4px solid #1976d2'
                                    }}>
                                        {!staff.avatar_photo && (staff.name ? staff.name.charAt(0) : '👤')}
                                    </div>
                                </div>

                                {/* 基本情報グリッド */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
                                    gap: '24px'
                                }}>
                                    {/* ユーザーコード */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            color: '#666',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            ユーザーコード
                                        </div>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '500'
                                        }}>
                                            {staff.user_code}
                                        </div>
                                    </div>

                                    {/* 氏名 */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            color: '#666',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            氏名
                                        </div>
                                        <div style={{
                                            fontSize: '18px',
                                            fontWeight: '500'
                                        }}>
                                            <strong>{staff.name}</strong>
                                        </div>
                                    </div>

                                    {/* メールアドレス */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            color: '#666',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            メールアドレス
                                        </div>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '500'
                                        }}>
                                            {staff.email}
                                        </div>
                                    </div>

                                    {/* 権限 */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            color: '#666',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            権限
                                        </div>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <Chip
                                                label={staff.role}
                                                color={getRoleColor(staff.role)}
                                                sx={{ fontSize: '12px', fontWeight: '500' }}
                                            />
                                        </div>
                                    </div>

                                    {/* 電話番号 */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            color: '#666',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            電話番号
                                        </div>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <PhoneIcon sx={{ color: '#666', fontSize: '20px' }} />
                                            {staff.phone_number || '-'}
                                        </div>
                                    </div>

                                    {/* 携帯電話 */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            color: '#666',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            marginBottom: '4px',
                                            textTransform: 'uppercase'
                                        }}>
                                            携帯電話
                                        </div>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <PhoneAndroidIcon sx={{ color: '#666', fontSize: '20px' }} />
                                            {staff.mobile_phone_number || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Paper>

                    {/* Operation History */}
                    <Paper 
                        elevation={2} 
                        sx={{ 
                            borderRadius: '12px',
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
                                操作履歴
                            </Typography>
                        </div>
                        
                        <div style={{ padding: '32px' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell><strong>日時</strong></TableCell>
                                            <TableCell><strong>操作者</strong></TableCell>
                                            <TableCell><strong>操作内容</strong></TableCell>
                                            <TableCell><strong>変更内容</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {operationHistory.map((row) => (
                                            <TableRow 
                                                key={row.id}
                                                sx={{ 
                                                    '&:hover': { 
                                                        backgroundColor: '#f3f7ff' 
                                                    } 
                                                }}
                                            >
                                                <TableCell>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <ScheduleIcon sx={{ color: '#666' }} />
                                                        {row.date}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            background: '#1976d2',
                                                            color: 'white',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '8px',
                                                            fontSize: '10px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {row.operatorName.charAt(0)}
                                                        </div>
                                                        {row.operator}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.action}
                                                        color={row.actionType}
                                                        size="small"
                                                        sx={{ fontSize: '12px', fontWeight: '500' }}
                                                    />
                                                </TableCell>
                                                <TableCell>{row.description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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

            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                severity={confirmDialog.severity}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ open: false, title: '', message: '', severity: '', onConfirm: null })}
            />
        </>
    );
}
