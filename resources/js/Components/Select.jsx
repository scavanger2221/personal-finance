import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Select({ value, onChange, options, placeholder = "Pilih opsi...", className }) {
    const selectedOption = options.find((opt) => opt.value === value) || null;

    return (
        <Listbox value={value} onChange={onChange}>
            {({ open }) => (
                <div className={cn("relative mt-1", className)}>
                    <Listbox.Button className="relative w-full cursor-pointer rounded-input border border-border bg-background py-2.5 pl-3 pr-10 text-left text-text-primary transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-border-strong sm:text-sm">
                        <span className={cn("block truncate", !selectedOption && "text-gray-500")}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown
                                className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", open && "rotate-180")}
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-card bg-surface border border-border py-1 text-base focus:outline-none sm:text-sm">
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.value}
                                    className={({ active }) =>
                                        cn(
                                            'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-200',
                                            active ? 'bg-surface-elevated text-text-primary' : 'text-text-secondary'
                                        )
                                    }
                                    value={option.value}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={cn('block truncate', selected ? 'font-medium text-text-primary' : 'font-normal')}>
                                                {option.label}
                                            </span>

                                            {selected ? (
                                                <span
                                                    className={cn(
                                                        'absolute inset-y-0 left-0 flex items-center pl-3',
                                                        active ? 'text-text-primary' : 'text-accent'
                                                    )}
                                                >
                                                    <Check className="h-4 w-4" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
}
