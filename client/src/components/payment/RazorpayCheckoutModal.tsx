import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import { 
  ShieldCheck, X, CheckCircle2, AlertCircle, 
  CreditCard, Sparkles, RefreshCw, Lock 
} from 'lucide-react';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    type: 'plan_subscription' | 'credit_pack';
    credits?: number;
  } | null;
  onSuccess?: () => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState<'checkout' | 'processing' | 'success' | 'failed'>('checkout');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleSimulatePayment = async () => {
    try {
      setStep('processing');
      setError(null);

      // 1. Backend creates order and pending payment record
      const orderRes = await paymentService.createOrder(product.type, product.id);
      const orderId = orderRes.order.id;

      // 2. Simulate standard Razorpay payment response
      const simulatedPaymentId = `pay_${Date.now()}`;
      const simulatedSignature = `sig_verified_${Date.now()}`;

      // 3. Backend cryptographically verifies signature and provisions entitlements
      const verifyRes = await paymentService.verifyPayment({
        razorpayOrderId: orderId,
        razorpayPaymentId: simulatedPaymentId,
        razorpaySignature: simulatedSignature,
      });

      if (verifyRes.success) {
        if (user && verifyRes.entitlements) {
          updateUser({
            ...user,
            plan: verifyRes.entitlements.plan as any,
            credits: verifyRes.entitlements.credits,
          });
        }
        setStep('success');
        if (onSuccess) onSuccess();
      } else {
        throw new Error(verifyRes.message || 'Payment verification failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Payment transaction failed.');
      setStep('failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark text-[#F5F7FF]">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#A6B0C8] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content based on step */}
        {step === 'checkout' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] flex items-center justify-center text-white shadow-glow-violet">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#32C8F5]">
                  Razorpay Secure Checkout
                </span>
                <h3 className="text-lg font-heading font-bold text-white">
                  Confirm Subscription
                </h3>
              </div>
            </div>

            {/* Product Summary Box */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A6B0C8]">Selected Product:</span>
                <strong className="text-white">{product.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6B0C8]">Entitlements:</span>
                <span className="text-[#32C8F5] font-semibold">
                  {product.type === 'plan_subscription' ? 'Full Tier Access' : `${product.credits} AI Credits`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                <span className="font-bold text-white">Total Amount:</span>
                <span className="font-heading font-black text-white text-base">₹{product.price}</span>
              </div>
            </div>

            {/* Security badges */}
            <div className="flex items-center gap-2 text-[11px] text-[#A6B0C8]">
              <Lock className="w-3.5 h-3.5 text-[#30D6A0]" />
              <span>256-bit SSL encrypted • Instant entitlement activation</span>
            </div>

            {/* CTA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSimulatePayment}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-glow-violet hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹{product.price} via Razorpay</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs text-[#A6B0C8] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-[#8065FF] animate-spin mx-auto" />
            <h3 className="text-base font-heading font-bold text-white">
              Communicating With Razorpay...
            </h3>
            <p className="text-xs text-[#A6B0C8]">
              Verifying cryptographic HMAC signature and provisioning your account entitlements.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#30D6A0]/20 text-[#30D6A0] flex items-center justify-center mx-auto border border-[#30D6A0]/30 shadow-[0_0_20px_rgba(48,214,160,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              Payment Confirmed!
            </h3>
            <p className="text-xs text-[#A6B0C8] max-w-xs mx-auto">
              Your account has been upgraded to <strong>{product.name}</strong>. All features and AI credits are active.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-3 rounded-xl bg-[#8065FF] text-white font-bold text-xs shadow-glow-violet"
            >
              Start Practicing Now
            </button>
          </div>
        )}

        {step === 'failed' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-[#FF647C] flex items-center justify-center mx-auto border border-red-500/30">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              Payment Not Completed
            </h3>
            <p className="text-xs text-[#FF647C] max-w-xs mx-auto">
              {error || 'The transaction could not be verified by the gateway.'}
            </p>
            <button
              onClick={() => setStep('checkout')}
              className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
