import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';

export default function StaffSystemLayout({ 
    title, 
    children, 
    navigationBar = null, 
    showBackButton = false, 
    backRoute = 'staff.index', 
    backLabel = 'スタッフ一覧に戻る' 
}) {
    const { auth } = usePage().props;
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = () => {
        setShowLogoutConfirm(false);
        // フォームを作成してPOSTでログアウト
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('logout');
        
        // CSRFトークンを追加
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }
        
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <Head title={title} />
            
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
                        {auth.user?.name}
                        <button
                            onClick={handleLogoutClick}
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
                        </button>
                    </div>
                </div>

                {/* Navigation Bar (if provided) */}
                {navigationBar}

                {/* Content */}
                {children}

                {/* ログアウト確認ダイアログ */}
                <ConfirmDialog
                    open={showLogoutConfirm}
                    title="ログアウト確認"
                    message="本当にログアウトしますか？"
                    confirmText="ログアウト"
                    cancelText="キャンセル"
                    severity="logout"
                    onConfirm={handleLogoutConfirm}
                    onCancel={() => setShowLogoutConfirm(false)}
                />
            </div>
        </>
    );
}
