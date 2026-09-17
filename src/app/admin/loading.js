import React from 'react';
import PageSkeleton from '@/components/common/PageSkeleton';

export default function AdminLoading() {
  return <PageSkeleton layout="admin" showHeader={false} />;
}
