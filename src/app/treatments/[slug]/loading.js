import React from 'react';
import PageSkeleton from '@/components/common/PageSkeleton';

export default function TreatmentDetailLoading() {
  return <PageSkeleton layout="detail" showHeader={false} />;
}
