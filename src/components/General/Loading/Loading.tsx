import { Spinner, TextItem } from '@components/General';
import React from 'react';

export default function Loading() {
  return (
    <div className="absolute left-1/2 top-1/2 flex -translate-x-[50%] -translate-y-[50%] flex-col gap-4">
      <Spinner />
      <TextItem className="text-3xl font-medium" fontSize="h1">
        Loading...
      </TextItem>
    </div>
  );
}
