import { Head } from '@inertiajs/react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';

export default function Test({ debugMessage, availableUsers, filters, selectedStaffIds }) {
    return (
        <>
            <Head title="メールテスト" />
            <StaffSystemLayout title="メールテスト">
                <div style={{ padding: '24px' }}>
                    <div style={{ 
                        maxWidth: '800px',
                        margin: '0 auto',
                        background: 'white',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h1 style={{ 
                            fontSize: '24px', 
                            fontWeight: 'bold', 
                            marginBottom: '16px',
                            color: '#333'
                        }}>
                            メールテストページ
                        </h1>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#666' }}>
                                デバッグ情報
                            </h2>
                            <p style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                                {debugMessage || 'デバッグメッセージがありません'}
                            </p>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#666' }}>
                                利用可能ユーザー数
                            </h2>
                            <p style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                                {availableUsers ? availableUsers.length : 0} 名
                            </p>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#666' }}>
                                選択されたスタッフID
                            </h2>
                            <p style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                                {selectedStaffIds ? selectedStaffIds.join(', ') : 'なし'}
                            </p>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <a 
                                href="/staff" 
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 24px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '500'
                                }}
                            >
                                スタッフ一覧に戻る
                            </a>
                        </div>
                    </div>
                </div>
            </StaffSystemLayout>
        </>
    );
}
