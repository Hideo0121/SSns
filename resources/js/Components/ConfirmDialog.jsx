import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Typography,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Warning as WarningIcon,
    Help as HelpIcon,
    Info as InfoIcon,
    Error as ErrorIcon,
    ExitToApp as LogoutIcon,
    Delete as DeleteIcon,
    Save as SaveIcon
} from '@mui/icons-material';

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = '実行',
    cancelText = 'キャンセル',
    onConfirm,
    onCancel,
    severity = 'warning', // 'warning', 'error', 'info', 'question', 'logout', 'delete', 'save'
    loading = false
}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const getIcon = () => {
        const iconStyle = { fontSize: 48, marginBottom: 2 };
        
        switch (severity) {
            case 'warning':
                return <WarningIcon sx={{ ...iconStyle, color: theme.palette.warning.main }} />;
            case 'error':
                return <ErrorIcon sx={{ ...iconStyle, color: theme.palette.error.main }} />;
            case 'info':
                return <InfoIcon sx={{ ...iconStyle, color: theme.palette.info.main }} />;
            case 'question':
                return <HelpIcon sx={{ ...iconStyle, color: theme.palette.primary.main }} />;
            case 'logout':
                return <LogoutIcon sx={{ ...iconStyle, color: theme.palette.warning.main }} />;
            case 'delete':
                return <DeleteIcon sx={{ ...iconStyle, color: theme.palette.error.main }} />;
            case 'save':
                return <SaveIcon sx={{ ...iconStyle, color: theme.palette.success.main }} />;
            default:
                return <WarningIcon sx={{ ...iconStyle, color: theme.palette.warning.main }} />;
        }
    };

    const getConfirmButtonColor = () => {
        switch (severity) {
            case 'error':
            case 'delete':
                return 'error';
            case 'warning':
            case 'logout':
                return 'warning';
            case 'save':
                return 'success';
            default:
                return 'primary';
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            fullScreen={fullScreen}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                }
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }
            }}
        >
            <DialogTitle 
                sx={{
                    textAlign: 'center',
                    paddingBottom: 1,
                    paddingTop: 3
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="center">
                    {getIcon()}
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, marginTop: 1 }}>
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>
            
            <DialogContent sx={{ textAlign: 'center', paddingTop: 1, paddingBottom: 2 }}>
                <DialogContentText
                    sx={{
                        fontSize: '16px',
                        lineHeight: 1.6,
                        color: theme.palette.text.primary,
                        whiteSpace: 'pre-line' // 改行を保持
                    }}
                >
                    {message}
                </DialogContentText>
            </DialogContent>
            
            <DialogActions 
                sx={{ 
                    justifyContent: 'center',
                    padding: '16px 24px',
                    gap: 2
                }}
            >
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    size="large"
                    disabled={loading}
                    sx={{
                        minWidth: 100,
                        fontWeight: 500
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={handleConfirm}
                    color={getConfirmButtonColor()}
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                        minWidth: 100,
                        fontWeight: 500
                    }}
                    autoFocus
                >
                    {loading ? '実行中...' : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
