import React from "react";
import { motion } from "framer-motion";
import useStore from "store";
import { useToken } from "wagmi";
import Button from "./Button";
const Processing = ({ token, orderHash, data }) => {
  const processingPage = useStore((state) => state.processingPage);
  const setProcessingPage = useStore((state) => state.setProcessingPage);
  const { data: buyToken } = useToken({
    address:
      data?.buyTokenAddress == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ? "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
        : data?.buyTokenAddress,
  });
  const { data: sellToken } = useToken({
    address:
      data?.sellTokenAddress == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ? "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
        : data?.sellTokenAddress,
  });
  return (
    <motion.div
      animate={{
        // right: approvePage ? "auto" : "-100%",
        left: processingPage ? "0" : "100%",
      }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="flex flex-col bg-white absolute left-full right-0 origin-right   h-full w-full inset-0 pt-6 px-6 pb-8"
    >
      <div className="flex items-center justify-between pb-4">
        {/* <button onClick={() => setProcessingPage(false)}>
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
          Selling{" "}
          {parseFloat(
            data?.sellAmount / Math.pow(10, sellToken?.decimals)
          ).toFixed(3)}{" "}
          {sellToken?.symbol} for{" "}
          {parseFloat(
            data?.buyAmount / Math.pow(10, buyToken?.decimals)
          ).toFixed(3)}{" "}
          {buyToken?.symbol}
        </div>
      </div>

      <div className="self-center text-center my-auto">
        <div className="h-40 w-40 mx-auto border-2 border-yellow-300 rounded-full flex flex-col items-center justify-center">
          <div>Time left</div>
          <div className="text-xl font-semibold ">PROCESSING</div>
        </div>

        <div className="text-3xl font-semibold mt-4 mb-2">
          Transaction on Chain
        </div>
      </div>
      <a
        href={`https://bscscan.com/tx/${orderHash}`}
        target="_blank"
        className="text-center py-4 rounded-2xl text-accent w-[80%] mx-auto font-medium border border-accent"
      >
        View Transaction
      </a>
    </motion.div>
  );
};

export default Processing;
