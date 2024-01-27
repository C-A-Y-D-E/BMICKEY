import Button from "components/Button";
import React, { useEffect, useState } from "react";
import {
  erc20ABI,
  prepareWriteContract,
  writeContract,
  Unit,
  sendTransaction,
  prepareSendTransaction,
  fetchBalance,
} from "@wagmi/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
  useContractRead,
  useBalance,
} from "wagmi";
import stakeABI from "abi/stakeABI.json";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
const stake = () => {
  const [active, setActive] = useState("stake");
  const [input, setInput] = useState("0");
  const [progress, setProgress] = useState(false);
  const [approval, setApproval] = useState(false);
  const CONTRACT = "0x6c3E6561b1821b1445f63084E23f98598E4367E5";
  const TOKEN_CONTRACT = "0x4da874C7e4bEDdc100D3dB46C214bd2e1653115F";
  const { address, isConnected } = useAccount();
  const { data } = useBalance({
    address: address,
    token: TOKEN_CONTRACT,
    watch: true,
  });

  const { data: isStakingLive } = useContractRead({
    address: CONTRACT,
    abi: stakeABI,
    functionName: "isStakingLive",
  });
  const { data: totalStaked } = useContractRead({
    address: CONTRACT,
    abi: stakeABI,
    functionName: "amountStaked",
    args: [address ? address : ""],
    watch: true,
  });
  const { data: totalEarned } = useContractRead({
    address: CONTRACT,
    abi: stakeABI,
    functionName: "rewardsPaid",
    args: [address ? address : ""],
    watch: true,
  });
  const { data: isApproved } = useContractRead({
    address: TOKEN_CONTRACT,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, CONTRACT],
    watch: true,
  });

  async function handleApprove() {
    let tokenId = toast.loading("Loading....");
    const tokenConfig = await prepareWriteContract({
      address: TOKEN_CONTRACT,
      abi: erc20ABI,
      functionName: "approve",
      args: [
        CONTRACT,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      ],
    });
    const data = writeContract(tokenConfig);
    data
      .then(async (receipt) => {
        setProgress(true);
        toast.remove(tokenId);
        let tc = toast.loading("Activating Approval");
        console.log(receipt);
        await receipt.wait(1);
        toast.remove(tc);
        setApproval(false);
        setProgress(false);
        toast.success("Now you can stake your tokens!");
      })
      .catch((err) => {
        toast.remove(tokenId);
        setProgress(false);
        console.log(err);
      });
  }

  async function handleStake() {
    try {
      const toastId = toast.loading("Waiting for confirmation....");
      const config = await prepareWriteContract({
        address: CONTRACT,
        abi: stakeABI,
        functionName: "stake",
        args: [ethers.utils.parseUnits(input, 18), 1],
      });
      const data = writeContract(config);
      data
        .then(async (receipt) => {
          setProgress(true);
          toast.remove(toastId);
          let tc = toast.loading("Waiting for transaction to complete...");
          await receipt.wait(1);
          setProgress(false);
          toast.remove(tc);

          toast.success("Spicy staked sucessfully!");
        })
        .catch((err) => {
          toast.remove(toastId);
          console.log(err);
          setProgress(false);
        });
    } catch (error) {
      toast.remove();
      toast.error(error.reason);
      setProgress(false);
    }
  }

  async function claimReward() {
    try {
      const toastId = toast.loading("Waiting for confirmation....");
      const config = await prepareWriteContract({
        address: CONTRACT,
        abi: stakeABI,
        functionName: "claimReward",
        overrides: {
          from: address,
        },
      });
      const data = writeContract(config);
      data
        .then(async (receipt) => {
          toast.remove(toastId);
          setProgress(true);
          let tc = toast.loading("Waiting for transaction to complete...");
          await receipt.wait(1);
          setProgress(false);
          toast.remove(tc);

          toast.success("Spicy reward claimed sucessfully!");
        })
        .catch((err) => {
          toast.remove();
          setProgress(false);
          console.log(err.reason);
        });
    } catch (error) {
      toast.remove();
      setProgress(false);
      if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
        toast.error("Try claiming after sometime");
      } else {
        toast.error("Something went wrong try again later");
      }
      // toast.error(error.reason);
    }
  }

  async function unStake() {
    try {
      const toastId = toast.loading("Waiting for confirmation....");
      const config = await prepareWriteContract({
        address: CONTRACT,
        abi: stakeABI,
        functionName: "withdraw",
        args: [ethers.utils.parseUnits(input, 18)],
      });
      const data = writeContract(config);
      data
        .then(async (receipt) => {
          toast.remove(toastId);
          setProgress(true);
          let tc = toast.loading("Waiting for transaction to complete...");
          await receipt.wait(1);
          toast.remove(tc);
          setProgress(false);

          toast.success("Spicy Unstaked sucessfully!");
        })
        .catch((err) => {
          toast.remove(toastId);
          setProgress(false);
          console.log(err);
        });
    } catch (error) {
      toast.remove();
      setProgress(false);
      toast.error(error.reason);
    }
  }
  useEffect(() => {
    if (
      isApproved?.toString() <
      "115792089237316195423570985008687907853269984665"
    ) {
      setApproval(true);
    }
  }, [isConnected]);
  return (
    <div className="h-screen">
      <Toaster />
      <div className="container mx-auto max-w-[1280px] w-full px-6 h-full">
        <div className="flex justify-center items-center h-full">
          <div className="w-[450px] bg-white  full-shadow pt-4 px-6 pb-8 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col">
              <div className="flex items-center gap-6 h-12">
                <div
                  onClick={() => setActive("stake")}
                  className={`font-medium border-b-[2px] h-full ${
                    active == "stake" ? "border-accent" : "border-transparent"
                  } flex items-center justify-center`}
                >
                  Stake (120%) APY
                </div>
                <div
                  onClick={() => setActive("unstake")}
                  className={`font-medium border-b-[2px] h-full ${
                    active == "unstake" ? "border-accent" : "border-transparent"
                  } flex items-center justify-center`}
                >
                  Unstake
                </div>
              </div>
              <div className="w-[calc(100%+48px)] h-[1px] -ml-6 bg-[rgb(232,236,253)]" />
              <div className="flex items-center justify-between mt-4 font-medium">
                <div>Staking Status</div>
                <div
                  className={`${
                    isStakingLive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isStakingLive ? "Active" : "Not Active"}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 font-medium">
                <div>Total Staked</div>
                <div className="">
                  {parseFloat(totalStaked / 10 ** 18).toFixed(2)} SPICY
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 font-medium">
                <div>Total Earned</div>
                <div className="">
                  {parseFloat(totalEarned / 10 ** 18).toFixed(2)} SPICY
                </div>
              </div>

              <div className="my-6 relative flex flex-col">
                <div
                  onClick={() =>
                    setInput(
                      active == "stake"
                        ? data?.formatted
                        : totalStaked / 10 ** 18
                    )
                  }
                  className="ml-auto cursor-pointer  items-end border-b border-text  mb-2"
                >
                  Max{" "}
                  {active == "stake"
                    ? parseFloat(data?.formatted).toFixed(2)
                    : totalStaked / 10 ** 18}{" "}
                  SPICY
                </div>
                <input
                  value={input}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                      setInput(value);
                    }
                  }}
                  placeholder="0"
                  className="focus-visible:ring-[1px] h-20  focus-visible:outline-none focus-visible:ring-accent bg-[#F7F7FF] rounded-2xl  placeholder:text-accent-light text-right px-4 py-1 text-2xl w-full font-medium  text-text"
                />
              </div>

              {active == "stake" ? (
                <>
                  {" "}
                  {approval ? (
                    <button
                      disabled={progress}
                      onClick={() => handleApprove()}
                      target="_blank"
                      className="flex-1 text-center py-4 rounded-2xl text-accent   font-medium border border-accent"
                    >
                      Approve
                    </button>
                  ) : (
                    <>
                      {address ? (
                        <div className="flex gap-8 items-center">
                          <button
                            disabled={progress}
                            onClick={claimReward}
                            target="_blank"
                            className="disabled:bg-accent/20 disabled:text-accent-light flex-1 text-center py-4 rounded-2xl text-accent   font-medium border border-accent"
                          >
                            Claim Reward
                          </button>
                          <button
                            disabled={input == "0" || progress}
                            onClick={handleStake}
                            className="disabled:bg-accent/20 disabled:text-accent-light flex-1 py-4 rounded-2xl text-white font-medium bg-accent"
                          >
                            Stake
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-8 items-center justify-center">
                          <ConnectButton />
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <button
                  disabled={input == "0"}
                  onClick={unStake}
                  className="disabled:bg-accent/20 disabled:text-accent-light flex-1 py-4 rounded-2xl text-white font-medium bg-accent"
                >
                  Unstake
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default stake;
