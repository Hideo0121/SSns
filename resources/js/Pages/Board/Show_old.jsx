import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
    Card,
    CardContent,
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

export default function Show({ thread, isFavorited, flash }) {
    const { auth } = usePage().props;
    const [favorited, setFavorited] = useState(isFavorited);
    const [favoritesCount, setFavoritesCount] = useState(thread.favorites?.length || 0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: ''
    });

    const { data: editData, setData: setEditData, patch, processing: editProcessing } = useForm({
        content: ''
    });

    const handleFavoriteToggle = () => {
        router.post(route('threads.favorite', thread.id), {}, {
            onSuccess: (page) => {
                setFavorited(!favorited);
                setFavoritesCount(favorited ? favoritesCount - 1 : favoritesCount + 1);
            }
        });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        post(route('comments.store', thread.id), {
            onSuccess: () => {
                reset();
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
            }
        });
    };

    const handleDeleteComment = (comment) => {
        setCommentToDelete(comment);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteComment = () => {
        if (commentToDelete) {
            router.delete(route('comments.destroy', commentToDelete.id));
            setDeleteDialogOpen(false);
            setCommentToDelete(null);
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
        return item.user.id === window.Laravel?.user?.id;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    掲示板詳細
                </h2>
            }
        >
            <Head title={thread.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <Alert severity="success" className="mb-4">
                            {flash.success}
                        </Alert>
                    )}

                    <Box className="mb-6 flex items-center justify-between">
                        <Button
                            component={Link}
                            href={route('threads.index')}
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                        >
                            一覧に戻る
                        </Button>
                        
                        {canEdit(thread) && (
                            <Box className="flex gap-2">
                                <Button
                                    component={Link}
                                    href={route('threads.edit', thread.id)}
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                >
                                    編集
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {/* メインコンテンツ */}
                    <Paper className="p-6 mb-6">
                        <Box className="flex items-start gap-4">
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                            <Box className="flex-1">
                                <Box className="flex items-center gap-2 mb-2">
                                    <Typography variant="h4" component="h1">
                                        {thread.title}
                                    </Typography>
                                    <Chip
                                        label={thread.category.name}
                                        color={getCategoryColor(thread.category.name)}
                                        size="small"
                                    />
                                </Box>
                                
                                <Box className="flex items-center gap-4 text-sm mb-4">
                                    <Box className="flex items-center gap-1">
                                        <PersonIcon fontSize="small" />
                                        <Typography variant="body2">
                                            {thread.user.name}
                                        </Typography>
                                    </Box>
                                    
                                    <Box className="flex items-center gap-1">
                                        <ScheduleIcon fontSize="small" />
                                        <Typography variant="body2">
                                            {formatDate(thread.created_at)}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Typography 
                                    variant="body1" 
                                    className="mb-4"
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {thread.content}
                                </Typography>
                                
                                <Box className="flex items-center gap-4">
                                    <Button
                                        startIcon={favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        onClick={handleFavoriteToggle}
                                        color={favorited ? "error" : "default"}
                                        variant={favorited ? "contained" : "outlined"}
                                    >
                                        お気に入り ({favoritesCount})
                                    </Button>
                                    
                                    <Box className="flex items-center gap-1">
                                        <CommentIcon color="action" />
                                        <Typography variant="body2">
                                            {thread.comments?.length || 0} コメント
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* コメント投稿フォーム */}
                    <Paper className="p-6 mb-6">
                        <Typography variant="h6" className="mb-4">
                            コメントを投稿
                        </Typography>
                        
                        <form onSubmit={handleCommentSubmit}>
                            <TextField
                                label="コメント内容"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                error={!!errors.content}
                                helperText={errors.content}
                                fullWidth
                                multiline
                                rows={3}
                                className="mb-4"
                                required
                            />
                            
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SendIcon />}
                                disabled={processing}
                            >
                                コメント投稿
                            </Button>
                        </form>
                    </Paper>

                    {/* コメント一覧 */}
                    {thread.comments && thread.comments.length > 0 && (
                        <Paper className="p-6">
                            <Typography variant="h6" className="mb-4">
                                コメント ({thread.comments.length})
                            </Typography>
                            
                            <List>
                                {thread.comments.map((comment, index) => (
                                    <ListItem
                                        key={comment.id}
                                        alignItems="flex-start"
                                        divider={index < thread.comments.length - 1}
                                        className="px-0"
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        
                                        <ListItemText
                                            primary={
                                                <Box className="flex items-center justify-between">
                                                    <Box className="flex items-center gap-2">
                                                        <Typography variant="subtitle2">
                                                            {comment.user.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {formatDate(comment.created_at)}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    {canEdit(comment) && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => setAnchorEl(e.currentTarget)}
                                                        >
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                editingComment === comment.id ? (
                                                    <Box className="mt-2">
                                                        <TextField
                                                            value={editData.content}
                                                            onChange={(e) => setEditData('content', e.target.value)}
                                                            fullWidth
                                                            multiline
                                                            rows={2}
                                                            size="small"
                                                            className="mb-2"
                                                        />
                                                        <Box className="flex gap-2">
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => handleUpdateComment(comment.id)}
                                                                disabled={editProcessing}
                                                            >
                                                                更新
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                onClick={() => setEditingComment(null)}
                                                            >
                                                                キャンセル
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Typography 
                                                        variant="body2" 
                                                        className="mt-1"
                                                        style={{ whiteSpace: 'pre-wrap' }}
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
                                                handleEditComment(comment);
                                                setAnchorEl(null);
                                            }}>
                                                <EditIcon fontSize="small" className="mr-2" />
                                                編集
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                handleDeleteComment(comment);
                                                setAnchorEl(null);
                                            }}>
                                                <DeleteIcon fontSize="small" className="mr-2" />
                                                削除
                                            </MenuItem>
                                        </Menu>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}

                    {/* 削除確認ダイアログ */}
                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>コメント削除確認</DialogTitle>
                        <DialogContent>
                            <Typography>
                                このコメントを削除してもよろしいですか？この操作は元に戻せません。
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)}>
                                キャンセル
                            </Button>
                            <Button onClick={confirmDeleteComment} color="error">
                                削除
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}