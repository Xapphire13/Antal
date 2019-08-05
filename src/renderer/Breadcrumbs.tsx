import React from 'react';

export type BreadcrumbsProps = {
  path: string;
  onSelect: (path: string) => void;
};

export default function Breadcrumbs({ path }: BreadcrumbsProps) {
  const parts = path.split('/').filter(part => !!part);

  return (
    <div>
      {parts.map(part => (
        <span key={part}>{part}</span>
      ))}
    </div>
  );
}
