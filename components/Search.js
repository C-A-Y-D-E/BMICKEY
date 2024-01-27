import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { fetchToken } from "@wagmi/core";

const Search = ({ search, setSearch, selectCoin, pay, receive, text }) => {
  const defaultToken = [
    {
      name: "Binance",
      symbol: "BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png`,
    },
    {
      name: "Spicy",
      symbol: "spicy",
      address: "0xa0944dBAB172f1DD41e76D28929912Dff634e592",
      decimals: 18,
      logo: `/icons/spicy.svg`,
    },

    {
      name: "BUSD Token",
      symbol: "BUSD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      decimals: 18,
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png`,
    },
    {
      name: "BTCB Token",
      symbol: "BTCB",
      address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      decimals: 18,
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/logo.png`,
    },
    {
      name: "Ethereum Token",
      symbol: "ETH",
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      decimals: 18,
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png`,
    },
    {
      name: "Binance Pegged USD Coin",
      symbol: "USDC",
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      decimals: 18,
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png`,
    },
    {
      name: "413",
      symbol: "413",
      address: "0xd0959d536e3dc746c1f0e3981a2de41d585b67bf",
      decimals: 18,
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png`,
    },
    // {
    //   name: "Santa Shiba",
    //   symbol: "SSHIB",
    //   address: "0x43579b6270a1e845b52a3a7e1b31c1273102de49",
    //   decimals: 18,
    //   logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png`,
    // },

    // {
    //   name: "Dogecoin",
    //   symbol: "DOGE",
    //   address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    //   decimals: 18,
    // },
    // {
    //   name: "Shiba Inu",
    //   symbol: "SHIB",
    //   address: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D",
    //   decimals: 18,
    // },
  ];

  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(defaultToken);
  }, []);

  const handleSearch = async (search) => {
    let regex = /^0x[a-fA-F0-9]{40}$/g;

    if (regex.test(search)) {
      const token = await fetchToken({
        address: search,
      });
      setItems([token]);
    } else {
      let isAlready = defaultToken.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );

      setItems(isAlready);
    }
  };

  const handleSelectCoin = (data) => {
    selectCoin({
      name: data.symbol,
      address: data.address,
      amount: 0,
      symbol: data.symbol,
      decimals: data.decimals,
    });
    setSearch(false);
  };
  // useEffect(() => {
  //   async function getTokens() {
  //     const resp = await axios.get(
  //       "https://www.gemini.com/uniswap/manifest.json"
  //     );
  //     console.log(resp);
  //     setItems(resp?.data?.tokens);
  //   }
  //   getTokens();
  // }, []);
  return (
    <motion.div
      animate={{ top: search ? "0" : "100%" }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="flex flex-col bg-white absolute  top-full  h-full w-full inset-0 pt-6 px-6 pb-8"
    >
      <div className="flex items-center justify-between pb-4">
        <div className="font-medium">You {text}</div>
        <button
          onClick={() => {
            setItems(defaultToken);
            setSearch(false);
          }}
        >
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
      <div className="flex gap-4 items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          fill="none"
          viewBox="0 0 13 13"
        >
          <g fill="#0A1A5D" clip-path="url(#clip0)">
            <path d="M5.73 11.313a5.535 5.535 0 01-5.529-5.53A5.535 5.535 0 015.731.256c3.048 0 5.528 2.48 5.528 5.529a5.535 5.535 0 01-5.529 5.529zm0-9.479a3.954 3.954 0 00-3.95 3.95 3.954 3.954 0 003.95 3.949 3.954 3.954 0 003.95-3.95 3.954 3.954 0 00-3.95-3.949zM12.608 11.544l-1.89-1.89c-.325.418-.7.792-1.117 1.117l1.89 1.89a.788.788 0 001.117 0 .79.79 0 000-1.117z"></path>
          </g>
          <defs>
            <clipPath id="clip0">
              <path fill="#fff" d="M.201.255H12.84v12.638H.201V.255z"></path>
            </clipPath>
          </defs>
        </svg>
        <input
          placeholder="Search or paste any token"
          className=" w-full focus-visible:outline-none"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="border-b border-accent/20" />
      <div className="flex-1 flex overflow-hidden w-full ">
        <div className=" overflow-y-auto h-full  w-full pt-3 pb-8">
          {items.length >= 1 &&
            items.map((t) => {
              if (t.address == pay?.address) {
                return;
              }
              if (t.address == receive?.address) {
                return;
              }
              if (pay?.address == receive?.address) {
                return;
              }

              return (
                <div
                  key={t.address}
                  onClick={() => handleSelectCoin(t)}
                  className="flex items-center gap-4 py-3 hover:bg-accent/10 rounded-2xl px-3"
                >
                  <img className="w-8" src={t.logo} />
                  <div className="flex items-center gap-1 font-medium text-lg">
                    <span>{t.name}</span>
                    <span>-</span>
                    <span className="text-accent">{t.symbol}</span>
                  </div>
                </div>
              );
            })}
          {items.length == 0 && <NotFound />}
        </div>

        {/* <div className=" overflow-y-auto h-full  w-full pt-3 pb-8 ">
          <NotFound />
        </div> */}
      </div>
      <div
        className="h-8 absolute bottom-8 z-10 w-full"
        style={{
          background:
            "linear-gradient(rgba(255, 255, 255, 0.25) 0%, rgb(255, 255, 255) 100%)",
        }}
      />
    </motion.div>
  );
};

export default Search;

const NotFound = () => {
  return (
    <div className="flex items-center justify-center text-center gap-4 py-3 hover:bg-accent/10 rounded-2xl px-3">
      <div className="flex items-center gap-1 font-medium text-lg justify-center text-center">
        We can’t find this token
      </div>
    </div>
  );
};
