'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function HomeFAQ() {
  const { settings } = useSettings();
  const [openIndex, setOpenIndex] = useState(0);

  const clinicName = settings?.clinic_name || 'SkinGlow';
  const doctorName = settings?.doctor_name || 'Our lead physician';

  const faqItems = useMemo(() => [
    {
      question: 'How do I know which treatment is right for my unique skin concern?',
      answer: `Every journey at ${clinicName} begins with an in-depth dermatological consultation. ${doctorName} evaluates your skin barrier, hydration levels, pore congestion, and pigmentation using clinical imaging before tailoring a personalized, safe treatment protocol.`,
    },
    {
      question: 'What is the recovery time or downtime for laser and chemical peel treatments?',
      answer: 'Most of our signature therapies, such as HydraFacial Elite MD and Carbon Spectra Laser Toning, have zero downtime — you can immediately return to your normal routine with instant radiance. For deeper peels or resurfacing lasers, mild erythema (redness) or fine flaking resolves within 3 to 5 days.',
    },
    {
      question: 'Are treatments safe for sensitive skin and deeper Indian skin tones?',
      answer: 'Absolutely. We specialize in Fitzpatrick Skin Types III to VI. Our triple-wavelength lasers and medical peel formulations are clinically calibrated to eliminate risks of post-inflammatory hyperpigmentation while delivering superior aesthetic outcomes.',
    },
    {
      question: 'How many sessions will I need to see significant, lasting results?',
      answer: 'While immediate luminosity is visible after a single HydraFacial or Laser Toning session, structural improvements (such as acne scar remodeling, pigmentation fading, or hair follicle bio-restoration) typically involve a customized sequence of 3 to 6 sessions spaced 3 to 4 weeks apart.',
    },
    {
      question: 'Are anti-wrinkle injections and dermal fillers painful or unnatural looking?',
      answer: 'We believe in subtle, undetectable enhancement. Using topical anaesthetic creams, micro-fine German needles, and FDA-approved products, procedures are virtually painless. Our clinical philosophy prioritizes natural facial harmony — never an overfilled or frozen appearance.',
    },
  ], [clinicName, doctorName]);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
              isOpen ? 'border-accent/50 shadow-sm' : 'border-clinic-border-subtle hover:border-accent/30'
            }`}
          >
            <button
              type="button"
              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-primary text-base sm:text-lg hover:text-accent transition-colors"
              onClick={() => toggleFAQ(index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <div className={`w-7 h-7 rounded-full bg-clinic-bg flex items-center justify-center text-clinic-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent bg-accent/15' : ''}`}>
                <ChevronDown size={18} />
              </div>
            </button>

            {isOpen && (
              <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-clinic-muted leading-relaxed border-t border-clinic-border-subtle/50 animate-fadeIn">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
