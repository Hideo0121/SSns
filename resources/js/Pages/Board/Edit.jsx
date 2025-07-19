import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
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
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function Edit({ thread, categories }) {
    const { auth } = usePage().props;
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    
    const { data, setData, put, processing, errors } = useForm({
        title: thread.title || '',
        content: thread.content || '',
        category_id: thread.category_id || '',
        new_category: ''
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('threads.update', thread.id));
    };

    const handleCategoryChange = (value) => {
        setData('category_id', value);
        setShowNewCategoryInput(value === 'new');
        if (value !== 'new') {
            setData('new_category', '');
        }
    };

    return (
        <>
            <Head title="トピック編集" />
            
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
                            href={route('threads.show', thread.id)}
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
                            詳細に戻る
                        </Button>
                        <h2 style={{ 
                            margin: 0, 
                            color: '#1565c0', 
                            fontWeight: 'bold',
                            fontSize: '18px'
                        }}>
                            トピック編集
                        </h2>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ 
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '24px'
                }}>
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
                                variant="h5" 
                                component="h1" 
                                sx={{ 
                                    color: '#1565c0',
                                    fontWeight: 'bold',
                                    margin: 0,
                                    fontSize: '24px'
                                }}
                            >
                                トピック編集: {thread.title}
                            </Typography>
                        </div>
                        
                        <div style={{ padding: '32px' }}>
                            <form onSubmit={submit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <TextField
                                        label="タイトル *"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        error={!!errors.title}
                                        helperText={errors.title}
                                        fullWidth
                                        required
                                    />

                                    <FormControl fullWidth error={!!errors.category_id}>
                                        <InputLabel id="category-select-label">カテゴリ *</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            value={data.category_id}
                                            onChange={(e) => handleCategoryChange(e.target.value)}
                                            label="カテゴリ *"
                                            required
                                        >
                                            {categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                            <MenuItem value="new">+ 新しいカテゴリを作成</MenuItem>
                                        </Select>
                                        {errors.category_id && (
                                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                                {errors.category_id}
                                            </Typography>
                                        )}
                                    </FormControl>

                                    {showNewCategoryInput && (
                                        <TextField
                                            label="新しいカテゴリ名 *"
                                            value={data.new_category}
                                            onChange={(e) => setData('new_category', e.target.value)}
                                            error={!!errors.new_category}
                                            helperText={errors.new_category || '新しいカテゴリ名を入力してください'}
                                            fullWidth
                                            required={showNewCategoryInput}
                                        />
                                    )}

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

                                    <Alert severity="warning">
                                        <Typography variant="body2">
                                            <strong>編集時の注意事項:</strong>
                                            <br />
                                            • 他のユーザーがすでにコメントしている場合は、内容を大幅に変更しないようご注意ください
                                            <br />
                                            • 編集履歴は記録されます
                                        </Typography>
                                    </Alert>
                                </Box>

                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        component={Link}
                                        href={route('threads.show', thread.id)}
                                        variant="outlined"
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            textTransform: 'none'
                                        }}
                                    >
                                        キャンセル
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={processing}
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            textTransform: 'none'
                                        }}
                                    >
                                        {processing ? '更新中...' : '更新'}
                                    </Button>
                                </Box>
                            </form>
                        </div>
                    </Paper>
                </div>
            </div>
        </>
    );
}
