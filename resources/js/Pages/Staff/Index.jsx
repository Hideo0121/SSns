import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StaffSystemLayout from '@/Layouts/StaffSystemLayout';
import Toast from '@/Components/Toast';
import ConfirmDialog from '@/Components/ConfirmDialog';

export default function Index({ staff, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
    const [selectedStaff, setSelectedStaff] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/staff', { search, role }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setRole('');
        router.get('/staff');
    };

    const handleDelete = (staffMember) => {
        setConfirmDialog({
            open: true,
            title: 'スタッフ削除確認',
            message: `${staffMember.name}さんを削除してよろしいですか？\nこの操作は取り消せません。`,
            onConfirm: () => confirmDelete(staffMember.id)
        });
    };

    const confirmDelete = (staffId) => {
        router.delete(route('staff.destroy', staffId), {
            onSuccess: () => {
                setToast({
                    open: true,
                    message: 'スタッフを削除しました',
                    severity: 'success'
                });
                setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
            },
            onError: () => {
                setToast({
                    open: true,
                    message: '削除に失敗しました',
                    severity: 'error'
                });
                setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
            }
        });
    };

    const handleStaffSelect = (staffId) => {
        setSelectedStaff(prev => {
            if (prev.includes(staffId)) {
                return prev.filter(id => id !== staffId);
            } else {
                return [...prev, staffId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedStaff.length === staff.data.length) {
            setSelectedStaff([]);
        } else {
            setSelectedStaff(staff.data.map(member => member.id));
        }
    };

    const handleMailToSelected = () => {
        if (selectedStaff.length === 0) {
            setToast({
                open: true,
                message: 'メール送信対象のスタッフを選択してください',
                severity: 'warning'
            });
            return;
        }
        
        // 選択されたスタッフIDを含めてメール作成画面へ遷移
        const selectedStaffIds = selectedStaff.join(',');
        router.get(route('mail.create', { staff_ids: selectedStaffIds }));
    };

    return (
        <StaffSystemLayout title="スタッフ一覧 - スタッフ管理システム">
            <div style={{ padding: '24px' }}>
                {/* Search and Filter Section */}
                <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        marginBottom: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            margin: '0 0 16px 0',
                            color: '#333'
                        }}>
                            スタッフ検索
                        </h2>
                        
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'end' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333'
                                }}>
                                    検索キーワード
                                </label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="名前、ユーザーコード、メールアドレス"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            
                            <div style={{ minWidth: '150px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333'
                                }}>
                                    権限
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="">すべて</option>
                                    <option value="admin">管理者</option>
                                    <option value="staff">一般</option>
                                </select>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    type="submit"
                                    style={{
                                        background: '#1976d2',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    検索
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    style={{
                                        background: '#666',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 16px',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    リセット
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                    }}>
                        <h1 style={{
                            fontSize: '24px',
                            fontWeight: '500',
                            margin: '0',
                            color: '#333'
                        }}>
                            スタッフ一覧 ({staff.total}件)
                        </h1>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link
                                href={route('staff.create')}
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
                                ➕ 新規登録
                            </Link>
                            <Link
                                href={route('threads.index')}
                                style={{
                                    background: '#2196f3',
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
                                📝 掲示板
                            </Link>
                            <button
                                onClick={handleMailToSelected}
                                disabled={selectedStaff.length === 0}
                                style={{
                                    background: selectedStaff.length > 0 ? '#ff9800' : '#ccc',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: selectedStaff.length > 0 ? 'pointer' : 'not-allowed'
                                }}
                            >
                                ✉️ 選択したスタッフにメール送信 ({selectedStaff.length})
                            </button>
                        </div>
                    </div>

                    {/* Staff Table */}
                    <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5' }}>
                                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #ddd', width: '50px' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedStaff.length === staff.data.length && staff.data.length > 0}
                                            onChange={handleSelectAll}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', borderBottom: '1px solid #ddd' }}>名前</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', borderBottom: '1px solid #ddd' }}>ユーザーコード</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', borderBottom: '1px solid #ddd' }}>メールアドレス</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '500', borderBottom: '1px solid #ddd' }}>権限</th>
                                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #ddd' }}>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.data.map((member, index) => (
                                    <tr key={member.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedStaff.includes(member.id)}
                                                onChange={() => handleStaffSelect(member.id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: '#e3f2fd',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '12px',
                                                    fontWeight: 'bold',
                                                    color: '#1976d2'
                                                }}>
                                                    {member.name.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: '500' }}>{member.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#666' }}>{member.user_code}</td>
                                        <td style={{ padding: '16px', color: '#666' }}>{member.email}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                background: member.role === 'admin' ? '#e8f5e8' : '#f3f4f6',
                                                color: member.role === 'admin' ? '#2e7d32' : '#374151',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {member.role === 'admin' ? '管理者' : '一般'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <Link
                                                href={route('staff.show', member.id)}
                                                style={{
                                                    background: '#1976d2',
                                                    color: 'white',
                                                    padding: '6px 12px',
                                                    borderRadius: '4px',
                                                    textDecoration: 'none',
                                                    fontSize: '12px',
                                                    marginRight: '8px'
                                                }}
                                            >
                                                詳細
                                            </Link>
                                            <Link
                                                href={route('staff.edit', member.id)}
                                                style={{
                                                    background: '#666',
                                                    color: 'white',
                                                    padding: '6px 12px',
                                                    borderRadius: '4px',
                                                    textDecoration: 'none',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                編集
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(member)}
                                                style={{
                                                    background: '#d32f2f',
                                                    color: 'white',
                                                    padding: '6px 12px',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                    marginLeft: '8px'
                                                }}
                                            >
                                                削除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {staff.links && staff.links.length > 3 && (
                            <div style={{ padding: '16px', background: '#f9f9f9', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                {staff.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        style={{
                                            padding: '8px 12px',
                                            background: link.active ? '#1976d2' : 'white',
                                            color: link.active ? 'white' : '#666',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                            fontSize: '14px'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            <Toast 
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={() => setToast({ ...toast, open: false })}
            />
            
            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })}
                severity="error"
            />
        </StaffSystemLayout>
    );
}
