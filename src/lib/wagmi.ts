import { fallback, http, webSocket, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected, baseAccount } from "wagmi/connectors";

/** Base Mainnet canonical block interval after the Denim upgrade (200ms). */
export const BASE_MAINNET_BLOCK_TIME_MS = 200;
export const BASE_MAINNET_CHAIN_ID = base.id;

const baseRpcUrl = import.meta.env.VITE_BASE_RPC_URL || "https://mainnet.base.org";
const baseWsUrl = import.meta.env.VITE_BASE_WS_URL;

const baseTransport = baseWsUrl
  ? fallback([webSocket(baseWsUrl), http(baseRpcUrl)])
  : http(baseRpcUrl);

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    baseAccount({
      appName: 'Meme Biome Keeper',
    }),
  ],
  transports: {
    [base.id]: baseTransport,
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
