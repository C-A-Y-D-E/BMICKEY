import axios from "axios";
import Stake from "components/Stake";

import Swap from "components/Swap";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();

  const {
    inputCurrency = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    outputCurrency = "0xa0944dBAB172f1DD41e76D28929912Dff634e592",
  } = router.query;

  // useEffect(() => {
  //   router.push(
  //     "/?inputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&outputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
  //   );
  // }, []);
  return (
    <div className="h-screen">
      <img
        src="/bg.webp"
        className="fixed min-h-full min-w-full object-cover z-[-1] object-bottom opacity-10"
      />
      {/* <Head>
        <title>Spicy Network</title>

        <meta property="og:title" content="Spicy Network" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="spicynetwork.io" />
        <meta
          property="og:description"
          content=" Spicy is a revolutionary crypto project that combines the power of decentralized finance (DeFi) with the convenience of a user-friendly platform. It offers a suite of features, including swap, staking, NFT marketplace and bridge."
        />
        <meta property="title" content="Spicy Network" />
        <meta property="type" content="website" />
        <meta property="image" content="/logo.png" />
        <meta property="url" content="bunnyking.io" />
        <meta
          property="description"
          content="Spicy is a revolutionary crypto project that combines the power of decentralized finance (DeFi) with the convenience of a user-friendly platform. It offers a suite of features, including swap, staking, NFT marketplace and bridge."
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head> */}
      {/* <div className="container mx-auto max-w-[1280px] w-full px-6 h-full">
        <div className="flex justify-center items-center h-full">
          <Swap inputCurrency={inputCurrency} outputCurrency={outputCurrency} />
        </div>
      </div> */}
     
      <Stake />
    </div>
  );
}
