import React from 'react';

interface Props {
  text: string;
}

export const RmpTag = ({ text }: Props) => {
  return (
    <h4 className="px-2 py-1 bg-slate-200 w-min rounded-2xl whitespace-nowrap overflow-hidden">
      {text}
    </h4>
  );
};
