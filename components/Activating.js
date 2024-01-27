import React from "react";
import { motion } from "framer-motion";
import useStore from "store";
import { useToken } from "wagmi";
const Activating = ({ token, approvalHash }) => {
  const activatingPage = useStore((state) => state.activatingPage);
  const setActivatingPage = useStore((state) => state.setActivatingPage);
  const {
    data: tInfo,
    isError,
    isLoading,
  } = useToken({
    address: token,
  });
  return (
    <motion.div
      animate={{
        // right: approvePage ? "auto" : "-100%",
        left: activatingPage ? "0" : "100%",
      }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="flex flex-col bg-white absolute left-full right-0 origin-right   h-full w-full inset-0 pt-6 px-6 pb-8"
    >
      <div className="flex items-center justify-between pb-4">
        {/* <button onClick={() => setActivatingPage(false)}>
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
        </button> */}
        <div className="mx-auto text-accent-light">
          Approve permission to sell your {tInfo?.symbol}
        </div>
      </div>

      <div className="self-center text-center my-auto">
        <div className="h-20 w-20 mx-auto border-2 border-yellow-300 rounded-full flex items-center justify-center">
          {tInfo?.address && (
            <img
              src={`https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/${tInfo?.address}/logo.png`}
            />
          )}
        </div>

        <div className="text-3xl font-semibold mt-4 mb-2">
          Activing {tInfo?.symbol}
        </div>
        <div className="text-2xl  text-accent-light  mb-2">Processing</div>
      </div>
      <a
        href={`https://bscscan.com/tx/${approvalHash}`}
        target="_blank"
        className=" py-4 block text-center rounded-2xl text-accent w-[80%] mx-auto font-medium border border-accent"
      >
        View Transaction
      </a>
    </motion.div>
  );
};

export default Activating;
