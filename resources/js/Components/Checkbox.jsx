export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-border bg-surface text-accent focus:ring-0 focus:ring-offset-0 ' +
                className
            }
        />
    );
}
