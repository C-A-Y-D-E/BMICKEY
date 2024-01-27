import React from "react";
import { motion } from "framer-motion";
import useStore from "store";
import { useBalance, useAccount } from "wagmi";
const BNBError = ({}) => {
  const BNBErrorPage = useStore((state) => state.BNBErrorPage);
  const setBNBErrorPage = useStore((state) => state.setBNBErrorPage);
  const { address } = useAccount();
  const { data } = useBalance({ address });
  return (
    <motion.div
      animate={{
        // right: approvePage ? "auto" : "-100%",
        left: BNBErrorPage ? "0" : "100%",
      }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="flex flex-col bg-white absolute left-full right-0 origin-right   h-full w-full inset-0 pt-6 px-6 pb-8"
    >
      <div className="flex items-center justify-between pb-4">
        <button onClick={() => setBNBErrorPage(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="10"
            fill="none"
            viewBox="0 0 13 10"
          >
            <path
              fill="#0A1A5D"
              d="M5.882 5.724h6c.45 0 .75-.3.75-.75s-.3-.75-.75-.75h-6V.474l-5.25 4.5 5.25 4.5v-3.75z"
            ></path>
          </svg>
        </button>
        <div className="mx-auto text-accent-light">Not enough BNB for fees</div>
      </div>

      <div className="self-center text-center my-auto">
        {/* <div className="h-24 w-24 mx-auto border-4 border-red-400 rounded-full flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="none"
          >
            <path
              d="M18.083 1.2a1.243 1.243 0 00-1.8 0L9.47 8.012 2.655 1.2a1.243 1.243 0 00-1.8 0 1.243 1.243 0 000 1.8l6.814 6.814-6.814 6.815a1.243 1.243 0 000 1.8c.257.257.514.386.9.386.385 0 .643-.13.9-.386l6.814-6.815 6.814 6.815c.257.257.643.386.9.386s.643-.13.9-.386a1.243 1.243 0 000-1.8L11.27 9.813 18.083 3a1.243 1.243 0 000-1.8z"
              fill="#FF005C"
            />
          </svg>
        </div> */}

        <div className="text-3xl font-semibold mt-4 mb-2 max-w-[300px] w-full flex gap-2 flex-col">
          Deposit <span className="text-accent">0.0021 BNB</span> to pay for
          fees
        </div>
        <div className="text-lg mt-2">
          Your balance: {parseFloat(data?.formatted).toFixed(5)} BNB
        </div>
      </div>
      <div className="flex gap-8 items-center">
        <button
          onClick={() => {
            setBNBErrorPage(false);
          }}
          className="flex-1 py-4 rounded-2xl text-white font-medium bg-accent"
        >
          Ok Thanks!
        </button>
      </div>
    </motion.div>
  );
};

export default BNBError;
