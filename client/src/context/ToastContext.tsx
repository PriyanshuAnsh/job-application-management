import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
    id: string;
    type: ToastType;
    message: string;
};

type ToastContextValue = {
    addToast: (type: ToastType, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be called inside <ToastProvider>");
    return ctx;
}

type ToastProviderProps = {
    children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(
        (type: ToastType, message: string) => {
            const id = Math.random().toString(36).slice(2);
            setToasts((prev) => [...prev, { id, type, message }]);
            setTimeout(() => remove(id), 3800);
        },
        [remove]
    );

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-stack" aria-live="polite" aria-atomic="false">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast toast--${toast.type}`}
                        role="status"
                    >
                        <span className="toast__icon">
                            {toast.type === "success" && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            {toast.type === "error" && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            )}
                            {toast.type === "info" && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            )}
                        </span>
                        <span className="toast__message">{toast.message}</span>
                        <button className="toast__close" onClick={() => remove(toast.id)} aria-label="Dismiss">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
