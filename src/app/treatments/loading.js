import React from 'react';
import PageSkeleton from '@/components/common/PageSkeleton';

export default function TreatmentsLoading() {
  return <PageSkeleton layout="grid" count={6} />;
}
