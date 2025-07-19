import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import {
    Paper,
    Box,
    Typography,
    Chip,
    Button,
    Avatar,
    Alert,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Comment as CommentIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Send as SendIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';

// コメントアイテムコンポーネント
function CommentItem({ comment, auth, onEdit, onDelete, editingComment, editData, setEditData, handleUpdateComment, editProcessing, setEditingComment, formatDate }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const canEdit = (item) => {
        return auth.user && item.user && item.user.id === auth.user.id;
    };

    return (
        <ListItem
            alignItems="flex-start"
            sx={{ 
                padding: '16px 0',
                '&:hover': { backgroundColor: '#f3f7ff' }
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                    {comment.user?.name?.charAt(0) || '?'}
                </Avatar>
            </ListItemAvatar>
            
            <ListItemText
                primary={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {comment.user?.name || '匿名'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {formatDate(comment.created_at)}
                            </Typography>
                        </div>
                        
                        {canEdit(comment) && (
                            <IconButton
                                size="small"
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        )}
                    </div>
                }
                secondary={
                    editingComment === comment.id ? (
                        <div style={{ marginTop: '12px' }}>
                            <TextField
                                value={editData.content}
                                onChange={(e) => setEditData('content', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                sx={{ marginBottom: '12px' }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleUpdateComment(comment.id)}
                                    disabled={editProcessing}
                                    sx={{ textTransform: 'none' }}
                                >
                                    更新
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => setEditingComment(null)}
                                    sx={{ textTransform: 'none' }}
                                >
                                    キャンセル
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                                marginTop: '8px'
                            }}
                        >
                            {comment.content}
                        </Typography>
                    )
                }
            />
            
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => {
                    onEdit(comment);
                    setAnchorEl(null);
                }}>
                    <EditIcon fontSize="small" sx={{ marginRight: '8px' }} />
                    編集
                </MenuItem>
                <MenuItem onClick={() => {
                    onDelete(comment);
                    setAnchorEl(null);
                }}>
                    <DeleteIcon fontSize="small" sx={{ marginRight: '8px' }} />
                    削除
                </MenuItem>
            </Menu>
        </ListItem>
    );
}

export default function Show({ thread, isFavorited, flash, favoritesCount: serverFavoritesCount }) {
    const { auth } = usePage().props;
    const [favorited, setFavorited] = useState(isFavorited);
    const [favoritesCount, setFavoritesCount] = useState(serverFavoritesCount || thread.favorites?.length || 0);
    const [editingComment, setEditingComment] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    // プロパティが変更された時に状態を更新
    useEffect(() => {
        setFavorited(isFavorited);
        console.log('isFavorited が更新されました:', isFavorited);
    }, [isFavorited]);

    useEffect(() => {
        const newCount = serverFavoritesCount ?? thread.favorites?.length ?? 0;
        setFavoritesCount(newCount);
        console.log('favoritesCount が更新されました:', newCount);
    }, [serverFavoritesCount, thread.favorites]);

    // デバッグ情報をコンソールに出力
    console.log('Thread data:', thread);
    console.log('isFavorited:', isFavorited);
    console.log('serverFavoritesCount:', serverFavoritesCount);
    console.log('favorites array:', thread.favorites);
    console.log('favoritesCount:', favoritesCount);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: ''
    });

    const { data: editData, setData: setEditData, patch, processing: editProcessing } = useForm({
        content: ''
    });

    const handleFavoriteToggle = () => {
        console.log('お気に入りボタンがクリックされました');
        console.log('現在の状態 - favorited:', favorited, 'favoritesCount:', favoritesCount);
        
        router.post(route('threads.favorite', thread.id), {}, {
            onStart: () => {
                console.log('お気に入り処理開始');
            },
            onSuccess: (page) => {
                console.log('お気に入り処理成功:', page);
                // 成功後、確実に最新の状態でページを再表示
                window.location.reload();
            },
            onError: (errors) => {
                console.error('お気に入り処理エラー:', errors);
                alert('お気に入りの処理でエラーが発生しました: ' + JSON.stringify(errors));
            },
            onFinish: () => {
                console.log('お気に入り処理完了');
            }
        });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        post(route('comments.store', thread.id), {
            onSuccess: () => {
                reset();
                router.reload();
            },
            onError: (errors) => {
                console.error('コメント投稿エラー:', errors);
            }
        });
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment.id);
        setEditData('content', comment.content);
    };

    const handleUpdateComment = (commentId) => {
        patch(route('comments.update', commentId), {
            onSuccess: () => {
                setEditingComment(null);
                router.reload();
            },
            onError: (errors) => {
                console.error('コメント更新エラー:', errors);
            }
        });
    };

    const handleDeleteComment = (comment) => {
        setCommentToDelete(comment);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteComment = () => {
        if (commentToDelete) {
            router.delete(route('comments.destroy', commentToDelete.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setCommentToDelete(null);
                    router.reload();
                },
                onError: (errors) => {
                    console.error('コメント削除エラー:', errors);
                    setDeleteDialogOpen(false);
                    setCommentToDelete(null);
                }
            });
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

    const getCategoryColor = (categoryName) => {
        const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
        const index = categoryName.length % colors.length;
        return colors[index];
    };

    const canEdit = (item) => {
        return auth.user && item.user && item.user.id === auth.user.id;
    };

    return (
        <>
            <Head title={thread.title} />
            
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
                        {auth.user?.name || 'ユーザー'}
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
                            href={route('threads.index')}
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
                            一覧に戻る
                        </Button>
                        <h2 style={{ 
                            margin: 0, 
                            color: '#1565c0', 
                            fontWeight: 'bold',
                            fontSize: '18px'
                        }}>
                            掲示板詳細
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {canEdit(thread) && (
                            <Button
                                component={Link}
                                href={route('threads.edit', thread.id)}
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
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ 
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '24px'
                }}>
                    {flash?.success && (
                        <Alert severity="success" sx={{ marginBottom: '24px' }}>
                            {flash.success}
                        </Alert>
                    )}

                    {/* Thread Content */}
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <Typography 
                                    variant="h5" 
                                    component="h1" 
                                    sx={{ 
                                        color: '#1565c0',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        fontSize: '24px',
                                        flex: 1
                                    }}
                                >
                                    {thread.title}
                                </Typography>
                                <Chip
                                    label={thread.category?.name || 'その他'}
                                    color={getCategoryColor(thread.category?.name || 'その他')}
                                    sx={{ fontSize: '12px', fontWeight: '500' }}
                                />
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#666', fontSize: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <PersonIcon sx={{ fontSize: '18px' }} />
                                    <span>{thread.user?.name || '匿名'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ScheduleIcon sx={{ fontSize: '18px' }} />
                                    <span>{formatDate(thread.created_at)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ padding: '32px' }}>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: 1.6,
                                    marginBottom: '24px',
                                    fontSize: '16px'
                                }}
                            >
                                {thread.content}
                            </Typography>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Button
                                    startIcon={favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                    onClick={handleFavoriteToggle}
                                    color={favorited ? "error" : "primary"}
                                    variant={favorited ? "contained" : "outlined"}
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        textTransform: 'none'
                                    }}
                                >
                                    お気に入り ({favoritesCount})
                                </Button>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                                    <CommentIcon sx={{ fontSize: '18px' }} />
                                    <span>{thread.comments?.length || 0} コメント</span>
                                </div>
                            </div>
                        </div>
                    </Paper>

                    {/* Comment Form */}
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
                                    fontSize: '18px'
                                }}
                            >
                                コメントを投稿
                            </Typography>
                        </div>
                        
                        <div style={{ padding: '32px' }}>
                            <form onSubmit={handleCommentSubmit}>
                                <TextField
                                    label="コメント内容"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    error={!!errors.content}
                                    helperText={errors.content}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    sx={{ marginBottom: '24px' }}
                                    required
                                />
                                
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SendIcon />}
                                    disabled={processing}
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        textTransform: 'none'
                                    }}
                                >
                                    {processing ? '投稿中...' : 'コメント投稿'}
                                </Button>
                            </form>
                        </div>
                    </Paper>

                    {/* Comments List */}
                    {thread.comments && thread.comments.length > 0 && (
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
                                        fontSize: '18px'
                                    }}
                                >
                                    コメント ({thread.comments.length})
                                </Typography>
                            </div>
                            
                            <div style={{ padding: '32px' }}>
                                <List sx={{ padding: 0 }}>
                                    {thread.comments.map((comment, index) => (
                                        <div key={comment.id}>
                                            <CommentItem
                                                comment={comment}
                                                auth={auth}
                                                onEdit={handleEditComment}
                                                onDelete={handleDeleteComment}
                                                editingComment={editingComment}
                                                editData={editData}
                                                setEditData={setEditData}
                                                handleUpdateComment={handleUpdateComment}
                                                editProcessing={editProcessing}
                                                setEditingComment={setEditingComment}
                                                formatDate={formatDate}
                                            />
                                            {index < thread.comments.length - 1 && (
                                                <div style={{ borderBottom: '1px solid #e0e0e0', margin: '0 16px' }} />
                                            )}
                                        </div>
                                    ))}
                                </List>
                            </div>
                        </Paper>
                    )}

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>コメント削除確認</DialogTitle>
                        <DialogContent>
                            <Typography>
                                このコメントを削除してもよろしいですか？この操作は元に戻せません。
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
                                キャンセル
                            </Button>
                            <Button onClick={confirmDeleteComment} color="error" sx={{ textTransform: 'none' }}>
                                削除
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </>
    );
}
