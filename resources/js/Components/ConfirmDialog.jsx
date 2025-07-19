import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = '実行',
    cancelText = 'キャンセル',
    onConfirm,
    onCancel,
    severity = 'warning' // 'warning', 'error', 'info'
}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const getSeverityColor = () => {
        switch (severity) {
            case 'error':
                return theme.palette.error.main;
            case 'warning':
                return theme.palette.warning.main;
            case 'info':
                return theme.palette.info.main;
            default:
                return theme.palette.warning.main;
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
            onKeyDown={handleKeyDown}
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
                    borderBottom: `2px solid ${getSeverityColor()}`,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    fontWeight: 600,
                    fontSize: '18px',
                    color: getSeverityColor()
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent sx={{ padding: '24px', minHeight: '60px' }}>
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
                    padding: '16px 24px',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                }}
            >
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    sx={{
                        minWidth: '100px',
                        marginRight: '12px',
                        borderColor: theme.palette.grey[300],
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            borderColor: theme.palette.grey[400],
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    sx={{
                        minWidth: '100px',
                        backgroundColor: getSeverityColor(),
                        '&:hover': {
                            backgroundColor: theme.palette[severity]?.dark || getSeverityColor(),
                        }
                    }}
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
