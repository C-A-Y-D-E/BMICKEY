import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
const Header = () => {
  return (
    <nav className="fixed top-6 w-full">
      <div className="container mx-auto max-w-[1280px] w-full px-6  h-20 ">
        <div className="flex items-center justify-between h-full">
          {/* <div className="text-2xl font-bold"></div> */}
          <img src="/logo.jpeg" className="w-24 rounded-full" />
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Header;
