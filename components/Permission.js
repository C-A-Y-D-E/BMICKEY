import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useStore from "store";
import { fetchToken, fetchBalance } from "@wagmi/core";
import { useToken } from "wagmi";
const Permission = ({ handleApprove, token, pancake, handlePancake }) => {
  const approvePage = useStore((state) => state.approvePage);
  const setApprovePage = useStore((state) => state.setApprovePage);
  // const [tInfo, setTInfo] = useState();
  const {
    data: tInfo,
    isError,
    isLoading,
  } = useToken({
    address: token,
  });

  // const fetchTokenFunction = async () => {
  //   const tokenInfo = await fetchToken({
  //     address: token,
  //   });
  //   setTInfo(tokenInfo);
  // };
  // useEffect(() => {
  //   if (approvePage) {
  //     fetchTokenFunction();
  //   }
  // }, []);
  return (
    <motion.div
      animate={{
        left: approvePage ? "0" : "100%",
      }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="flex flex-col bg-white absolute left-full origin-right   h-full w-full inset-0 pt-6 px-6 pb-8"
    >
      <div className="flex items-center justify-between pb-4">
        <button onClick={() => setApprovePage(false)}>
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
        <div className="text-3xl font-medium mt-4 mb-2">
          We need permission <br /> to use your {tInfo?.symbol}
        </div>
        <div className="text-accent font-medium text-sm">
          Why do i have to do this?
        </div>
      </div>
      <button
        onClick={() => {
          if (pancake) {
            handlePancake();
          } else {
            handleApprove();
          }
        }}
        className="w-full py-4 rounded-2xl text-white font-medium bg-accent"
      >
        Approve my {tInfo?.symbol}
      </button>
    </motion.div>
  );
};

export default Permission;
