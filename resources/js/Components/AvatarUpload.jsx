import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Avatar,
    Button,
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    PhotoCamera as PhotoCameraIcon,
    Delete as DeleteIcon,
    Person as PersonIcon
} from '@mui/icons-material';

export default function AvatarUpload({ 
    user, 
    size = 100, 
    editable = true, 
    onSuccess = null 
}) {
    const [uploading, setUploading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // ファイルサイズチェック (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('ファイルサイズは2MB以下にしてください');
            return;
        }

        // ファイル形式チェック
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('JPEG、PNG、GIF形式のファイルを選択してください');
            return;
        }

        uploadFile(file);
    };

    const uploadFile = async (file) => {
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch(
                user?.id 
                    ? route('upload.avatar', user.id)
                    : route('upload.avatar'),
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                if (onSuccess) {
                    onSuccess(data);
                } else {
                    router.reload();
                }
            } else {
                setError(data.error || 'アップロードに失敗しました');
            }
        } catch (err) {
            setError('アップロード中にエラーが発生しました');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        setUploading(true);
        setError('');

        try {
            const response = await fetch(
                user?.id 
                    ? route('upload.avatar.delete', user.id)
                    : route('upload.avatar.delete'),
                {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                if (onSuccess) {
                    onSuccess(data);
                } else {
                    router.reload();
                }
            } else {
                setError(data.error || '削除に失敗しました');
            }
        } catch (err) {
            setError('削除中にエラーが発生しました');
            console.error('Delete error:', err);
        } finally {
            setUploading(false);
            setDeleteDialogOpen(false);
        }
    };

    const avatarSrc = user?.avatar_photo 
        ? `/storage/${user.avatar_photo}` 
        : null;

    return (
        <Box className="text-center">
            <Box className="relative inline-block">
                <Avatar
                    src={avatarSrc}
                    sx={{ width: size, height: size, margin: '0 auto' }}
                >
                    {uploading ? (
                        <CircularProgress size={size * 0.6} />
                    ) : (
                        <PersonIcon sx={{ fontSize: size * 0.6 }} />
                    )}
                </Avatar>

                {editable && !uploading && (
                    <Box className="absolute bottom-0 right-0">
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="avatar-upload"
                            type="file"
                            onChange={handleFileSelect}
                        />
                        <label htmlFor="avatar-upload">
                            <IconButton
                                color="primary"
                                component="span"
                                size="small"
                                sx={{
                                    backgroundColor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': {
                                        backgroundColor: 'background.paper',
                                    }
                                }}
                            >
                                <PhotoCameraIcon fontSize="small" />
                            </IconButton>
                        </label>
                    </Box>
                )}
            </Box>

            {editable && (
                <Box className="mt-2">
                    <Typography variant="caption" color="textSecondary" display="block">
                        プロフィール画像
                    </Typography>
                    
                    {user?.avatar_photo && !uploading && (
                        <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteDialogOpen(true)}
                            sx={{ mt: 1 }}
                        >
                            削除
                        </Button>
                    )}
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {!editable && user?.name && (
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                    {user.name}
                </Typography>
            )}

            {/* 削除確認ダイアログ */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>プロフィール画像削除確認</DialogTitle>
                <DialogContent>
                    <Typography>
                        プロフィール画像を削除してもよろしいですか？
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        キャンセル
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        削除
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}