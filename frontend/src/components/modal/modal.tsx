import {
    forwardRef,
    type ReactElement,
    type ReactNode,
    type PropsWithChildren,
    type FormEvent
} from 'react';

import { Button } from '../button/button.tsx';

import './modal.css';

type ModalProps = PropsWithChildren<{
    title: string;
    onClose: () => void;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
    submitButtonText?: string;
    isSubmitLoading?: boolean;
    formId?: string;
    actions?: ReactNode;
}>;

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(({
    title,
    children,
    onClose,
    onSubmit,
    submitButtonText = 'Отправить',
    isSubmitLoading = false,
    formId = 'modal-form',
    actions
}, ref): ReactElement => {
    return (
        <dialog ref={ref} className="modal">
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
        </dialog>
    );
});

Modal.displayName = 'Modal';