import { PublicKey } from "@solana/web3.js";
import { web3 } from '@project-serum/anchor';
import { programs } from "@metaplex/js";
import { ADMINS, SPL_TOKENS } from "../config";

export const adminValidation = (address: PublicKey) => {
    let res = false;
    for (let item of ADMINS) {
        res = res || (item.address === address.toBase58())
    }
    return res
}

export const solConnection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));

export const getNftMetaData = async (nftMintPk: PublicKey) => {
    let { metadata: { Metadata } } = programs;
    let metadataAccount = await Metadata.getPDA(nftMintPk);
    const metadata = await Metadata.load(solConnection, metadataAccount);
    return metadata.data.data.uri;
}
export const getTokenName = (tokenMint: string) => {
    for (let item of SPL_TOKENS) {
        if (item.token_mint === tokenMint)
            return item.tokenName
    }
}

export const getTokenDecimal = (tokenMint: string) => {
    for (let item of SPL_TOKENS) {
        if (item.token_mint === tokenMint)
            return item.decimal
    }
}
