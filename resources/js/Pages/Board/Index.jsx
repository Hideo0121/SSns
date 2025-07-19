import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import {
    Card,
    CardContent,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Chip,
    Avatar,
    Alert,
    Grid,
    Pagination
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Comment as CommentIcon,
    Favorite as FavoriteIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    ArrowBack as ArrowBackIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';

export default function Index({ threads, categories, filters, flash }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    const handleSearch = () => {
        router.get(route('threads.index'), {
            search,
            category
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleReset = () => {
        setSearch('');
        setCategory('');
        router.get(route('threads.index'));
    };

    const getCategoryColor = (categoryName) => {
        const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
        const index = categoryName.length % colors.length;
        return colors[index];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (event, page) => {
        router.get(route('threads.index'), {
            ...filters,
            page
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
                    掲示板
                </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                    component={Link}
                    href={route('threads.create')}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        textTransform: 'none'
                    }}
                >
                    新規投稿
                </Button>
            </div>
        </div>
    );

    return (
        <StaffSystemLayout title="掲示板" navigationBar={navigationBar}>
            <div style={{ 
                padding: '24px'
            }}>
                <div style={{ 
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {flash?.success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {flash.success}
                        </Alert>
                    )}

                    {/* 検索・フィルタ */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box className="flex gap-4 items-end">
                                <TextField
                                    label="検索（タイトル・内容）"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    size="small"
                                    style={{ minWidth: 300 }}
                                />
                                
                                <FormControl size="small" style={{ minWidth: 150 }}>
                                    <InputLabel>カテゴリ</InputLabel>
                                    <Select
                                        value={category}
                                        label="カテゴリ"
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <MenuItem value="">全て</MenuItem>
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                
                                <Button
                                    variant="outlined"
                                    startIcon={<SearchIcon />}
                                    onClick={handleSearch}
                                >
                                    検索
                                </Button>
                                
                                <Button
                                    variant="text"
                                    onClick={handleReset}
                                >
                                    リセット
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* トピック一覧 */}
                    {threads.data.length > 0 ? (
                        <Box className="space-y-4">
                            {threads.data.map((thread) => (
                                <Card key={thread.id} className="hover:shadow-md transition-shadow">
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={8}>
                                                <Box className="flex items-start gap-3">
                                                    <Avatar size="small">
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Box className="flex-1">
                                                        <Box className="flex items-center gap-2 mb-2">
                                                            <Typography
                                                                component={Link}
                                                                href={route('threads.show', thread.id)}
                                                                variant="h6"
                                                                className="hover:underline cursor-pointer"
                                                                color="primary"
                                                            >
                                                                {thread.title}
                                                            </Typography>
                                                            <Chip
                                                                label={thread.category.name}
                                                                color={getCategoryColor(thread.category.name)}
                                                                size="small"
                                                            />
                                                        </Box>
                                                        
                                                        <Typography 
                                                            variant="body2" 
                                                            color="textSecondary"
                                                            className="mb-2"
                                                        >
                                                            {thread.content.length > 100 
                                                                ? thread.content.substring(0, 100) + '...'
                                                                : thread.content
                                                            }
                                                        </Typography>
                                                        
                                                        <Box className="flex items-center gap-4 text-sm">
                                                            <Box className="flex items-center gap-1">
                                                                <PersonIcon fontSize="small" />
                                                                <Typography variant="caption">
                                                                    {thread.user.name}
                                                                </Typography>
                                                            </Box>
                                                            
                                                            <Box className="flex items-center gap-1">
                                                                <ScheduleIcon fontSize="small" />
                                                                <Typography variant="caption">
                                                                    {formatDate(thread.created_at)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12} md={4}>
                                                <Box className="flex justify-end items-center gap-4 h-full">
                                                    <Box className="flex items-center gap-1">
                                                        <CommentIcon color="action" fontSize="small" />
                                                        <Typography variant="body2">
                                                            {thread.comments?.length || 0}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    <Box className="flex items-center gap-1">
                                                        <FavoriteIcon color="action" fontSize="small" />
                                                        <Typography variant="body2">
                                                            {thread.favorites?.length || 0}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    <Button
                                                        component={Link}
                                                        href={route('threads.show', thread.id)}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        詳細
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <ScheduleIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                                {search || category ? '条件に一致するトピックが見つかりません' : 'まだトピックがありません'}
                            </Typography>
                            {!search && !category && (
                                <>
                                    <Typography color="textSecondary" sx={{ mb: 4 }}>
                                        最初のトピックを作成してみましょう
                                    </Typography>
                                    <Button
                                        component={Link}
                                        href={route('threads.create')}
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                    >
                                        新規投稿
                                    </Button>
                                </>
                            )}
                        </Box>
                    )}

                    {/* ページネーション */}
                    {threads.data.length > 0 && threads.last_page > 1 && (
                        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                count={threads.last_page}
                                page={threads.current_page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </div>
            </div>
        </StaffSystemLayout>
    );
}