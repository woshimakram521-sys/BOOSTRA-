import React from 'react';
import { Shield, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/SEO';

export const TermsPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Terms of Service & Policy | BOOSTARA"
        description="Read BOOSTARA terms of service, payment policies, delivery commitments, and guarantees."
        keywords="BOOSTARA terms, cancellation policy, payment terms, service agreement"
        canonicalPath="/terms"
      />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl clay-badge text-[#1ac8ff] text-xs font-bold uppercase tracking-wider mb-4">
          <Shield className="w-4 h-4" />
          <span>Terms & Conditions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 drop-shadow-md">
          সার্ভিসের <span className="text-gradient">নিয়মাবলী ও পলিসি</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          BOOSTARA থেকে যেকোনো ডিজিটাল সার্ভিস বা প্যাকেজ অর্ডার করার পূর্বে অনুগ্রহ করে নিচের শর্তাবলী মনোযোগ দিয়ে পড়ুন।
        </p>
      </div>

      <div className="clay-card-elevated p-6 sm:p-10 rounded-3xl border border-white/[0.08] relative space-y-8">
        {/* MANDATORY Prompt Warning */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-sm leading-relaxed shadow-[inset_1px_1px_2px_rgba(245,158,11,0.2)]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300 text-base mb-1">
                ⚠️ সার্ভিস অর্ডার করার আগে ভালো করে দেখে নিন।
              </p>
              <p>
                অর্ডার কনফার্ম হওয়ার পর তা প্রসেস শুরু হয়ে যায়, তাই বাতিল/পরিবর্তন সম্ভব হয় না।
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Guest Checkout Policy */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg clay-badge text-[#1ac8ff] text-xs flex items-center justify-center font-bold">
              ১
            </span>
            <span>গেস্ট চেকআউট ও তথ্য নির্ভুলতা</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
            আমাদের প্ল্যাটফর্মে অর্ডার করতে কোনো রেজিস্ট্রেশন বা অ্যাকাউন্টের প্রয়োজন হয় না। আপনার দেওয়া লিঙ্ক এবং WhatsApp নাম্বারের ভিত্তিতেই অর্ডারটি পরিচালনা করা হয়। ভুল লিঙ্ক দিলে সিস্টেম স্বয়ংক্রিয়ভাবে কাজ ব্যর্থ করতে পারে, যার জন্য BOOSTARA কর্তৃপক্ষ দায়ী থাকবে না।
          </p>
        </div>

        {/* Section 2: Wrong Link / Platform */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg clay-badge text-[#1ac8ff] text-xs flex items-center justify-center font-bold">
              ২
            </span>
            <span>ভুল লিঙ্ক বা ভুল প্ল্যাটফর্ম নির্বাচন</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
            ফলোয়ার সার্ভিসের ক্ষেত্রে অবশ্যই প্রোফাইল লিঙ্ক এবং লাইক/কমেন্টের ক্ষেত্রে পোস্টের লিঙ্ক দিতে হবে। ফেসবুক পোস্টের লিঙ্ক ইনস্টাগ্রাম সার্ভিসে দিলে সেই অর্ডার প্রসেস করা সম্ভব হবে না এবং তা বাতিল হতে পারে।
          </p>
        </div>

        {/* Section 3: Delivery Times */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg clay-badge text-[#1ac8ff] text-xs flex items-center justify-center font-bold">
              ৩
            </span>
            <span>ডেলিভারি সময়সীমা</span>
          </h3>
          <ul className="text-xs sm:text-sm text-slate-300 space-y-2 pl-8">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1ac8ff]" />
              <span>SMM সার্ভিস: পেমেন্ট ভেরিফিকেশনের ১ থেকে ৪ ঘণ্টার মধ্যে সম্পন্ন হয়।</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1ac8ff]" />
              <span>অ্যাড বুস্ট সার্ভিস: ক্যাম্পেইন সেটআপ ও অ্যাপ্রুভালের পর ১ থেকে ২৪ ঘণ্টার মধ্যে রান হয়।</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1ac8ff]" />
              <span>ওয়েবসাইট বিল্ডিং: রিকোয়ারমেন্ট পাওয়ার পর ১ থেকে ১০ ঘণ্টার মধ্যে সম্পূর্ণ হয়।</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Cancellation & Refund */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg clay-badge text-[#1ac8ff] text-xs flex items-center justify-center font-bold">
              ৪
            </span>
            <span>বাতিলকরণ ও রিফান্ড নীতি</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
            একবার অর্ডার সাবমিট এবং সার্ভারে কাজ শুরু হয়ে গেলে তা বাতিলযোগ্য নয়। তবে যদি কোনো প্রযুক্তিগত সমস্যার কারণে নির্ধারিত সময়ের মধ্যে সার্ভিস শুরু না হয়, তবে কাস্টমার সাপোর্টের সাথে যোগাযোগ করে সমাধান বা সমপরিমাণ অন্য সার্ভিসে রূপান্তর করে নিতে পারবেন।
          </p>
        </div>

        {/* Section 5: Payment Policy */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg clay-badge text-[#1ac8ff] text-xs flex items-center justify-center font-bold">
              ৫
            </span>
            <span>পেমেন্ট ও ভেরিফিকেশন</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
            শুধুমাত্র আমাদের নির্ধারিত পার্সোনাল বিকাশ, নগদ বা রকেট নাম্বারে 'Send Money' গ্রহণযোগ্য। টাকা পাঠানোর পর সঠিক TrxID সাবমিট না করলে পেমেন্ট ভেরিফাই হবে না।
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            শর্তাবলী সম্পর্কে আরও জানতে আমাদের FAQ পেজ দেখুন।
          </span>
          <button
            onClick={() => navigate('/faq')}
            className="clay-btn-secondary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-xl"
          >
            <HelpCircle className="w-4 h-4 text-[#1ac8ff]" />
            <span>FAQ প্রশ্ন ও উত্তর পড়ুন →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
