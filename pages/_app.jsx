import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import Header from "components/Header";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bsc, bscTestnet,mainnet } from "wagmi/chains";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  metaMaskWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
const { chains, provider } = configureChains(
  [bsc],
  [infuraProvider({ apiKey: "3c4271aae2094738b266f6974fb89920" }), publicProvider()]
);

// const { connectors } = getDefaultWallets({
//   appName: "Spicy Swap",
//   chains,

// });
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains }),
      trustWallet({ chains }),
      metaMaskWallet({ chains }),
      coinbaseWallet({chains})
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <WagmiConfig client={wagmiClient} >
        <RainbowKitProvider chains={chains} initialChain={1} >
          <Header />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default MyApp;
