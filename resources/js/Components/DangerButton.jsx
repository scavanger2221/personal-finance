export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2.5 bg-transparent border border-danger rounded-button font-medium text-sm text-danger transition-colors duration-200 ease-standard hover:bg-danger/10 disabled:opacity-50 ${
                    disabled && 'cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}