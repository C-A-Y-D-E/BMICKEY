import React, { useEffect, useState } from "react";

import { fetchToken, fetchBalance } from "@wagmi/core";
import axios from "axios";
import { useAccount } from "wagmi";
const Pay = ({ data, name, setSearch, setData, price, defaultToken }) => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(0);
  const [url, setUrl] = useState(
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png"
  );
  function checkImage(url) {
    axios
      .get(
        `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${url}/logo.png`
      )
      .then(function (response) {
        if (url == "0xa0944dBAB172f1DD41e76D28929912Dff634e592") {
          setUrl("/icons/spicy.svg");
        }
        setUrl(
          `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${url}/logo.png`
        );
      })
      .catch(function (error) {
        setUrl(
          `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png`
        );
        if (url == "0xa0944dBAB172f1DD41e76D28929912Dff634e592") {
          setUrl("/icons/spicy.svg");
        }
      });
  }

  useEffect(() => {
    fetch();
    checkImage(data.address);
  }, [isConnected, data.address]);

  const fetch = async () => {
    const b = await fetchBalance({
      address: address,
      token:
        data.address === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
          ? null
          : data.address,
    });

    setBalance(b);
  };

  const handleMax = () => {
    setData({
      ...data,
      amount: balance.formatted,
    });
  };
  return (
    <div>
      <div className="pt-6 pb-4 ">
        <div className="font-medium flex items-center justify-between">
          <div>You {name}</div>
          {/* {data.name !== "" && (
            <div className="text-accent-light font-normal text-sm">
              {name === "Receive" ? "Balance " : "Max "}
              {parseFloat(balance.formatted).toFixed(3)} {balance.symbol}
            </div>
          )} */}
          {data.name !== "" && (
            <>
              {name === "Receive" ? (
                <div className="text-accent-light font-normal text-sm ">
                  Balance{" "}
                  {balance?.formatted
                    ? parseFloat(balance.formatted).toFixed(3)
                    : "0.0"}{" "}
                  {balance.symbol == "WBNB" ? "BNB" : balance.symbol}
                </div>
              ) : (
                <button
                  onClick={handleMax}
                  className="text-accent-light font-normal text-sm border-b border-b-transparent hover:border-b-text hover:text-text"
                >
                  Max{" "}
                  {balance?.formatted
                    ? parseFloat(balance.formatted).toFixed(3)
                    : "0.0"}{" "}
                  {balance.symbol}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {/* Receive SPART */}
      {data.name !== "" && (
        <div className="pb-8">
          <div className="flex justify-between">
            <div className="flex-1 flex items-center">
              <button
                onClick={() => setSearch(true)}
                className="flex gap-3 items-center hover:bg-accent/10 rounded-md py-1 px-2 -ml-2 "
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full  flex items-center justify-center">
                    <img src={url} className="w-8" />
                  </div>
                  <div className="text-2xl font-medium">
                    {" "}
                    {data.symbol == "WBNB" ? "BNB" : data.symbol}
                  </div>
                </div>
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
              </button>
            </div>
            <div className="h-[64px] flex-1 relative">
              <input
                value={data.amount}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                    setData({
                      ...data,
                      amount: value,
                    });
                  }
                }}
                placeholder="0"
                className="focus-visible:ring-[1px] focus-visible:outline-none focus-visible:ring-accent bg-[#F7F7FF] rounded-2xl pb-6 placeholder:text-accent-light text-right px-4 pt-3 text-2xl w-full font-medium  text-text"
              />

              {/* {name === "Receive" ? (
                <span className="text-sm absolute bottom-0 right-4 text-accent-light">
                  ${" "}
                  {data?.amount
                    ? parseFloat(
                        price?.buyAmount / 10 ** data?.decimals
                      ).toFixed(3)
                    : "0.00"}
                </span>
              ) : (
                <span className="text-sm absolute bottom-0 right-4 text-accent-light">
                  ${" "}
                  {data?.amount
                    ? parseFloat(price?.price * data?.amount).toFixed(3)
                    : "0.00"}
                </span>
              )} */}
            </div>
          </div>
        </div>
      )}
      {data.name === "" && (
        <div className="pb-8">
          <button
            onClick={() => setSearch(true)}
            className="flex gap-2 items-center hover:bg-accent/10 rounded-md py-1 px-2 -ml-2"
          >
            <span className="text-2xl font-medium">Choose Token</span>
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
          </button>
        </div>
      )}
    </div>
  );
};

export default Pay;
