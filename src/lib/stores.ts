import { writable, derived, readable } from "svelte/store";
import { Signer as EthSigner, Contract } from "ethers";
import type MultiProvider from "./MultiProvider";
import DexABI from "../abis/DEX.json";
import ERC20Abi from "../abis/ERC20.json";
import { tokens, Chain } from "./tokens";
import type { Signer as BodhiSigner } from "@acala-network/bodhi";

const DEX_ADDRESS_MANDALA = "0x0000000000000000000000000000000000000804";
const CHAIN: any = Chain.MANDALA;

export const chain = readable(Chain.MANDALA);

export const provider = writable<MultiProvider | null>(null);

export const signer = writable<EthSigner | BodhiSigner | null>(null);

export const fromTokenAmount = writable("");
export const toTokenAmount = writable("");

const _fromToken =
  CHAIN === Chain.ACALA || CHAIN === Chain.MANDALA
    ? tokens.find((token) => token.symbol === "ACA")
    : tokens.find((token) => token.symbol === "KAR");

export const fromToken = writable(_fromToken);

const _toToken =
  CHAIN === Chain.ACALA || CHAIN === Chain.MANDALA
    ? tokens.find((token) => token.symbol === "aUSD")
    : tokens.find(
        (token) => token.symbol === "KAR" && token.chains.includes(Chain.KARURA)
      );

export const toToken = writable(_toToken);
export const stableToken = writable(_toToken);

export const transactionCount = writable(0);

export const fromTokenContract = derived(
  [fromToken, provider],
  ([$fromToken, $provider]) => {
    if ($provider) {
      return new Contract($fromToken.address, ERC20Abi, $provider.provider);
    } else {
      return null;
    }
  }
);

export const toTokenContract = derived(
  [toToken, provider],
  ([$toToken, $provider]) => {
    if ($provider) {
      return new Contract($toToken.address, ERC20Abi, $provider.provider);
    } else {
      return null;
    }
  }
);

export const dexContract = derived(
  [signer, provider],
  ([$signer, $provider]) => {
    if ($signer) {
      return new Contract(DEX_ADDRESS_MANDALA, DexABI, $signer);
    } else if ($provider) {
      return new Contract(DEX_ADDRESS_MANDALA, DexABI, $provider.provider);
    } else {
      return null;
    }
  }
);

export const slippage = writable(0.5);

export const ratio = writable<string | null>(null);
