export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2.5 bg-accent border border-transparent rounded-button font-medium text-sm text-background transition-colors duration-200 ease-standard hover:bg-accent-hover hover:text-background active:bg-[#D4D4D4] focus:outline-none focus:border-border-strong ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
