export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-3 bg-rose-600 border border-transparent rounded-xl font-medium text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 ease-in-out hover:bg-rose-500 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}