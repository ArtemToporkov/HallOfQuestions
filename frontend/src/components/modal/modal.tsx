import type { ReactElement, ReactNode, FormEvent, PropsWithChildren } from 'react';
import { Button } from '../button/button.tsx';
import './modal.css';

type ModalProps = PropsWithChildren<{
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
    submitButtonText?: string;
    isSubmitLoading?: boolean;
    formId?: string;
    actions?: ReactNode;
}>;

export function Modal({
                          isOpen,
                          title,
                          children,
                          onClose,
                          onSubmit,
                          submitButtonText = 'Отправить',
                          isSubmitLoading = false,
                          formId = 'modal-form',
                          actions
                      }: ModalProps): ReactElement | null {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <span className="modal__header">{title}</span>

                <form onSubmit={onSubmit} className="modal__form" id={formId}>
                    {children}
                </form>

                <div className="modal__actions">
                    <button className="modal__close-button" type="button" onClick={onClose}>
                        Отмена
                    </button>
                    {actions ? actions : (
                        <Button
                            className="modal__close-button"
                            type="submit"
                            form={formId}
                            isLoading={isSubmitLoading}
                        >
                            {submitButtonText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}