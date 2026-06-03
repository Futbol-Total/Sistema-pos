import { useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  total: number;
  subtotal: number;
  tax: number;
  onConfirm: () => void;
  onClose: () => void;
  isProcessing: boolean;
}

export default function CheckoutModal({
  isOpen,
  total,
  subtotal,
  tax,
  onConfirm,
  onClose,
  isProcessing,
}: CheckoutModalProps) {
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="card p-8 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">Pago Completado</h3>
          <p className="text-neutral-500 mb-6">La cuenta ha sido cerrada exitosamente.</p>
          <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-600">Total:</span>
              <span className="font-bold text-neutral-900">${Math.round(total).toLocaleString('es-CO')}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setSuccess(false);
              onClose();
              window.location.reload();
            }}
            className="btn-primary w-full justify-center"
          >
            Nueva Orden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card p-8 max-w-md w-full animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold text-neutral-900">Confirmar Pago</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-brand-50 rounded-xl p-4 mb-6 border border-brand-200">
          <div className="text-sm text-brand-600 mb-2">Total a Pagar</div>
          <div className="text-4xl font-bold text-brand-600 mb-3">
            ${Math.round(total).toLocaleString('es-CO')}
          </div>
          <div className="space-y-1 text-xs text-brand-600/80">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${Math.round(subtotal).toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuesto:</span>
              <span>${Math.round(tax).toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-warning-50 rounded-lg p-3 mb-6 border border-warning-200">
          <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-warning-700">
            Confirma que el cliente ha realizado el pago antes de cerrar la cuenta.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 btn-secondary py-3 justify-center disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              setSuccess(true);
            }}
            disabled={isProcessing}
            className="flex-1 btn-primary py-3 justify-center disabled:opacity-50"
          >
            {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
          </button>
        </div>
      </div>
    </div>
  );
}
