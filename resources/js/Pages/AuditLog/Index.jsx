import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import {
    TextField,
    Button,
    Paper,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Chip,
    Pagination,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Download as DownloadIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';

export default function Index({ auditLogs, filters, users, availableActions, availableModelTypes }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        action: filters.action || '',
        model_type: filters.model_type || '',
        user_id: filters.user_id || '',
        search: filters.search || '',
        per_page: filters.per_page || 25 // ページサイズを25に削減
    });

    const handleFilter = () => {
        get(route('audit-logs.index'), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleClear = () => {
        router.get(route('audit-logs.index'));
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            if (data[key]) {
                params.append(key, data[key]);
            }
        });
        
        window.open(`${route('audit-logs.export')}?${params.toString()}`, '_blank');
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
                    監査ログ
                </h2>
            </div>
        </div>
    );

    return (
        <>
            <Head title="監査ログ" />
            <StaffSystemLayout title="監査ログ" navigationBar={navigationBar}>
                <div style={{ padding: '24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        
                        {/* Filter Section */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#1565c0', fontWeight: 'bold' }}>
                                フィルター
                            </Typography>
                            
                            {/* フィルタを一行に表示 */}
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        sx={{ minWidth: '200px' }}
                                        label="開始日時"
                                        type="datetime-local"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        sx={{ minWidth: '200px' }}
                                        label="終了日時"
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
                                        <InputLabel sx={{ fontFamily: 'inherit', fontSize: '14px' }}>
                                            アクション
                                        </InputLabel>
                                        <Select
                                            value={data.action}
                                            onChange={(e) => setData('action', e.target.value)}
                                            label="アクション"
                                            sx={{ width: '100%', minHeight: '40px' }}
                                            MenuProps={{ PaperProps: { style: { maxHeight: 200, minWidth: '200px' } } }}
                                        >
                                            <MenuItem value="">すべて</MenuItem>
                                            {availableActions.map(action => (
                                                <MenuItem key={action} value={action}>{action}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
                                        <InputLabel sx={{ fontFamily: 'inherit', fontSize: '14px' }}>
                                            ユーザー
                                        </InputLabel>
                                        <Select
                                            value={data.user_id}
                                            onChange={(e) => setData('user_id', e.target.value)}
                                            label="ユーザー"
                                            sx={{ width: '100%', minHeight: '40px' }}
                                            MenuProps={{ PaperProps: { style: { maxHeight: 200, minWidth: '200px' } } }}
                                        >
                                            <MenuItem value="">すべて</MenuItem>
                                            {users.map(user => (
                                                <MenuItem key={user.id} value={user.id}>{user.name} ({user.user_code})</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4}>
                                    <TextField
                                        sx={{ minWidth: '200px' }}
                                        label="説明で検索"
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        placeholder="操作の説明で検索..."
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            
                            {/* ボタン行 */}
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SearchIcon />}
                                            onClick={handleFilter}
                                            disabled={processing}
                                            size="small"
                                            sx={{ background: '#1976d2', minWidth: '80px' }}
                                        >
                                            検索
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ClearIcon />}
                                            onClick={handleClear}
                                            size="small"
                                            sx={{ color: '#1976d2', borderColor: '#1976d2', minWidth: '80px' }}
                                        >
                                            クリア
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            onClick={handleExport}
                                            size="small"
                                            sx={{ color: '#1976d2', borderColor: '#1976d2', minWidth: '80px' }}
                                        >
                                            CSV出力
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Results */}
                        <Paper sx={{ overflow: 'hidden' }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                                <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                                    監査ログ一覧 ({auditLogs.total}件)
                                </Typography>
                            </Box>
                            
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>日時</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>ユーザー</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>アクション</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>対象</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>説明</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>IPアドレス</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', width: 100 }}>操作</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {auditLogs.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                    <Typography color="text.secondary">
                                                        監査ログが見つかりません
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            auditLogs.data.map((log) => (
                                                <TableRow key={log.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {formatDateTime(log.created_at)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {log.user?.name || '不明'}
                                                            </Typography>
                                                            {log.user?.user_code && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {log.user.user_code}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={log.action}
                                                            size="small"
                                                            color={getActionColor(log.action)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {log.model_type && (
                                                            <Box>
                                                                <Typography variant="body2">
                                                                    {log.model_type.split('\\').pop()}
                                                                </Typography>
                                                                {log.model_id && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        ID: {log.model_id}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                maxWidth: 300,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {log.description}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {log.ip_address}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title="詳細表示">
                                                            <IconButton
                                                                component={Link}
                                                                href={route('audit-logs.show', log.id)}
                                                                size="small"
                                                                sx={{ color: '#1976d2' }}
                                                            >
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            {auditLogs.last_page > 1 && (
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        count={auditLogs.last_page}
                                        page={auditLogs.current_page}
                                        onChange={(e, page) => {
                                            setData('page', page);
                                            get(route('audit-logs.index'), {
                                                preserveState: true,
                                                preserveScroll: true
                                            });
                                        }}
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </Paper>

                    </div>
                </div>
            </StaffSystemLayout>
        </>
    );
}
