import KSMIcon from "../assets/tokens/KSM.png";
import LKSMIcon from "../assets/tokens/LKSM.png";
import aUSDIcon from "../assets/tokens/AUSD.png";
import BNCIcon from "../assets/tokens/BNC.png";
import KARIcon from "../assets/tokens/KAR.png";
import KINTIcon from "../assets/tokens/KINT.png";
// import PHAIcon from "../assets/tokens/PHA.png";
import TAIIcon from "../assets/tokens/TAI.png";

export enum Chain {
  ACALA = 0,
  KARURA,
  MANDALA,
}

export interface Token {
  symbol: string;
  address: string;
  chains?: Chain[];
  img?: string;
}

export const tokens: Token[] = [
  {
    symbol: "ACA",
    address: "0x0000000000000000000100000000000000000000",
    chains: [Chain.ACALA],
  },
  {
    symbol: "aUSD",
    address: "0x0000000000000000000100000000000000000001",
    img: aUSDIcon,
    chains: [Chain.ACALA],
  },
  {
    symbol: "DOT",
    address: "0x0000000000000000000100000000000000000002",
    chains: [Chain.ACALA],
  },
  {
    symbol: "LDOT",
    address: "0x0000000000000000000100000000000000000003",
  },
  {
    symbol: "RENBTC",
    address: "0x0000000000000000000100000000000000000014",
  },
  {
    symbol: "CASH",
    address: "0x0000000000000000000100000000000000000015",
  },
  {
    symbol: "KAR",
    address: "0x0000000000000000000100000000000000000080",
    img: KARIcon,
    chains: [Chain.KARURA],
  },
  {
    symbol: "aUSD", //kUSD
    address: "0x0000000000000000000100000000000000000081",
    img: aUSDIcon,
    chains: [Chain.KARURA],
  },
  {
    symbol: "KSM",
    address: "0x0000000000000000000100000000000000000082",
    img: KSMIcon,
    chains: [Chain.KARURA],
  },
  {
    symbol: "LKSM",
    address: "0x0000000000000000000100000000000000000083",
    img: LKSMIcon,
    chains: [Chain.KARURA],
  },
  {
    symbol: "TAI",
    address: "0x0000000000000000000100000000000000000084",
    img: TAIIcon,
    chains: [Chain.KARURA],
  },
  {
    symbol: "BNC",
    address: "0x00000000000000000001000000000000000000a8",
    img: BNCIcon,
    chains: [Chain.KARURA],
  },
  {
    symbol: "vsKSM",
    address: "0x00000000000000000001000000000000000000A9",
  },
  {
    symbol: "PHA",
    address: "0x00000000000000000001000000000000000000Aa",
  },
  {
    symbol: "KINT",
    address: "0x00000000000000000001000000000000000000AB",
    img: KINTIcon,
    chains: [Chain.KARURA],
  },
  {
    symbol: "kBTC",
    address: "0x00000000000000000001000000000000000000aC",
  },
];
