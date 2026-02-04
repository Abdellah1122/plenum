'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { Bell } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    created_at: string;
    link?: string;
};

type NotificationContextType = {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Setup realtime subscription
            const channel = supabase
                .channel('notifications_channel')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        setNotifications((prev) => [payload.new as Notification, ...prev]);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);

    async function fetchNotifications() {
        if (!user) return;
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id) // Ensure this matches how user IDs are stored (text vs uuid)
            .order('created_at', { ascending: false })
            .limit(20);

        if (data) setNotifications(data);
    }

    async function markAsRead(id: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        if (!error) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        }
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, refresh: fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export function NotificationBell() {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="relative p-2 text-foreground/80 hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-card border border-border" align="end">
                <div className="p-4 border-b border-border bg-muted/50">
                    <h4 className="font-bold text-sm tracking-wide uppercase">Notifications</h4>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm italic">
                            No notifications yet
                        </div>
                    ) : (
                        <div>
                            {notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                                    onClick={() => markAsRead(n.id)}
                                >
                                    <h5 className={`text-sm ${!n.read ? 'font-bold' : 'font-medium'} mb-1`}>{n.title}</h5>
                                    <p className="text-xs text-muted-foreground">{n.message}</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-2 text-right">
                                        {new Date(n.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
