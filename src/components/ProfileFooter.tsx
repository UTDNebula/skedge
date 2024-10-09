import React from 'react';

export const ProfileFooter = ({
  name,
  rmpId,
}: {
  name: string;
  rmpId: number;
}) => {
  return (
    <footer className="mt-2 flex justify-center gap-2">
      <a
        className="border-cornflower-600 border-2 rounded-full p-2 hover:bg-cornflower-600 hover:text-white transition"
        href={'https://www.ratemyprofessors.com/professor/' + rmpId}
        target="_blank"
        rel="noreferrer"
      >
        Open Rate My Professors
      </a>
      <a
        className="border-cornflower-600 border-2 rounded-full p-2 hover:bg-cornflower-600 hover:text-white transition"
        href={
          'https://trends.utdnebula.com/dashboard?searchTerms=' +
          name.split(' ')[0] +
          '+' +
          name.split(' ')[name.split(' ').length - 1]
        }
        target="_blank"
        rel="noreferrer"
      >
        Open Nebula Trends
      </a>
    </footer>
  );
};
