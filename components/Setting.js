import React, { useState } from "react";
import { motion } from "framer-motion";
import useStore from "store";
import { useToken } from "wagmi";
import { RangeStepInput } from "react-range-step-input";
import { RadioGroup } from "@headlessui/react";
const Setting = () => {
  const settingPage = useStore((state) => state.settingPage);
  const setSettingPage = useStore((state) => state.setSettingPage);
  const slippage = useStore((state) => state.slippage);
  const setSlippage = useStore((state) => state.setSlippage);
  const [slip, setSlip] = useState(false);
  const [gas, setGas] = useState(false);

  return (
    <motion.div
      animate={{ top: settingPage ? "0" : "100%" }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="flex flex-col bg-white absolute  top-full  h-full w-full inset-0 pt-6 px-6 pb-8"
    >
      <div className="flex items-center justify-between pb-5">
        <div className="font-semibold">Advanced Settings</div>
        <button onClick={() => setSettingPage(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="none"
            viewBox="0 0 10 10"
          >
            <path
              fill="#1F1F41"
              fill-rule="evenodd"
              d="M8.18 9.278a.75.75 0 001.065-1.056L5.81 4.755 9.278 1.32A.75.75 0 108.222.253L4.754 3.69 1.317.222A.75.75 0 10.252 1.278l3.437 3.468L.222 8.18a.75.75 0 001.056 1.066L4.744 5.81 8.18 9.278z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div className="w-[calc(100%+48px)] h-[1px] -ml-6 bg-[rgb(232,236,253)]" />
      <div className="">
        <div
          className="flex items-center justify-between py-3"
          onClick={() => setSlip(!slip)}
        >
          <div className="font-semibold">Max Slippage</div>
          <div className="font-semibold flex gap-2 items-center">
            <span>{slippage}%</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="7"
              fill="none"
              viewBox="0 0 11 7"
            >
              <path
                fill="#1F1F41"
                d="M5.4 6.9L0 1.5 1.4.1l4 4 4-4 1.4 1.4-5.4 5.4z"
              ></path>
            </svg>
          </div>
        </div>
        {slip && (
          <motion.div>
            <RangeStepInput
              min={0.1}
              max={10}
              value={slippage}
              step={0.1}
              onChange={(e) => setSlippage(parseFloat(e.target.value))}
            />
          </motion.div>
        )}
        <div className="w-full h-[1px] mx-auto bg-[rgb(232,236,253)]" />
      </div>
      {/* <div className="">
        <div
          className="flex items-center justify-between py-3"
          onClick={() => setGas(!gas)}
        >
          <div className="font-semibold">Gas Price</div>
          <div className="font-semibold flex gap-2 items-center">
            <span>Fast (5 Gwei)</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="7"
              fill="none"
              viewBox="0 0 11 7"
            >
              <path
                fill="#1F1F41"
                d="M5.4 6.9L0 1.5 1.4.1l4 4 4-4 1.4 1.4-5.4 5.4z"
              ></path>
            </svg>
          </div>
        </div>
        {gas && <motion.div></motion.div>}
        <div className="w-full h-[1px] mx-auto bg-[rgb(232,236,253)]" />
      </div> */}
    </motion.div>
  );
};

export default Setting;

const Accordian = () => {};
