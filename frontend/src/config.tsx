import { PublicKey } from "@solana/web3.js";
export const NETWORK = "mainnet-beta";
export const ADMINS = [
    {
        address: "CCMVDR6yTDTzGwZShkSq69S5Tw5q74H6ddL7boVP98YL"
    },
    {
        address: "6dWYBATRHmnqn73WwAVnWgUYPniB5HJt8vzXbdTcBJfJ"
    }
]
export const SPL_TOKENS = [
    {
        tokenName: "$JOINTS",
        token_mint: "7ftKSttU6yUAnWsWxpRP3LKdQNEto8V4KD9NuWttoVnV",
        decimal: 6
    },
]
export const API_URL = "https://auction-house-tau.vercel.app/api/"
export const PROGRAM_ID = "GQmahfpvoJQdR6GcRDy9X4yzGkMQLmA2UFE4GLTJK6HJ";
export const TREASURY_WALLET = new PublicKey("8MdXvWgNou9jRVturbfnt3egf1aP9p1AjL8wiJavti7F");
export const DECIMALS = 100;
export const PROJECT_ID = 0;