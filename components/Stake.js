import Button from "components/Button";
import React, { useEffect, useState } from "react";
import { erc20ABI, prepareWriteContract, writeContract } from "@wagmi/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead, useBalance, useToken } from "wagmi";
import stakeABI from "abi/stakeABI.json";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";
const Stake = () => {
  const [active, setActive] = useState("stake");
  const [input, setInput] = useState("0");
  const [progress, setProgress] = useState(false);
  const [approval, setApproval] = useState(true);
  const CONTRACT = "0xsdas";
  const TOKEN_CONTRACT = "0xB86eB91dd2501cdf56Ca9fb121c38e842E4AEdf1";
  const { address, isConnected, isReconnecting, isConnecting, isDisconnected } =
    useAccount();
  const { data } = useBalance({
    address: address,
    token: TOKEN_CONTRACT,
    watch: true,
  });
  const { data: token } = useToken({
    address: TOKEN_CONTRACT,
  });

  // const { data: isStakingLive = false } = useContractRead({
  //   address: CONTRACT,
  //   abi: stakeABI,
  //   functionName: "isStakingLive",
  // });
  // const { data: totalSupply } = useContractRead({
  //   address: CONTRACT,
  //   abi: stakeABI,
  //   watch: true,
  //   functionName: "totalSupply",
  // });
  // const { data: totalStaked } = useContractRead({
  //   address: CONTRACT,
  //   abi: stakeABI,
  //   functionName: "amountStaked",
  //   args: [address ? address : ""],
  //   watch: true,
  // });
  // const { data: totalEarned } = useContractRead({
  //   address: CONTRACT,
  //   abi: stakeABI,
  //   functionName: "rewardsPaid",
  //   args: [address ? address : ""],
  //   watch: true,
  // });
  // const { data: pendingRewards } = useContractRead({
  //   address: CONTRACT,
  //   abi: stakeABI,
  //   functionName: "pendingRewards",
  //   args: [address ? address : ""],
  //   watch: true,
  // });
  const { data: isApproved } = useContractRead({
    address: TOKEN_CONTRACT,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, "0x"],
    watch: true,
  });
  // const { data: stakeTime } = useContractRead({
  //   address: CONTRACT,
  //   abi: stakeABI,
  //   functionName: "whenStaking",
  //   args: [address],
  // });

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
      });
  }

  async function handleStake() {
    try {
      const toastId = toast.loading("Waiting for confirmation....");
      const config = await prepareWriteContract({
        address: CONTRACT,
        abi: stakeABI,
        functionName: "stake",
        args: [ethers.utils.parseUnits(input.toString(), 18)],
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

          toast.success(`${token?.name} staked sucessfully!`);
        })
        .catch((err) => {
          toast.remove(toastId);
          console.log(err);
          setProgress(false);
        });
    } catch (error) {
      toast.remove();
      if (
        error.reason === "execution reverted: Can't claim less than zero tokens"
      ) {
        toast.error("Cooldown try after 1min!");
      } else {
        toast.error(error.reason.replace("execution reverted: ", ""));
      }

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

          toast.success(`${token?.name} reward claimed sucessfully!`);
        })
        .catch((err) => {
          toast.remove();
          setProgress(false);
          console.log(err.message);
        });
    } catch (error) {
      toast.remove();
      setProgress(false);

      if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
        toast.error("Try claiming after sometime");
      } else {
        toast.error("Something went wrong try again later");
      }
    }
  }

  async function unStake() {
    console.log(input);
    try {
      const toastId = toast.loading("Waiting for confirmation....");
      const config = await prepareWriteContract({
        address: CONTRACT,
        abi: stakeABI,
        functionName: "withdraw",
        args: [ethers.utils.parseUnits(input.toString(), 18)],
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

          toast.success(`${token?.name} Unstaked sucessfully!`);
        })
        .catch((err) => {
          toast.remove(toastId);
          setProgress(false);
          console.log(err, "errr");
        });
    } catch (error) {
      toast.remove();
      setProgress(false);
      console.log({ ...error });
      toast.error(error.reason.replace("execution reverted: ", ""));

      // console.log({ ...error }, error.reason, "errr");
    }
  }
  useEffect(() => {
    if (
      isApproved?.toString() < "11579208923731619542357098500868790785326998466"
    ) {
      setApproval(true);
    }
  }, [isConnected, isReconnecting, isConnecting, isDisconnected, address]);

  // function isPending() {
  //   // return false;
  //   if (pendingRewards) {
  //     let pendingValue = parseFloat(pendingRewards / 10 ** 18).toFixed(4);
  //     // let pendingValue = 0;
  //     let stakedValue = parseFloat(totalStaked / 10 ** 18).toFixed(4);
  //     // let stakedValue = 0;
  //     let percentage = (stakedValue * 0.1) / 100;
  //     console.log(
  //       parseFloat(pendingValue),
  //       percentage,
  //       parseFloat(pendingValue) > percentage
  //     );
  //     if (parseFloat(pendingValue) > percentage) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  // }
  return (
    <div className="container mx-auto max-w-[1280px] w-full px-6 h-full">
      <Toaster />

      <div className="flex justify-center items-center h-full ">
        <div className="w-[450px] bg-black/60 backdrop-blur-2xl text-white border border-white/20  full-shadow pt-4 px-6 pb-8 rounded-2xl relative overflow-hidden">
          <div className="relative z-10 text-center lg:text-2xl text-white mb-5 font-bold">
            GET 30% APY. STAKE YOUR BMICKEY CHAIN TOKENS
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-6 h-12">
              <div
                onClick={() => setActive("stake")}
                className={`font-medium border-b-[2px] h-full ${
                  active == "stake" ? "border-accent" : "border-transparent"
                } flex items-center justify-center`}
              >
                Stake
              </div>
              <div
                onClick={() => setActive("unstake")}
                className={`font-medium border-b-[2px] h-full ${
                  active == "unstake" ? "border-accent" : "border-transparent"
                } flex items-center justify-center`}
              >
                Withdraw
              </div>
            </div>
            <div className="w-[calc(100%+48px)] h-[1px] -ml-6 bg-[rgb(232,236,253)]" />
            {/* <div className="flex items-center justify-between mt-4 font-medium">
              <div>Staking Status</div>
              <div
                className={`${
                  isStakingLive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isStakingLive ? "Active" : "Not Active"}
              </div>
            </div> */}
            <div className="flex items-center justify-between mt-4 font-medium">
              <div>Total Staked</div>
              <div className="">
                {/* {totalSupply
                  ? parseFloat(totalSupply / 10 ** 18).toFixed(2)
                  : 0}{" "} */}
                0 BMICKEY
                {/* {token?.symbol} */}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 font-medium">
              <div> Staked</div>
              <div className="">
                {/* {totalStaked
                  ? parseFloat(totalStaked / 10 ** 18).toFixed(2)
                  : 0}{" "} */}
                0 BMICKEY
                {/* {token?.symbol} */}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 font-medium">
              <div> Claimed</div>
              <div className="">
                0 BMICKEY
                {/* {totalEarned
                  ? parseFloat(totalEarned / 10 ** 18).toFixed(4)
                  : 0}{" "}
                BMICKEY */}
                {/* {token?.symbol} */}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 font-medium">
              <div> Pending Rewards</div>
              <div className="">
                {/* {pendingRewards
                  ? parseFloat(pendingRewards / 10 ** 18).toFixed(4)
                  : 0}{" "}
                BMICKEY */}
                0 BMICKEY
                {/* {token?.symbol} */}
              </div>
            </div>

            <div className="my-6 relative flex flex-col">
              <div
                onClick={() =>
                  setInput(
                    active == "stake"
                      ? data?.formatted
                      : ethers.utils.formatEther(totalStaked)
                  )
                }
                className="ml-auto cursor-pointer  items-end border-b border-white  mb-2"
              >
                Max{" "}
                {active == "stake"
                  ? data
                    ? parseFloat(data?.formatted).toFixed(2)
                    : 0
                  : 0
                  ? parseFloat(totalStaked / 10 ** 18).toFixed(2)
                  : 0}{" "}
                BMICKEY
                {/* {token?.symbol} */}
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
                className="focus-visible:ring-[1px] h-20  focus-visible:outline-none focus-visible:ring-accent bg-black/80 rounded-2xl border border-accent placeholder:text-accent-light text-right px-4 py-1 text-2xl w-full font-medium  text-white"
              />
            </div>

            {active == "stake" ? (
              <>
                {" "}
                {approval ? (
                  <button
                    disabled={progress}
                    // onClick={() => handleApprove()}
                    target="_blank"
                    className="flex-1 text-center py-4 rounded-2xl text-accent  bg-black  font-medium border border-accent"
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
                        {isPending() && (
                          <button
                            disabled={input == "0" || progress}
                            onClick={handleStake}
                            className="disabled:bg-accent/20 disabled:text-accent-light border border-white flex-1 py-4 rounded-2xl text-white font-medium bg-black"
                          >
                            Stake
                          </button>
                        )}
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
              <div className="w-full">
                <button
                  disabled={parseInt(input) <= 0 || input == "" ? true : false}
                  onClick={unStake}
                  className="disabled:bg-accent/20 w-full disabled:text-accent-light flex-1 py-4 rounded-2xl text-white font-medium bg-black"
                >
                  Unstake
                </button>
                <div className="text-center mt-4">
                  ⚠️ Before unstake make sure to claim rewards |
                  <br />
                  Emergency Withdraw Fee: 10% | 30days Lock ⚠️
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
