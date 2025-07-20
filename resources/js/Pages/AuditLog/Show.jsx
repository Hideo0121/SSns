import { Head, Link } from '@inertiajs/react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import {
    Button,
    Paper,
    Box,
    Typography,
    Grid,
    Chip,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

export default function Show({ auditLog }) {
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActionColor = (action) => {
        const colors = {
            'create': 'success',
            'update': 'primary',
            'delete': 'error',
            'view': 'default',
            'export': 'warning'
        };
        return colors[action] || 'default';
    };

    const formatJson = (data) => {
        if (!data) return 'なし';
        return JSON.stringify(data, null, 2);
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
                    href={route('audit-logs.index')}
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
                    監査ログ一覧に戻る
                </Button>
                <h2 style={{ 
                    margin: 0, 
                    color: '#1565c0', 
                    fontWeight: 'bold',
                    fontSize: '18px'
                }}>
                    監査ログ詳細
                </h2>
            </div>
        </div>
    );

    return (
        <>
            <Head title="監査ログ詳細" />
            <StaffSystemLayout title="監査ログ詳細" navigationBar={navigationBar}>
                <div style={{ padding: '24px' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        
                        {/* Basic Information */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#1565c0', fontWeight: 'bold' }}>
                                基本情報
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            ログID
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {auditLog.id}
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            日時
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {formatDateTime(auditLog.created_at)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            ユーザー
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {auditLog.user?.name || '不明'}
                                        </Typography>
                                        {auditLog.user?.user_code && (
                                            <Typography variant="caption" color="text.secondary">
                                                ({auditLog.user.user_code})
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            アクション
                                        </Typography>
                                        <Chip
                                            label={auditLog.action}
                                            color={getActionColor(auditLog.action)}
                                        />
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            対象モデル
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {auditLog.model_type ? auditLog.model_type.split('\\').pop() : 'なし'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            対象ID
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {auditLog.model_id || 'なし'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            説明
                                        </Typography>
                                        <Typography variant="body1">
                                            {auditLog.description}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Request Information */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#1565c0', fontWeight: 'bold' }}>
                                リクエスト情報
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            IPアドレス
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {auditLog.ip_address || 'なし'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            HTTPメソッド
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {auditLog.method || 'なし'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            URL
                                        </Typography>
                                        <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                            {auditLog.url || 'なし'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            ユーザーエージェント
                                        </Typography>
                                        <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                            {auditLog.user_agent || 'なし'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Data Changes */}
                        {(auditLog.old_values || auditLog.new_values) && (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#1565c0', fontWeight: 'bold' }}>
                                    データ変更
                                </Typography>
                                
                                <Grid container spacing={3}>
                                    {auditLog.old_values && (
                                        <Grid item xs={12} md={6}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="subtitle1" sx={{ mb: 2, color: '#d32f2f', fontWeight: 'bold' }}>
                                                        変更前の値
                                                    </Typography>
                                                    <Box 
                                                        component="pre" 
                                                        sx={{ 
                                                            backgroundColor: '#f5f5f5',
                                                            padding: 2,
                                                            borderRadius: 1,
                                                            fontSize: '0.875rem',
                                                            overflow: 'auto',
                                                            whiteSpace: 'pre-wrap',
                                                            fontFamily: 'monospace'
                                                        }}
                                                    >
                                                        {formatJson(auditLog.old_values)}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )}
                                    
                                    {auditLog.new_values && (
                                        <Grid item xs={12} md={auditLog.old_values ? 6 : 12}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="subtitle1" sx={{ mb: 2, color: '#2e7d32', fontWeight: 'bold' }}>
                                                        変更後の値
                                                    </Typography>
                                                    <Box 
                                                        component="pre" 
                                                        sx={{ 
                                                            backgroundColor: '#f5f5f5',
                                                            padding: 2,
                                                            borderRadius: 1,
                                                            fontSize: '0.875rem',
                                                            overflow: 'auto',
                                                            whiteSpace: 'pre-wrap',
                                                            fontFamily: 'monospace'
                                                        }}
                                                    >
                                                        {formatJson(auditLog.new_values)}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        )}

                    </div>
                </div>
            </StaffSystemLayout>
        </>
    );
}
