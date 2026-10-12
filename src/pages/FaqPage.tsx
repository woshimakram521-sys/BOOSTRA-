import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/SEO';

export const FaqPage: React.FC = () => {
  const { settings, navigate } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '১. SMM সার্ভিস অর্ডার করার পর কতক্ষণে সম্পন্ন হবে?',
      a: 'অর্ডারের পেমেন্ট ভেরিফাই হওয়ার পর সাধারণত ১ থেকে ৪ ঘণ্টার মধ্যে স্বয়ংক্রিয়ভাবে ডেলিভারি সম্পন্ন হয়। কিছু বৃহৎ পরিমাণের অর্ডারের ক্ষেত্রে সোশ্যাল মিডিয়ার অ্যালগরিদম সুরক্ষার স্বার্থে ধীরে ধীরে সম্পন্ন হতে পারে।',
    },
    {
      q: '২. Ads Boost ক্যাম্পেইন কখন শুরু হয়?',
      a: 'অ্যাড ক্যাম্পেইন রিকোয়ারমেন্ট ও ড্রাইভ মিডিয়া লিংক রিভিউ করে ১ থেকে ২৪ ঘণ্টার মধ্যে অফিসিয়াল মেটা/টিকটক অ্যাডস ম্যানেজারে সাবমিট করা হয় এবং প্ল্যাটফর্ম রিভিউ শেষে লাইভ শুরু হয়।',
    },
    {
      q: '৩. Website Building প্যাকেজের ডেলিভারি কত সময় নেয়?',
      a: 'আমরা বানিয়ে দেব প্যাকেজের ডেলিভারি সময় ১ থেকে ১০ ঘণ্টা। আর "নিজে শিখুন" ভিডিও কোর্সের লিংক পেমেন্ট কনফার্ম হওয়ার সাথে সাথে আপনার WhatsApp বা ইমেলে পাঠানো হয়।',
    },
    {
      q: '৪. পেমেন্ট কীভাবে করতে হয়?',
      a: 'আমরা বিকাশ, নগদ ও রকেট পার্সোনাল নাম্বারে Send Money গ্রহণ করি। ওয়েবসাইটে প্রদর্শিত নাম্বারে টাকা পাঠিয়ে সঠিক সেন্ডার নাম্বার ও Transaction ID (TrxID) পেমেন্ট ফর্মে জমা দিতে হবে।',
    },
    {
      q: '৫. আমি কীভাবে আমার অর্ডার ট্র্যাক করব?',
      a: 'অর্ডার করার পর যে Order ID (যেমন: BST-YYYYMMDD-XXXX) পাবেন, সেটি এবং আপনার দেওয়া WhatsApp নাম্বারটি Track Order পেজে প্রবেশ করিয়ে লাইভ স্ট্যাটাস দেখতে পারবেন।',
    },
    {
      q: '৬. ভুল লিঙ্ক বা ভুল প্ল্যাটফর্মে অর্ডার দিলে কী হবে?',
      a: 'ভুল লিঙ্ক দিলে সার্ভিস কার্যকর হয় না। তাই অর্ডার সাবমিট করার আগেই ভালো করে লিঙ্কটি যাচাই করে নিন। কোনো বিভ্রান্তি থাকলে সাবমিটের আগেই আমাদের WhatsApp সাপোর্টে যোগাযোগ করুন।',
    },
    {
      q: '৭. অর্ডার বাতিল বা রিফান্ডের নিয়ম কী?',
      a: 'অর্ডার কনফার্মেশনের পর প্রসেস চালু হয়ে গেলে তা পরিবর্তন বা বাতিল সম্ভব হয় না। তবে আমাদের পক্ষ থেকে টেকনিক্যাল কোনো কারণে ডেলিভারি না হলে বিকল্প সার্ভিস বা সমাধান দেওয়া হয়।',
    },
    {
      q: '৮. আমার কি কোনো অ্যাকাউন্ট বা পাসওয়ার্ড তৈরি করতে হবে?',
      a: 'না! BOOSTARA সম্পূর্ণ গেস্ট চেকআউট সমর্থন করে। আপনার কোনো পাসওয়ার্ড বা রেজিস্ট্রেশন করতে হবে না। শুধুমাত্র অর্ডার আইডি এবং ফোন নাম্বার দিয়েই সবকিছু নিয়ন্ত্রণ করতে পারবেন।',
    },
  ];

  const adminPhone = settings.whatsapp || '01813078583';
  const cleanPhone = adminPhone.startsWith('0') ? `88${adminPhone}` : adminPhone;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="FAQ — Frequently Asked Questions | BOOSTARA"
        description="Find answers to common questions about BOOSTARA orders, delivery times, payments, and guarantees."
        keywords="BOOSTARA FAQ, SMM questions, payment guide, order delivery, social media boost FAQ"
        canonicalPath="/faq"
      />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl clay-badge text-[#1ac8ff] text-xs font-bold uppercase tracking-wider mb-4">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 drop-shadow-md">
          সাধারণ <span className="text-gradient">জিজ্ঞাসা ও উত্তর (FAQ)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          BOOSTARA সার্ভিস, পেমেন্ট, ডেলিভারি ও অর্ডার ট্র্যাকিং সম্পর্কিত সাধারণ প্রশ্নাবলীর সহজ সমাধান।
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4 mb-12">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="clay-card rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm sm:text-base font-bold text-white">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#1ac8ff] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.06] animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support Box */}
      <div className="clay-card-elevated p-8 rounded-3xl border border-white/[0.08] text-center space-y-4">
        <h3 className="text-xl font-bold text-white drop-shadow-sm">আপনার প্রশ্নের উত্তর খুঁজে পাননি?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          আমাদের WhatsApp সাপোর্ট টিম প্রতিদিন সক্রিয় থাকে। কোনো দ্বিধা থাকলে সরাসরি মেসেজ পাঠিয়ে দ্রুত সমাধান নিন।
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-6 rounded-2xl clay-btn-emerald text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white/10" />
            <span>সরাসরি WhatsApp-এ কথা বলুন</span>
          </a>
          <button
            onClick={() => navigate('/smm')}
            className="clay-btn-primary py-3 px-6 text-xs font-bold flex items-center gap-2 cursor-pointer rounded-2xl"
          >
            <span>অর্ডার শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
