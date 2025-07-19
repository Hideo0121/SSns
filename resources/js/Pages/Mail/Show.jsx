import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Paper,
    Box,
    Typography,
    Chip,
    Button,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Group as GroupIcon
} from '@mui/icons-material';

export default function Show({ mail }) {
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    メール送信詳細
                </h2>
            }
        >
            <Head title={`メール送信詳細 - ${mail.subject}`} />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <Box className="mb-6 flex items-center justify-between">
                        <Box className="flex items-center gap-4">
                            <EmailIcon color="primary" sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4" component="h1">
                                    {mail.subject}
                                </Typography>
                                <Chip
                                    label={getStatusLabel(mail.status)}
                                    color={getStatusColor(mail.status)}
                                    size="small"
                                />
                            </Box>
                        </Box>
                        <Button
                            component={Link}
                            href={route('mail.index')}
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                        >
                            一覧に戻る
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        {/* メール基本情報 */}
                        <Grid item xs={12} md={8}>
                            <Paper className="p-6">
                                <Typography variant="h6" gutterBottom>
                                    メール内容
                                </Typography>
                                
                                <Box className="space-y-4">
                                    <Box>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            件名
                                        </Typography>
                                        <Typography variant="body1" className="font-medium">
                                            {mail.subject}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Box>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            本文
                                        </Typography>
                                        <Box 
                                            className="bg-gray-50 p-4 rounded border"
                                            style={{ whiteSpace: 'pre-wrap' }}
                                        >
                                            <Typography variant="body1">
                                                {mail.body}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* 送信対象一覧 */}
                            <Paper className="p-6 mt-6">
                                <Box className="flex items-center gap-2 mb-4">
                                    <GroupIcon color="primary" />
                                    <Typography variant="h6">
                                        送信対象 ({mail.targets?.length || 0}名)
                                    </Typography>
                                </Box>

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
                                                        <Box className="flex items-center gap-2">
                                                            <Typography>{target.user.name}</Typography>
                                                            <Chip
                                                                label={target.user.role}
                                                                color={getRoleColor(target.user.role)}
                                                                size="small"
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="caption">
                                                                {target.user.user_code}
                                                            </Typography>
                                                            <br />
                                                            <Typography variant="caption">
                                                                {target.user.email}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography color="textSecondary">
                                        送信対象が設定されていません
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>

                        {/* メール送信情報 */}
                        <Grid item xs={12} md={4}>
                            <Paper className="p-6">
                                <Typography variant="h6" gutterBottom>
                                    送信情報
                                </Typography>
                                
                                <Box className="space-y-4">
                                    <Box className="flex items-center gap-2">
                                        <PersonIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="textSecondary">
                                                送信者
                                            </Typography>
                                            <Typography variant="body1">
                                                {mail.admin ? mail.admin.name : '不明'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box className="flex items-center gap-2">
                                        <ScheduleIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="textSecondary">
                                                作成日時
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(mail.created_at)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {mail.sent_at && (
                                        <Box className="flex items-center gap-2">
                                            <CheckCircleIcon color="action" />
                                            <Box>
                                                <Typography variant="caption" color="textSecondary">
                                                    送信日時
                                                </Typography>
                                                <Typography variant="body1">
                                                    {formatDate(mail.sent_at)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    <Box className="flex items-center gap-2">
                                        <GroupIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="textSecondary">
                                                対象者数
                                            </Typography>
                                            <Typography variant="body1">
                                                {mail.targets?.length || 0}名
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* 送信ステータス */}
                            <Card className="mt-4">
                                <CardContent className="text-center">
                                    {mail.status === 'sent' ? (
                                        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                                    ) : mail.status === 'failed' || mail.status === 'partial_failed' ? (
                                        <ErrorIcon color="error" sx={{ fontSize: 60 }} />
                                    ) : (
                                        <ScheduleIcon color="info" sx={{ fontSize: 60 }} />
                                    )}
                                    
                                    <Typography variant="h6" className="mt-2">
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
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}