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
                'border-border bg-surfaceHighlight text-gray-200 focus:border-indigo-500 focus:ring-indigo-500/50 rounded-xl shadow-sm transition-colors duration-200 placeholder-gray-600 ' +
                className
            }
            ref={localRef}
        />
    );
});