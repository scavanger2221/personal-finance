import {
    Dialog,
    DialogPanel,
} from '@headlessui/react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    if (!show) {
        return null;
    }

    return (
        <Dialog
            as="div"
            id="modal"
            className="fixed inset-0 z-50 flex items-center overflow-y-auto px-4 py-6 sm:px-0"
            onClose={close}
            open={show}
        >
            <div className="fixed inset-0 bg-black/80" onClick={close} />

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <DialogPanel
                        className={`relative transform overflow-hidden rounded-card bg-surface border border-border text-left shadow-2xl sm:mx-auto sm:w-full ${maxWidthClass}`}
                    >
                        {children}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}