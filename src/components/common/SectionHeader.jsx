import React from 'react';

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  className = '',
}) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'} ${className}`}>
      {badge && <div className="badge mb-3">{badge}</div>}
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-primary font-bold tracking-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-sm sm:text-base text-clinic-muted leading-relaxed ${centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
