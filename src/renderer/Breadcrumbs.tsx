import React from 'react';
import Spacing from './Spacing';

export type BreadcrumbsProps = {
  path: string;
  onSelect: (path: string) => void;
};

export default function Breadcrumbs({ path }: BreadcrumbsProps) {
  const parts = path.split('/').filter(part => !!part);

  return (
    <div>
      {parts.map(part => (
        <Spacing key={part} right={1} inline>
          {part}
        </Spacing>
      ))}
    </div>
  );
}
