import React from 'react';
import styles from './SectionHeader.module.css';

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  className = '',
}) {
  return (
    <div className={`${styles.header} ${centered ? styles.centered : ''} ${className}`}>
      {badge && <div className="badge">{badge}</div>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
