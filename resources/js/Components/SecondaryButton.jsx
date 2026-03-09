export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center px-4 py-2.5 bg-transparent border border-border-strong rounded-button font-medium text-sm text-text-secondary transition-colors duration-200 ease-standard hover:border-border hover:text-text-primary disabled:opacity-50 ${
                    disabled && 'cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
