'use client';

import { createContext, useContext, useRef } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

type OverlayContextState = {
  isOpen: boolean;
  open: (props: ModalProps) => void;
  close: () => void;
  hideAll: () => void;
  dialog: {
    open: (props: ModalProps) => void;
    close: () => void;
  };
  alert: {
    open: (props: AlertDialogProps) => void;
    close: () => void;
  };
};
type DialogSize =
  'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';

export interface ModalProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  size?: DialogSize;
  closeOnOverlayClick?: boolean;
}

const DIALOG_SIZE = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  full: 'sm:max-w-[90vw]',
} as const;

const Modal = NiceModal.create<ModalProps>(
  ({ children, title, description, size }) => {
    const modal = useModal();
    const dialogSizeClass = DIALOG_SIZE[size || 'md'];
    return (
      <Dialog
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) {
            modal.hide();
          }
        }}
      >
        <DialogContent
          className={cn(dialogSizeClass, 'max-h-[90vh] flex flex-col')}
          onAnimationEnd={() => {
            if (!modal.visible) modal.remove();
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

interface AlertDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const Alert = NiceModal.create<AlertDialogProps>(
  ({ title, description, confirmText, cancelText, onConfirm, onCancel }) => {
    const modal = useModal();
    return (
      <AlertDialog
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) {
            modal.hide();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (onCancel) onCancel();
                modal.hide();
              }}
            >
              {cancelText || 'ยกเลิก'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onConfirm();
                modal.hide();
              }}
            >
              {confirmText || 'ยืนยัน'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

let _overlayCounter = 0;

const OverlayContext = createContext<OverlayContextState | null>(null);

function Overlay({ children }: { children: React.ReactNode }) {
  const dialogStack = useRef<string[]>([]);
  const alertStack = useRef<string[]>([]);

  const open = ({
    title,
    description,
    children,
    size,
    closeOnOverlayClick,
  }: ModalProps): void => {
    _overlayCounter += 1;
    const id = `dialog-${_overlayCounter}`;

    NiceModal.register(id, Modal);
    NiceModal.show(id, {
      title,
      description,
      children,
      size,
      closeOnOverlayClick,
    });
    dialogStack.current.push(id);
  };

  const close = () => {
    const last = dialogStack.current.pop();
    if (last) NiceModal.hide(last);
  };

  const openAlert = ({
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
  }: AlertDialogProps): void => {
    _overlayCounter += 1;
    const id = `alert-${_overlayCounter}`;

    NiceModal.register(id, Alert);
    NiceModal.show(id, {
      title,
      description,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    });
    alertStack.current.push(id);
  };

  const closeAlert = () => {
    const last = alertStack.current.pop();
    if (last) NiceModal.hide(last);
  };

  return (
    <OverlayContext.Provider
      value={{
        isOpen: false,
        open,
        close,
        hideAll: () => {
          dialogStack.current.forEach((id) => NiceModal.hide(id));
          alertStack.current.forEach((id) => NiceModal.hide(id));
          dialogStack.current = [];
          alertStack.current = [];
        },
        dialog: {
          open,
          close,
        },
        alert: {
          open: openAlert,
          close: closeAlert,
        },
      }}
    >
      <NiceModal.Provider>{children}</NiceModal.Provider>
    </OverlayContext.Provider>
  );
}

export const OverlayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Overlay>{children}</Overlay>;
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};
