import React from 'react';
import PageSkeleton from '@/components/common/PageSkeleton';

export default function BlogsLoading() {
  return <PageSkeleton layout="grid" count={6} />;
}
