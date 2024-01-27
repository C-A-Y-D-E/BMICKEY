import React, { useState, useEffect } from "react";
import axios from "axios";
import qs from "querystring";
import { motion } from "framer-motion";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { reactLocalStorage } from "reactjs-localstorage";
import {
  erc20ABI,
  prepareWriteContract,
  writeContract,
  Unit,
  sendTransaction,
  prepareSendTransaction,
  fetchBalance,
} from "@wagmi/core";
import pancakeABI from "/abi/pancakeABI.json";
import { useBalance } from "wagmi";
// const Web3 = require("web3");
import Web3 from "web3";
import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import SelectCoin from "./SelectCoin";
import Change from "./Change";
import Permission from "./Permission";
import Search from "./Search";
import useStore from "store";
import Confirm from "./Confirm";
import Activating from "./Activating";
import Processing from "./Processing";
import Success from "./Success";
import Button from "./Button";
import Quote from "./Quote";
import Setting from "./Setting";
import Error from "./Error";
import { on } from "events";
import { ethers } from "ethers";
import { useToken } from "wagmi";
import BNBError from "./BNBError";
const Swap = ({ outputCurrency, inputCurrency }) => {
  const [searchPay, setSearchPay] = useState(false);
  const slippage = useStore((state) => state.slippage);
  const [info, setInfo] = useState(null);
  const [sellPrice, setSellPrice] = useState(null);
  const [buyPrice, setBuyPrice] = useState(null);
  const [approvalHash, setApprovalHash] = useState("#");
  const [orderHash, setOrderHash] = useState("#");
  const { address, isConnected } = useAccount();
  const [searchReceive, setSearchReceive] = useState(false);
  const setApprovePage = useStore((state) => state.setApprovePage);
  const setConfirmPage = useStore((state) => state.setConfirmPage);
  const setActivatingPage = useStore((state) => state.setActivatingPage);
  const setSuccessPage = useStore((state) => state.setSuccessPage);
  const setSettingPage = useStore((state) => state.setSettingPage);
  const setQuotePage = useStore((state) => state.setQuotePage);
  const setProcessingPage = useStore((state) => state.setProcessingPage);
  const setBNBErrorPage = useStore((state) => state.setBNBErrorPage);
  const setErrorPage = useStore((state) => state.setErrorPage);
  const [pancake, setPancake] = useState(false);
  const { data: payToken } = useToken({
    address: inputCurrency,
  });
  const { data: sellToken } = useToken({
    address: outputCurrency,
  });

  const [pay, setPay] = useState(
    payToken
      ? payToken
      : {
          name: "BNB",
          amount: 0,
          address: inputCurrency,
          decimals: 18,
          // icon: "/icons/eth.svg",
        }
  );
  const [receive, setReceive] = useState(
    sellToken
      ? sellToken
      : {
          name: "spicy",
          amount: 0,
          address: outputCurrency,
          decimals: 18,
        }
  );
  const { data } = useBalance({
    address: address,
    token:
      pay?.address === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
        ? null
        : pay?.address,
  });

  const handleChange = () => {
    let temp = pay;
    pay = receive;
    setPay(receive);
    setReceive(temp);
  };

  const handleDisable = () => {
    console.log(pay.amount == 0, "handleDisable", data?.formatted);
    let flag = true;
    if (parseFloat(pay?.amount) <= parseFloat(data?.formatted)) {
      flag = false;
    }
    if (pay.amount == 0) {
      flag = true;
    }

    return flag;
  };
  const handleGetPrice = async () => {
    const sellParams = {
      sellToken: pay.address,
      buyToken: receive.address,
      sellAmount:
        pay?.amount > 0
          ? ethers.utils.parseUnits(`${pay.amount}`, pay.decimals).toString()
          : 0,
      includePriceComparisons: false,
    };

    // Fetch the swap price.
    const sellToken = await axios.get(
      `https://bsc.api.0x.org/swap/v1/price?${qs.stringify(sellParams)}`
    );
    const sellInfo = sellToken.data;
    setSellPrice(sellInfo);

    const amount = sellInfo.buyAmount / 10 ** receive.decimals;
    setReceive({
      ...receive,
      amount,
    });
    // try {
    //   const buyParams = {
    //     sellToken: pay.address,
    //     buyToken: receive.address,
    //     buyAmount: amount * Math.pow(10, receive.decimals),
    //     includePriceComparisons: false,
    //   };
    //   const buyToken = await axios.get(
    //     `https://bsc.api.0x.org/swap/v1/price?${qs.stringify(buyParams)}`
    //   );
    //   const buyInfo = buyToken.data;
    //   console.log("buy call");
    //   setBuyPrice(buyInfo);
    // } catch (error) {}
  };
  const handleGetQuote = async () => {
    const params = {
      sellToken:
        pay.address === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
          ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
          : pay.address,
      buyToken: receive.address,
      sellAmount: pay.amount
        ? ethers.utils.parseUnits(`${pay.amount}`, pay.decimals).toString()
        : 0,
      takerAddress: address,
      slippagePercentage: slippage / 10,
      // enableSlippageProtection: false,
    };
    // Fetch the swap price.
    try {
      setPancake(false);
      const response = await axios.get(
        `https://bsc.api.0x.org/swap/v1/quote?${qs.stringify(params)}`
      );

      const info = response.data;
      setInfo(info);
      const amount = info.buyAmount / 10 ** receive.decimals;
      setReceive({
        ...receive,
        amount,
      });

      setQuotePage(true);
    } catch (error) {
      let errObj = error.response.data;
      console.log(errObj?.values?.message, "quote");

      if (errObj.reason == "IncompleteTransformERC20Error") {
        setErrorPage({
          show: true,
          text: [
            <span>Something went wrong, retry</span>,
            <span className="text-sm"> HINT: Try increasing Slippage</span>,
          ],
        });
      } else if (
        errObj?.values?.message == "BEP20: transfer amount exceeds allowance"
      ) {
        setApprovePage(true);
      } else if (
        errObj?.values?.message === "Pancake: K" ||
        errObj?.values?.message == "ERC20: transfer amount exceeds allowance" ||
        errObj.code === 111
      ) {
        // setErrorPage({
        //   show: true,
        //   text: [
        //     <span>Try Pancakeswap for selling tax tokens, for now</span>,
        //     <span className="text-sm">We are adding more features soon!</span>,
        //   ],
        // });

        let approvalStorage = JSON.parse(
          reactLocalStorage.get("approve", false)
        );
        // if (!approvalStorage) {
        //   reactLocalStorage.set("approve", JSON.stringify([]));
        // }

        console.log(approvalStorage, "appss");
        if (approvalStorage[address].find((e) => e == pay.address)) {
          setQuotePage(true);
        } else {
          setApprovePage(true);
        }
        setPancake(true);
      } else if (errObj.code === 111) {
        setBNBErrorPage(true);
      } else {
        // setApprovePage(true);
        setErrorPage({
          show: true,
          text: [
            <span>Something went wrong, retry</span>,
            // <span className="text-sm"> HINT: Try increasing Slippage</span>,
          ],
        });
      }
    }

    // // console.log(response.data);
  };

  const handleApprove = async () => {
    setApprovePage(false);
    setConfirmPage(true);
    const maxApproval =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    const config = await prepareWriteContract({
      address: pay.address,
      abi: erc20ABI,
      functionName: "approve",
      args: [sellPrice?.allowanceTarget, maxApproval],
    });

    const data = writeContract(config);

    data
      .then(async (confirmation) => {
        setConfirmPage(false);
        setActivatingPage(true);
        setApprovalHash(confirmation.hash);
        handleGetQuote(address);
        await confirmation.wait(1);
        setActivatingPage(false);
        setQuotePage(true);
      })
      .catch((error) => {
        console.log(error, "metamask");
        setErrorPage({
          show: true,
          text: [
            <span>You'have canceled the transaction</span>,
            // <span className="text-sm"> HINT: Try increasing Slippage</span>,
          ],
        });
        setConfirmPage(false);
      });
    // data.wait(1);
  };

  const handleSwap = async () => {
    handleGetQuote();
  };

  const swap = async () => {
    const web3 = new Web3(Web3.givenProvider);
    web3.eth
      .sendTransaction(info)
      .on("transactionHash", (hash) => {
        setQuotePage(false);
        setProcessingPage(true);
        setOrderHash(hash);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        setProcessingPage(false);
        console.log(receipt, "re", confirmationNumber);

        if (confirmationNumber == 1) {
          if (receipt.status == true) {
            setSuccessPage(true);
          }
          if (receipt.status == false) {
            setErrorPage({ text: "Something Went Wrong, Retry", show: true });
          }
          setProcessingPage(false);
        }
      })
      .on("error", (error) => {
        setProcessingPage(false);
        console.log(error, "errormeta");
        if (error.code === 4001) {
          setErrorPage({
            show: true,
            text: "You've canceled your transaction",
          });
        } else {
          setErrorPage({
            show: true,
            text: "Something went wrong, retry",
          });
        }
      });
  };

  const handlePancake = async () => {
    setApprovePage(false);
    setConfirmPage(true);
    let approvalStorage = JSON.parse(reactLocalStorage.get("approve", false));
    const config = await prepareWriteContract({
      address: pay.address,
      abi: erc20ABI,
      functionName: "approve",
      args: [
        "0x10ED43C718714eb63d5aA57B78B54704E256024E",
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      ],
    });
    const data = writeContract(config);
    data
      .then(async (receipt) => {
        setConfirmPage(false);
        setActivatingPage(true);
        setApprovalHash(receipt.hash);
        await receipt.wait(1);
        setActivatingPage(false);
        if (approvalStorage) {
          reactLocalStorage.set(
            "approve",
            JSON.stringify({
              [address]: [...approvalStorage[address], pay.address],
            })
          );
        }
        setQuotePage(true);
      })
      .catch((error) => {
        console.log(error, "metamask");
        if (error.code === 4001) {
          setErrorPage({
            show: true,
            text: [
              <span>You'have canceled the transaction</span>,
              // <span className="text-sm"> HINT: Try increasing Slippage</span>,
            ],
          });
        }
        setApprovePage(false);
        setConfirmPage(false);
        setPancake(false);
        setErrorPage({
          show: true,
          text: [
            <span>Something went Wrong</span>,
            // <span className="text-sm"> HINT: Try increasing Slippage</span>,
          ],
        });
      });
  };

  function calculateValue(percentage, whole) {
    return parseFloat((percentage / 100) * whole).toFixed(1);
  }

  const handlePancakeSwap = async () => {
    setPancake(true);
    const time = new Date();
    let deadline = time.setSeconds(time.getSeconds() + 60);
    let amountOut = ethers.utils.parseUnits(`${pay.amount}`, pay.decimals);
    let amountIn = ethers.utils.parseUnits(
      `${receive.amount - calculateValue(0.25, receive.amount)}`,
      receive.decimals
    );
    // let amountIn = ethers.utils.parseUnits(
    //   `${receive.amount}`,
    //   receive.decimals
    // );

    const config = await prepareWriteContract({
      address: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
      abi: pancakeABI,
      functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",

      args: [
        `${amountOut}`,
        `${0}`,
        [pay.address, receive.address],
        address,
        dayjs(deadline).unix(),
        {
          gasPrice: ethers.utils.parseUnits("5", "gwei"),
          gasLimit: 440514,
        },
      ],
      // overrides:{
      //   gasLimit:ethers.utils.parseUnits(5,'g')
      // }
    });
    const data = writeContract(config);

    data
      .then(async (receipt) => {
        console.log(receipt, "poan");
        setQuotePage(false);
        setProcessingPage(true);
        setOrderHash(receipt.hash);
        await receipt.wait(1);
        setProcessingPage(false);
        setSuccessPage(true);
        setPancake(false);
      })
      .catch((error) => {
        console.log(error, "metamask");
        setErrorPage({
          show: true,
          text: [
            <span>You'have canceled the transaction</span>,
            // <span className="text-sm"> HINT: Try increasing Slippage</span>,
          ],
        });
        setProcessingPage(false);
      });
  };

  useEffect(() => {
    if (pay.address !== "" && receive.address !== "" && pay.amount > 0) {
      handleGetPrice();
    }
    let approvalStorage = JSON.parse(reactLocalStorage.get("approve", false));
    if (!approvalStorage) {
      reactLocalStorage.set("approve", JSON.stringify({ [address]: [] }));
    }
  }, [pay.amount, pay.address, receive.address, isConnected]);

  return (
    <div className="w-[450px] bg-white  full-shadow pt-4 px-6 pb-8 rounded-2xl relative overflow-hidden">
      <div className="flex flex-col">
        <div className="flex items-center justify-between h-12">
          <div className="font-medium border-b-[2px] h-full border-accent flex items-center justify-center">
            Markets
          </div>
          <button onClick={() => setSettingPage(true)}>
            <img src="/icons/setting.svg" />
          </button>
        </div>
        <div className="w-[calc(100%+48px)] h-[1px] -ml-6 bg-[rgb(232,236,253)]" />

        <SelectCoin
          setData={setPay}
          setSearch={setSearchPay}
          data={pay}
          name="Pay"
          price={sellPrice}
          defaultToken={inputCurrency}
        />
        <div className="w-[calc(100%+48px)] h-[17px] -ml-6 border-b border-[rgb(232,236,253)]" />
        <div className="-mt-5">
          <Change handleChange={handleChange} />
        </div>
        <SelectCoin
          setSearch={setSearchReceive}
          data={receive}
          setData={setReceive}
          name="Receive"
          price={sellPrice}
          defaultToken={outputCurrency}
        />

        <Button onClick={handleSwap} label="Swap" disabled={handleDisable()} />
      </div>
      <div className="flex items-center justify-between mt-4 font-medium">
        <div>BSC Fee</div>
        <div className="text-green-600">FREE</div>
      </div>
      <Search
        search={searchPay}
        pay={pay}
        receive={receive}
        setSearch={setSearchPay}
        selectCoin={setPay}
        text="Pay"
      />
      <Search
        search={searchReceive}
        pay={pay}
        receive={receive}
        setSearch={setSearchReceive}
        selectCoin={setReceive}
        text="Receive"
      />

      <Setting />

      <Permission
        handleApprove={handleApprove}
        token={pay.address}
        pancake={pancake}
        handlePancake={handlePancake}
      />

      <Confirm token={pay.address} />
      <Activating approvalHash={approvalHash} token={pay.address} />
      <Quote
        token={pay.address}
        data={pancake ? sellPrice : info}
        swap={swap}
        handleGetQuote={handleGetQuote}
        handlePancakeSwap={handlePancakeSwap}
        pancake={pancake}
      />
      <Processing
        orderHash={orderHash}
        data={pancake ? sellPrice : info}
        token={pay.address}
      />
      <Success orderHash={orderHash} />
      <Error />
      <BNBError />
    </div>
  );
};

export default Swap;
