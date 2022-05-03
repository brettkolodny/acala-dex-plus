import KSMIcon from "../assets/tokens/KSM.png";
import LKSMIcon from "../assets/tokens/LKSM.png";
import aUSDIcon from "../assets/tokens/aUSD.png";
import BNCIcon from "../assets/tokens/BNC.png";
import KARIcon from "../assets/tokens/KAR.png";
import KINTIcon from "../assets/tokens/KINT.png";
import PHAIcon from "../assets/tokens/PHA.png";
import TAIIcon from "../assets/tokens/TAI.png";
import ACAIcon from "../assets/tokens/ACA.png";
import DOTIcon from "../assets/tokens/DOT.svg";
import LDOTIcon from "../assets/tokens/LDOT.png";

export enum Chain {
  ACALA = 0,
  KARURA,
  MANDALA,
}

export interface Token {
  symbol: string;
  address: string;
  chains: Chain[];
  img?: string;
}

export const tokens: Token[] = [
  {
    symbol: "ACA",
    address: "0x0000000000000000000100000000000000000000",
    img: ACAIcon,
    chains: [Chain.ACALA, Chain.MANDALA],
  },
  {
    symbol: "aUSD",
    address: "0x0000000000000000000100000000000000000001",
    img: aUSDIcon,
    chains: [Chain.ACALA, Chain.MANDALA],
  },
  {
    symbol: "DOT",
    address: "0x0000000000000000000100000000000000000002",
    img: DOTIcon,
    chains: [Chain.ACALA, Chain.MANDALA],
  },
  {
    symbol: "LDOT",
    address: "0x0000000000000000000100000000000000000003",
    img: LDOTIcon,
    chains: [Chain.ACALA, Chain.MANDALA],
  },
  {
    symbol: "RENBTC",
    address: "0x0000000000000000000100000000000000000014",
    chains: [],
  },
  {
    symbol: "CASH",
    address: "0x0000000000000000000100000000000000000015",
    chains: [],
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
    chains: [Chain.KARURA, Chain.MANDALA],
  },
  {
    symbol: "LKSM",
    address: "0x0000000000000000000100000000000000000083",
    img: LKSMIcon,
    chains: [Chain.KARURA, Chain.MANDALA],
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
    chains: [],
  },
  {
    symbol: "vsKSM",
    address: "0x00000000000000000001000000000000000000A9",
    chains: [],
  },
  {
    symbol: "PHA",
    address: "0x00000000000000000001000000000000000000Aa",
    img: PHAIcon,
    chains: [],
  },
  {
    symbol: "KINT",
    address: "0x00000000000000000001000000000000000000AB",
    img: KINTIcon,
    chains: [],
  },
  {
    symbol: "kBTC",
    address: "0x00000000000000000001000000000000000000aC",
    chains: [],
  },
];
