'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { approveArtwork } from '@/actions/admin-actions';
import { getAdminData, updateUserRole } from '@/actions/admin-data-actions';

export default function AdminDashboard() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'validation' | 'users' | 'logs'>('validation');
    const [pendingArtworks, setPendingArtworks] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Role Editing State
    const [editingUser, setEditingUser] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/');
            return;
        }
        if (isLoaded && user) fetchData();
    }, [isLoaded, user, activeTab]);

    async function fetchData() {
        setLoading(true);
        const { data, error } = await getAdminData(activeTab);
        if (error) {
            console.error(error);
            // Optional: alert('Error loading data: ' + error);
        } else {
            if (activeTab === 'validation') setPendingArtworks(data || []);
            if (activeTab === 'users') setUsers(data || []);
            if (activeTab === 'logs') setLogs(data || []);
        }
        setLoading(false);
    }

    async function handleApproval(id: string, approved: boolean) {
        const result = await approveArtwork(id, approved);
        if (result.success) {
            setPendingArtworks(prev => prev.filter(a => a.id !== id));
        } else {
            alert('Error: ' + result.error);
        }
    }

    async function handleRoleUpdate(userId: string, newRole: string) {
        const result = await updateUserRole(userId, newRole as any);
        if (result.success) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setEditingUser(null);
            alert('Role updated successfully.');
        } else {
            alert('Error updating role: ' + result.error);
        }
    }

    return (
        <>
            <Header />
            <main className="bg-background min-h-screen pt-32 pb-24">
                <div className="max-w-[1800px] mx-auto px-6 sm:px-12">
                    <h1 className="text-4xl font-heading mb-8">Admin Dashboard</h1>

                    <div className="flex gap-8 border-b border-border mb-8">
                        {['validation', 'users', 'logs'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 text-sm font-bold tracking-[0.2em] uppercase transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-primary'
                                    }`}
                            >
                                {tab === 'validation' ? 'Validations' : tab === 'users' ? 'Utilisateurs' : 'Logs'}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">Chargement...</div>
                    ) : (
                        <div className="space-y-8">
                            {activeTab === 'validation' && (
                                <div className="grid gap-6">
                                    {pendingArtworks.length === 0 ? <p>Aucune œuvre en attente.</p> : pendingArtworks.map(work => (
                                        <div key={work.id} className="border p-6 flex justify-between items-center rounded bg-card">
                                            <div className="flex gap-4">
                                                <div className="w-24 h-24 bg-muted rounded overflow-hidden">
                                                    {work.image_url ? <img src={work.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">No Img</div>}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">{work.title}</h3>
                                                    <p className="text-sm text-muted-foreground">Artiste: {work.profiles?.username || work.artist || 'Unknown'}</p>
                                                    <p className="text-sm">{work.price} €</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => handleApproval(work.id, true)} className="px-6 py-2 bg-green-600 text-white text-xs font-bold uppercase rounded hover:bg-green-700">Approuver</button>
                                                <button onClick={() => handleApproval(work.id, false)} className="px-6 py-2 bg-red-600 text-white text-xs font-bold uppercase rounded hover:bg-red-700">Rejeter</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="pb-4">User</th>
                                                <th className="pb-4">Role</th>
                                                <th className="pb-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u.id} className="border-b border-border/50">
                                                    <td className="py-4">
                                                        <div className="font-bold">{u.username || u.full_name || 'No Name'}</div>
                                                        <div className="text-xs text-muted-foreground">{u.email}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        {editingUser === u.id ? (
                                                            <select
                                                                className="bg-background border p-1 rounded text-sm"
                                                                defaultValue={u.role}
                                                                onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="artist">Artist</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        ) : (
                                                            <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${u.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                                    u.role === 'artist' ? 'bg-purple-100 text-purple-800' :
                                                                        'bg-secondary/10 text-secondary'
                                                                }`}>{u.role}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4">
                                                        {editingUser === u.id ? (
                                                            <button onClick={() => setEditingUser(null)} className="text-xs text-red-500 hover:underline">Annuler</button>
                                                        ) : (
                                                            <button onClick={() => setEditingUser(u.id)} className="text-xs text-primary underline">Éditer le Rôle</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'logs' && (
                                <div className="bg-muted/10 p-4 rounded text-sm font-mono h-96 overflow-y-auto">
                                    {logs.map(log => (
                                        <div key={log.id} className="mb-2 border-b border-border/10 pb-2">
                                            <span className="text-muted-foreground mx-2">[{new Date(log.timestamp).toLocaleString()}]</span>
                                            <span className="font-bold mx-2">{log.action}</span>
                                            <span className="text-xs opacity-70 break-all">{JSON.stringify(log.details)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
