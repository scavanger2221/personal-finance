import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-border bg-background text-text-primary rounded-input px-3 py-2.5 transition-colors duration-200 placeholder:text-text-disabled focus:outline-none focus:border-text-secondary ' +
                className
            }
            ref={localRef}
        />
    );
});