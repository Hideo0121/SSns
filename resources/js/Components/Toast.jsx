import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

export default function Toast({ 
    open, 
    message, 
    severity = 'success', 
    duration = 3000, 
    onClose 
}) {
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsOpen(false);
        if (onClose) {
            onClose();
        }
    };

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ 
                vertical: 'top', 
                horizontal: 'right' 
            }}
            TransitionComponent={SlideTransition}
            sx={{
                marginTop: '64px', // ヘッダーの高さ分下げる
                '& .MuiSnackbar-root': {
                    top: '80px !important'
                }
            }}
        >
            <Alert 
                onClose={handleClose} 
                severity={severity}
                variant="filled"
                sx={{
                    width: '100%',
                    fontSize: '14px',
                    fontWeight: '500'
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
