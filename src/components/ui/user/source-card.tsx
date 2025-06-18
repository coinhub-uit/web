'use client';

import { SourceDto } from '@/types/source';

interface SourceCardProps {
  source: SourceDto;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="card bg-base-100 w-full shadow-sm">
      <div className="card-body p-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Source #{source.id}</h2>
          </div>
          <p className="text-xs">
            <strong className="font-semibold">Balance:</strong> {source.balance}
          </p>
        </div>
      </div>
    </div>
  );
}
