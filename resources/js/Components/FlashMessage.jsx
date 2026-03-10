import { CheckCircle, XCircle } from 'lucide-react';

export default function FlashMessage({ message, type = 'success', className = '' }) {
    if (!message) return null;

    const styles = {
        success: 'border-success/20 bg-success/5 text-success',
        error: 'border-danger/20 bg-danger/5 text-danger',
    };

    const icons = {
        success: CheckCircle,
        error: XCircle,
    };

    const Icon = icons[type];

    return (
        <div className={`mb-4 rounded-card border ${styles[type]} px-4 py-3 ${className}`}>
            <div className="flex items-center gap-2 text-sm">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{message}</span>
            </div>
        </div>
    );
}
