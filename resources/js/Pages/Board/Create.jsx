import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Paper,
    Box,
    Typography,
    Alert
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon, Logout as LogoutIcon } from '@mui/icons-material';

export default function Create({ categories }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category_id: '',
        new_category: ''
    });

    const [showNewCategory, setShowNewCategory] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', severity: '', onConfirm: null });

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmDialog({
            open: true,
            title: 'トピック作成確認',
            message: `「${data.title || '新しいトピック'}」を作成してよろしいですか？`,
            severity: 'save',
            onConfirm: () => confirmSubmit()
        });
    };

    const confirmSubmit = () => {
        post(route('threads.store'), {
            onSuccess: () => {
                setConfirmDialog({ open: false, title: '', message: '', severity: '', onConfirm: null });
            },
            onError: () => {
                setConfirmDialog({ open: false, title: '', message: '', severity: '', onConfirm: null });
            }
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
                    掲示板に戻る
                </Button>
                <h2 style={{ 
                    margin: 0, 
                    color: '#1565c0', 
                    fontWeight: 'bold',
                    fontSize: '18px'
                }}>
                    新規トピック作成
                </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                    type="submit"
                    form="topic-form"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={processing}
                    sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        textTransform: 'none'
                    }}
                >
                    投稿する
                </Button>
            </div>
        </div>
    );

    return (
        <StaffSystemLayout title="新規トピック作成" navigationBar={navigationBar}>
            <div style={{ padding: '24px' }}>
                <div style={{ 
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <form id="topic-form" onSubmit={handleSubmit}>
                            <Box className="space-y-6">
                                <TextField
                                    label="タイトル *"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    fullWidth
                                    required
                                />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl fullWidth error={!!errors.category_id || !!errors.category}>
                                        <InputLabel>カテゴリ *</InputLabel>
                                        <Select
                                            value={showNewCategory ? 'new' : data.category_id}
                                            label="カテゴリ *"
                                            onChange={(e) => {
                                                if (e.target.value === 'new') {
                                                    setShowNewCategory(true);
                                                    setData('category_id', '');
                                                } else {
                                                    setShowNewCategory(false);
                                                    setData('category_id', e.target.value);
                                                    setData('new_category', '');
                                                }
                                            }}
                                        >
                                            {categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                            <MenuItem value="new" sx={{ fontStyle: 'italic', color: '#1976d2' }}>
                                                ➕ 新しいカテゴリを作成
                                            </MenuItem>
                                        </Select>
                                        {(errors.category_id || errors.category) && (
                                            <Typography variant="caption" color="error" sx={{ ml: 2, mt: 1 }}>
                                                {errors.category_id || errors.category}
                                            </Typography>
                                        )}
                                    </FormControl>

                                    {showNewCategory && (
                                        <TextField
                                            label="新しいカテゴリ名 *"
                                            value={data.new_category}
                                            onChange={(e) => setData('new_category', e.target.value)}
                                            error={!!errors.new_category}
                                            helperText={errors.new_category || "新しいカテゴリ名を入力してください"}
                                            fullWidth
                                            placeholder="例: 技術情報、お知らせ、質問など"
                                        />
                                    )}
                                </Box>

                                <TextField
                                    label="内容 *"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    error={!!errors.content}
                                    helperText={errors.content}
                                    fullWidth
                                    multiline
                                    rows={8}
                                    required
                                />

                                <Alert severity="info">
                                    <Typography variant="body2">
                                        <strong>投稿時の注意事項:</strong>
                                        <br />
                                        • 他のユーザーに対する敬意を払ってください
                                        <br />
                                        • 適切なカテゴリを選択してください
                                        <br />
                                        • 明確で分かりやすいタイトルをつけてください
                                    </Typography>
                                </Alert>
                            </Box>

                            <Box className="mt-8 flex justify-end gap-4">
                                <Button
                                    component={Link}
                                    href={route('threads.index')}
                                    variant="outlined"
                                >
                                    キャンセル
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    disabled={processing}
                                >
                                    作成
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </div>
            </div>

            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                severity={confirmDialog.severity}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ open: false, title: '', message: '', severity: '', onConfirm: null })}
                processing={processing}
            />
        </StaffSystemLayout>
    );
}