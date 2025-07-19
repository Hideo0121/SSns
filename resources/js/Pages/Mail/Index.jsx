import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

export default function Index({ history, statistics, flash }) {
    const { auth } = usePage().props;
    const getStatusColor = (status) => {
        switch (status) {
            case 'sent':
                return 'success';
            case 'sending':
                return 'info';
            case 'failed':
            case 'partial_failed':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'draft':
                return '下書き';
            case 'sending':
                return '送信中';
            case 'sent':
                return '送信完了';
            case 'failed':
                return '送信失敗';
            case 'partial_failed':
                return '一部失敗';
            default:
                return '不明';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="メール配信管理" />
            
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
                        {auth.user.name}
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

                {/* Main Content */}
                <div style={{ padding: '24px' }}>
                    {/* Back to Staff List Button */}
                    <div style={{ marginBottom: '24px' }}>
                        <Link
                            href={route('staff.index')}
                            style={{
                                background: '#6c757d',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <ArrowBackIcon style={{ fontSize: '18px' }} />
                            スタッフ一覧に戻る
                        </Link>
                    </div>

                    {flash?.success && (
                        <div style={{
                            background: '#e8f5e8',
                            color: '#2e7d32',
                            padding: '12px 16px',
                            borderRadius: '4px',
                            marginBottom: '24px',
                            border: '1px solid #c8e6c9'
                        }}>
                            ✅ {flash.success}
                        </div>
                    )}

                    <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        marginBottom: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '500',
                                margin: 0,
                                color: '#333'
                            }}>
                                メール配信履歴
                            </h2>
                            <Link
                                href={route('mail.create')}
                                style={{
                                    background: '#4caf50',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '4px',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                ➕ 新規メール送信
                            </Link>
                        </div>

                    {/* 統計カード */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                        gap: '16px', 
                        marginBottom: '24px' 
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📧</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1976d2', marginBottom: '4px' }}>
                                {statistics.total_messages}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>総送信数</div>
                        </div>

                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50', marginBottom: '4px' }}>
                                {statistics.sent_messages}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>送信成功</div>
                        </div>

                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>❌</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f44336', marginBottom: '4px' }}>
                                {statistics.failed_messages}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>送信失敗</div>
                        </div>

                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196f3', marginBottom: '4px' }}>
                                {statistics.success_rate}%
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>成功率</div>
                        </div>
                    </div>

                    {/* メール送信履歴テーブル */}
                    <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        {history.data.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f5f5f5' }}>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', borderBottom: '1px solid #ddd' }}>送信日時</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', borderBottom: '1px solid #ddd' }}>件名</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', borderBottom: '1px solid #ddd' }}>送信者</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', borderBottom: '1px solid #ddd' }}>対象者数</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', borderBottom: '1px solid #ddd' }}>ステータス</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #ddd' }}>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.data.map((mail) => (
                                        <tr key={mail.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '16px' }}>
                                                {mail.sent_at ? formatDate(mail.sent_at) : formatDate(mail.created_at)}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                                    {mail.subject}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {mail.body.length > 50 
                                                        ? mail.body.substring(0, 50) + '...'
                                                        : mail.body
                                                    }
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                {mail.admin ? mail.admin.name : '不明'}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                {mail.targets ? mail.targets.length : 0}名
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: getStatusColor(mail.status) === 'success' ? '#e8f5e8' :
                                                                    getStatusColor(mail.status) === 'error' ? '#ffeaea' :
                                                                    getStatusColor(mail.status) === 'info' ? '#e3f2fd' : '#f5f5f5',
                                                    color: getStatusColor(mail.status) === 'success' ? '#2e7d32' :
                                                           getStatusColor(mail.status) === 'error' ? '#d32f2f' :
                                                           getStatusColor(mail.status) === 'info' ? '#1976d2' : '#666'
                                                }}>
                                                    {getStatusLabel(mail.status)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <Link
                                                    href={route('mail.show', mail.id)}
                                                    style={{
                                                        background: '#1976d2',
                                                        color: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: '4px',
                                                        textDecoration: 'none',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    👁️ 詳細
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                                <h3 style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
                                    まだメール送信履歴がありません
                                </h3>
                                <p style={{ color: '#666', marginBottom: '24px' }}>
                                    右上の「新規メール送信」ボタンから最初のメールを送信してみましょう
                                </p>
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}