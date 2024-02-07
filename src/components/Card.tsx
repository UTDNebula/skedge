import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const Card = ({ children }: Props) => {
  return <div className="rounded-2xl p-4 shadow-md">{children}</div>;
};
