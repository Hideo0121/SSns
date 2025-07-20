import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import { Link } from '@inertiajs/react';
import {
    Typography,
    Chip,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider
} from '@mui/material';
import {
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Group as GroupIcon,
    People as PeopleIcon,
    AttachFile as AttachFileIcon
} from '@mui/icons-material';

export default function Show({ broadcastMessage }) {
    // broadcastMessageがundefinedの場合のエラーハンドリング
    if (!broadcastMessage) {
        return (
            <StaffSystemLayout title="メール送信結果 - スタッフ管理システム">
                <div style={{ padding: '24px', textAlign: 'center' }}>
                    <Typography variant="h6" color="error">
                        メール送信結果が見つかりません
                    </Typography>
                    <Button 
                        component={Link} 
                        href="/staff" 
                        variant="contained" 
                        style={{ marginTop: '16px' }}
                    >
                        スタッフ一覧に戻る
                    </Button>
                </div>
            </StaffSystemLayout>
        );
    }

    // mailオブジェクトとしてbroadcastMessageを使用
    const mail = broadcastMessage;
    const getStatusColor = (status) => {
        switch (status) {
            case 'sent':
                return 'success';
            case 'sending':
                return 'info';
            case 'failed':
            case 'partial_failed':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'draft':
                return '下書き';
            case 'sending':
                return '送信中';
            case 'sent':
                return '送信完了';
            case 'failed':
                return '送信失敗';
            case 'partial_failed':
                return '一部失敗';
            default:
                return '不明';
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

    const getRoleColor = (role) => {
        switch (role) {
            case '全権管理者':
                return 'error';
            case '一般管理者':
                return 'warning';
            default:
                return 'primary';
        }
    };

    return (
        <StaffSystemLayout title="メール送信結果 - スタッフ管理システム">
            <div style={{ padding: '24px' }}>
                {/* Header Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Button
                                component={Link}
                                href={route('staff.index')}
                                variant="outlined"
                                startIcon={<PeopleIcon />}
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
                                fontSize: '20px',
                                fontWeight: '500',
                                margin: '0',
                                color: '#333'
                            }}>
                                メール送信結果
                            </h2>
                        </div>
                        <Chip
                            label={getStatusLabel(mail.status)}
                            color={getStatusColor(mail.status)}
                            size="medium"
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    {/* メール基本情報 */}
                    <div>
                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                margin: '0 0 16px 0',
                                color: '#333'
                            }}>
                                メール内容
                            </h3>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    件名
                                </Typography>
                                <Typography variant="body1" style={{ fontWeight: '500', marginTop: '4px' }}>
                                    {mail.subject}
                                </Typography>
                            </div>

                            <Divider style={{ margin: '16px 0' }} />

                            <div>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    本文
                                </Typography>
                                <div style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: '16px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    <Typography variant="body1">
                                        {mail.body}
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        {/* 送信対象一覧 */}
                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '24px',
                            marginTop: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <GroupIcon color="primary" />
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    margin: '0',
                                    color: '#333'
                                }}>
                                    送信対象 ({mail.targets?.length || 0}名)
                                </h3>
                            </div>

                            {mail.targets && mail.targets.length > 0 ? (
                                <List>
                                    {mail.targets.map((target, index) => (
                                        <ListItem key={target.id} divider={index < mail.targets.length - 1}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Typography>{target.user.name}</Typography>
                                                        <Chip
                                                            label={target.user.role}
                                                            color={getRoleColor(target.user.role)}
                                                            size="small"
                                                        />
                                                    </div>
                                                }
                                                secondary={target.user.email}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography color="textSecondary">
                                    送信対象が設定されていません
                                </Typography>
                            )}
                        </div>
                    </div>

                    {/* メール送信情報 */}
                    <div>
                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                margin: '0 0 16px 0',
                                color: '#333'
                            }}>
                                送信情報
                            </h3>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <PersonIcon color="action" />
                                    <div>
                                        <Typography variant="caption" color="textSecondary">
                                            送信者
                                        </Typography>
                                        <Typography variant="body1">
                                            {mail.admin ? mail.admin.name : '不明'}
                                        </Typography>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <ScheduleIcon color="action" />
                                    <div>
                                        <Typography variant="caption" color="textSecondary">
                                            作成日時
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(mail.created_at)}
                                        </Typography>
                                    </div>
                                </div>

                                {mail.sent_at && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <CheckCircleIcon color="action" />
                                        <div>
                                            <Typography variant="caption" color="textSecondary">
                                                送信日時
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(mail.sent_at)}
                                            </Typography>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <GroupIcon color="action" />
                                    <div>
                                        <Typography variant="caption" color="textSecondary">
                                            対象者数
                                        </Typography>
                                        <Typography variant="body1">
                                            {mail.targets?.length || 0}名
                                        </Typography>
                                    </div>
                                </div>

                                {/* 添付ファイル情報 */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                                    <AttachFileIcon color="action" />
                                    <div>
                                        <Typography variant="caption" color="textSecondary">
                                            添付ファイル
                                        </Typography>
                                        <Typography variant="body1">
                                            {mail.attachment_info && mail.attachment_info.length > 0 
                                                ? `${mail.attachment_info.length}個のファイル` 
                                                : 'なし'
                                            }
                                        </Typography>
                                        {mail.attachment_info && mail.attachment_info.length > 0 && (
                                            <div style={{ marginTop: '4px' }}>
                                                {mail.attachment_info.map((file, index) => (
                                                    <Typography key={index} variant="caption" display="block" color="textSecondary">
                                                        • {file.name} ({file.size_mb}MB)
                                                    </Typography>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 送信ステータス */}
                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '24px',
                            marginTop: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            {mail.status === 'sent' ? (
                                <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                            ) : mail.status === 'failed' || mail.status === 'partial_failed' ? (
                                <ErrorIcon color="error" sx={{ fontSize: 60 }} />
                            ) : (
                                <ScheduleIcon color="info" sx={{ fontSize: 60 }} />
                            )}
                            
                            <Typography variant="h6" style={{ marginTop: '8px' }}>
                                {getStatusLabel(mail.status)}
                            </Typography>
                            
                            {mail.status === 'sent' && (
                                <Typography color="textSecondary">
                                    メールが正常に送信されました
                                </Typography>
                            )}
                            
                            {mail.status === 'partial_failed' && (
                                <Typography color="textSecondary">
                                    一部のメール送信が失敗しました
                                </Typography>
                            )}
                            
                            {mail.status === 'failed' && (
                                <Typography color="textSecondary">
                                    メール送信が失敗しました
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StaffSystemLayout>
    );
}
