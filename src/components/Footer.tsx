import nebulaLogo from 'data-base64:../../assets/nebula-logo.svg';

export const Footer = () => {
  const navigateToNebula = (): void => {
    window.open('https://www.utdnebula.com/', '_blank');
  };

  return (
    <div className="rounded-b-2xl p-2 bg-gray-light -mb-4 -ml-4 -mr-4">
      <div className="flex items-center justify-center">
        <h4 className="pr-2">Powered by Nebula Labs</h4>
        <img
          onClick={navigateToNebula}
          src={nebulaLogo}
          alt="Nebula Labs Logo"
          className="w-[25px] h-[25px] hover:cursor-pointer"
        ></img>
      </div>
    </div>
  );
};
