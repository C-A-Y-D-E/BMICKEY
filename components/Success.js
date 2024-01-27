import React from "react";
import { motion } from "framer-motion";
import useStore from "store";
const Success = ({ orderHash }) => {
  const successPage = useStore((state) => state.successPage);
  const setSuccessPage = useStore((state) => state.setSuccessPage);
  const setProcessingPage = useStore((state) => state.setProcessingPage);
  return (
    <motion.div
      animate={{
        // right: approvePage ? "auto" : "-100%",
        left: successPage ? "0" : "100%",
      }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="flex flex-col bg-white absolute left-full right-0 origin-right   h-full w-full inset-0 pt-6 px-6 pb-8"
    >
      <div className="flex items-center justify-between pb-4">
        {/* <button onClick={() => setSuccessPage(false)}>
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
        <div className="mx-auto text-accent-light">Transaction Completed!</div>
      </div>

      <div className="self-center text-center my-auto">
        <div className="h-32 w-32 mx-auto border-2 border-green-400 rounded-full flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="25"
            fill="none"
            viewBox="0 0 33 25"
          >
            <path
              fill="#2EDDBF"
              d="M12.13 13.68l-8-4.8-3.2 3.2 11.2 12.8 20.8-20.8-3.2-3.2-17.6 12.8z"
            ></path>
          </svg>
        </div>

        <div className="text-3xl font-semibold mt-4 mb-2">Success!</div>
      </div>
      <div className="flex gap-8 items-center">
        <a
          target="_blank"
          href={`https://bscscan.com/tx/${orderHash}`}
          className="flex-1 text-center py-4 rounded-2xl text-accent   font-medium border border-accent"
        >
          Receipt
        </a>
        <button
          onClick={() => {
            setProcessingPage(false);
            setSuccessPage(false);
          }}
          className="flex-1 py-4 rounded-2xl text-white font-medium bg-accent"
        >
          New Trade
        </button>
      </div>
    </motion.div>
  );
};

export default Success;
