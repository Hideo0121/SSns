import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_code: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="ログイン - スタッフ管理システム" />
            
            <div style={{ 
                margin: 0,
                fontFamily: "'Roboto', sans-serif",
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                minHeight: '100vh'
            }}>
                {/* Header */}
                <div style={{
                    background: 'transparent',
                    padding: '16px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
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
                    <div style={{ fontSize: '20px', fontWeight: '500' }}>
                        スタッフ管理システム
                    </div>
                </div>

                {/* Main Container */}
                <div style={{
                    paddingTop: '10vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '48px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        maxWidth: '400px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '32px'
                        }}>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: '300',
                                margin: '0 0 8px 0',
                                color: '#333'
                            }}>
                                ログイン
                            </h1>
                            <p style={{
                                color: '#666',
                                margin: '0',
                                fontSize: '12px'
                            }}>
                                ユーザーコードとパスワードを入力してください
                            </p>
                        </div>

                        {status && (
                            <div style={{
                                marginBottom: '16px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#4caf50'
                            }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '24px' }}>
                                <InputLabel 
                                    htmlFor="user_code" 
                                    value="ユーザーコード" 
                                    style={{
                                        color: '#333',
                                        fontWeight: '500',
                                        marginBottom: '8px',
                                        display: 'block'
                                    }}
                                />

                                <TextInput
                                    id="user_code"
                                    type="text"
                                    name="user_code"
                                    value={data.user_code}
                                    className="mt-1 block w-full"
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('user_code', e.target.value)}
                                />

                                <InputError message={errors.user_code} className="mt-2" />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <InputLabel 
                                    htmlFor="password" 
                                    value="パスワード" 
                                    style={{
                                        color: '#333',
                                        fontWeight: '500',
                                        marginBottom: '8px',
                                        display: 'block'
                                    }}
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span style={{
                                        marginLeft: '8px',
                                        fontSize: '14px',
                                        color: '#666'
                                    }}>
                                        ログイン情報を記憶する
                                    </span>
                                </label>
                            </div>

                            <PrimaryButton 
                                className="w-full"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                                    color: 'white',
                                    padding: '16px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textAlign: 'center',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                disabled={processing}
                            >
                                {processing ? 'ログイン中...' : 'ログイン'}
                            </PrimaryButton>

                            {canResetPassword && (
                                <div style={{ textAlign: 'center' }}>
                                    <Link
                                        href={route('password.request')}
                                        style={{
                                            color: '#1976d2',
                                            textDecoration: 'none',
                                            fontSize: '14px'
                                        }}
                                    >
                                        パスワードをお忘れですか？
                                    </Link>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
