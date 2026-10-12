import React from 'react';
import { CheckCircle2, MessageCircle, ArrowRight, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PaymentModalProps {
  isOpen: boolean;
  orderId: string;
  serviceType: string;
  amount: number;
  customerWhatsapp: string;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  orderId,
  serviceType,
  amount,
  customerWhatsapp,
  onClose,
}) => {
  const { settings, navigate } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrackOrder = () => {
    onClose();
    navigate(`/track-order?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(customerWhatsapp)}`);
  };

  const adminPhone = settings.whatsapp || '01813078583';
  const cleanNumber = adminPhone.startsWith('0') ? `88${adminPhone}` : adminPhone;
  const whatsappText = encodeURIComponent(
    `হ্যালো BOOSTARA, আমি পেমেন্ট সম্পন্ন করেছি!\n\n` +
    `• Order ID: ${orderId}\n` +
    `• Service: ${serviceType}\n` +
    `• Amount: ৳${amount}\n` +
    `• My WhatsApp: ${customerWhatsapp}\n\n` +
    `অনুগ্রহ করে যাচাই করে কাজটি শুরু করুন। ধন্যবাদ!`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${whatsappText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl clay-card-elevated border border-white/[0.1] text-center shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        {/* Glow orb */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 bg-gradient-to-r from-[#8b3dff] to-[#1ac8ff] rounded-full blur-3xl opacity-35 pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400 mb-5 shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.25),0_6px_16px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 drop-shadow-sm">
          পেমেন্ট সাবমিশন সফল হয়েছে!
        </h3>

        <div className="p-4 sm:p-5 rounded-2xl clay-card border border-white/[0.06] mb-5 text-sm sm:text-base leading-relaxed text-[#eef4ff]/90">
          ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আপনার অর্ডার আইডি:{' '}
          <span className="font-mono font-bold text-[#1ac8ff] text-base sm:text-lg block my-2 selection:bg-[#8b3dff]">
            #{orderId}
          </span>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            ট্র্যাকিং করার জন্য এই আইডি এবং আপনার ফোন নাম্বারটি সংরক্ষণ করুন।
          </p>

          <button
            onClick={handleCopyOrderId}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-xl clay-btn-secondary transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>আইডি কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Order ID কপি করুন</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleTrackOrder}
            className="w-full sm:w-1/2 py-3.5 px-5 clay-btn-primary flex items-center justify-center gap-2 text-sm cursor-pointer rounded-2xl min-h-[46px]"
          >
            <span>Track Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-1/2 py-3.5 px-5 clay-btn-emerald flex items-center justify-center gap-2 text-sm cursor-pointer rounded-2xl min-h-[46px]"
          >
            <MessageCircle className="w-4 h-4 fill-white/10" />
            <span>WhatsApp আপডেট</span>
          </a>
        </div>
      </div>
    </div>
  );
};
