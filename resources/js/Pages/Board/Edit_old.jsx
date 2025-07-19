import { Head, Link, useForm, usePage } from '@inertiajs/react';
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

export default function Edit({ thread, categories }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        title: thread.title || '',
        content: thread.content || '',
        category_id: thread.category_id || ''
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('threads.update', thread.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    トピック編集
                </h2>
            }
        >
            <Head title="トピック編集" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <Paper className="p-6">
                        <Box className="mb-6 flex items-center justify-between">
                            <Typography variant="h5" component="h1">
                                トピック編集: {thread.title}
                            </Typography>
                            <Button
                                component={Link}
                                href={route('threads.show', thread.id)}
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                            >
                                詳細に戻る
                            </Button>
                        </Box>

                        <form onSubmit={submit}>
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

                                <FormControl fullWidth required error={!!errors.category_id}>
                                    <InputLabel>カテゴリ *</InputLabel>
                                    <Select
                                        value={data.category_id}
                                        label="カテゴリ *"
                                        onChange={(e) => setData('category_id', e.target.value)}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.category_id && (
                                        <Typography variant="caption" color="error" className="ml-4 mt-1">
                                            {errors.category_id}
                                        </Typography>
                                    )}
                                </FormControl>

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

                            <Box className="mt-8 flex justify-end gap-4">
                                <Button
                                    component={Link}
                                    href={route('threads.show', thread.id)}
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
                                    更新
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}