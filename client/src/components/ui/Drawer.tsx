import { type ReactNode } from "react";

type DrawerProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
};

export function Drawer({ open, onClose, title, children }: DrawerProps) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`drawer-backdrop${open ? " drawer-backdrop--open" : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Panel */}
            <aside
                className={`drawer${open ? " drawer--open" : ""}`}
                aria-label={title}
                role="dialog"
                aria-modal="true"
            >
                <div className="drawer__header">
                    <h2 className="drawer__title">{title}</h2>
                    <button className="drawer__close" onClick={onClose} aria-label="Close drawer">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="drawer__body">{children}</div>
            </aside>
        </>
    );
}
