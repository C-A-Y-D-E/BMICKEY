import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useStore from "store";
import { useToken } from "wagmi";
import Button from "./Button";
import { useTimer } from "react-timer-hook";
const Quote = ({
  token,
  data,
  swap,
  handleGetQuote,
  handlePancakeSwap,
  pancake,
}) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 30);
  const { seconds, start, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      setTimer(true);
    },
  });

  const quotePage = useStore((state) => state.quotePage);
  const [timer, setTimer] = useState(false);
  const setQuotePage = useStore((state) => state.setQuotePage);
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

  const handleTimer = () => {
    setTimer(false);
    restart(time);
    start();
    handleGetQuote();
  };

  useEffect(() => {
    if (quotePage) {
      start();
    } else {
      restart(time);
    }
    restart(time);
    setTimer(false);
  }, [quotePage]);
  return (
    <motion.div
      animate={{
        // right: approvePage ? "auto" : "-100%",
        left: quotePage ? "0" : "100%",
      }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="flex flex-col bg-white absolute left-full right-0 origin-right   h-full w-full inset-0 pt-6 px-6 pb-8"
    >
      <div className="flex items-center justify-between pb-4">
        <button
          onClick={() => {
            setQuotePage(false);
            restart(0);
          }}
        >
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
        <div className="mx-auto text-accent-light">
          Quote Expires in {seconds} seconds
        </div>
      </div>
      <div className="my-auto">
        <div className=" w-full bg-accent/10 rounded-tl-2xl rounded-tr-2xl py-4 px-4">
          <span className="text-sm text-accent-light">You Pay</span>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-semibold mt-1">
              {parseFloat(
                data?.sellAmount / Math.pow(10, sellToken?.decimals)
              ).toFixed(6)}{" "}
              {sellToken?.symbol}
            </div>
            {/* <span className="text-sm text-accent-light">
              (~${" "}
              {parseFloat(
                data?.price * (data?.value / 10 ** sellToken?.decimals)
              ).toFixed(3)}
              )
            </span> */}
          </div>
        </div>
        <div className=" w-full bg-accent/10 rounded-bl-2xl mt-1 rounded-br-2xl py-4 px-4">
          <span className="text-sm text-accent-light">You Receive</span>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-semibold mt-1">
              {parseFloat(
                data?.buyAmount / Math.pow(10, buyToken?.decimals)
              ).toFixed(6)}{" "}
              {buyToken?.symbol}
            </div>
            {/* <span className="text-sm text-accent-light">
              (~${" "}
              {parseFloat(
                data?.price * (data?.value / 10 ** sellToken?.decimals)
              ).toFixed(3)}
              )
            </span> */}
          </div>
        </div>
        <div className="flex items-center mt-4 justify-between">
          <span className=" font-medium">Rate</span>
          <span className="font-medium">
            1 {sellToken?.symbol} @ {parseFloat(data?.price).toFixed(3)}{" "}
            {buyToken?.symbol}
          </span>
        </div>
        <div className="flex items-center my-2 justify-between">
          <span className=" font-medium">Estimated Fee</span>
          <span className="font-medium">Free</span>
        </div>
      </div>

      {pancake ? (
        <div className="mt-tauto">
          <Button
            label="Place Order"
            onClick={handlePancakeSwap}
            //   outline={true}
            // disabled={handleDisable}
          />
        </div>
      ) : (
        <div className="mt-auto">
          {!timer ? (
            <Button
              label="Place Order"
              onClick={swap}
              //   outline={true}
              // disabled={handleDisable}
            />
          ) : (
            <Button
              label="Refresh Quote "
              outline={true}
              onClick={handleTimer}
              // disabled={handleDisable}
            />
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Quote;
