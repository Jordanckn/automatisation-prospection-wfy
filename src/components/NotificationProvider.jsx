import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

let addNotification = null;

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    addNotification = (notification) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { ...notification, id }]);

        // Auto-remove after duration
        setTimeout(() => {
            removeNotification(id);
        }, notification.duration || 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <>
            {children}
            <div className="notifications-container">
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        {...notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </>
    );
};

const Notification = ({ type, title, message, onClose }) => {
    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        warning: <AlertCircle size={20} />,
        info: <Info size={20} />
    };

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    return (
        <div className={`notification notification-${type}`} style={{ borderLeftColor: colors[type] }}>
            <div className="notification-icon" style={{ color: colors[type] }}>
                {icons[type]}
            </div>
            <div className="notification-content">
                {title && <div className="notification-title">{title}</div>}
                <div className="notification-message">{message}</div>
            </div>
            <button onClick={onClose} className="notification-close">
                <X size={16} />
            </button>
        </div>
    );
};

// Export helper functions
export const notify = {
    success: (message, title = 'Succès') => {
        addNotification({ type: 'success', title, message });
    },
    error: (message, title = 'Erreur') => {
        addNotification({ type: 'error', title, message });
    },
    warning: (message, title = 'Attention') => {
        addNotification({ type: 'warning', title, message });
    },
    info: (message, title = 'Information') => {
        addNotification({ type: 'info', title, message });
    },
    custom: (notification) => {
        addNotification(notification);
    }
};

export default NotificationProvider;
