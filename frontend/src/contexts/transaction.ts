import * as anchor from '@project-serum/anchor';
import { web3 } from "@project-serum/anchor";
import {
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    ParsedAccountData,
    AccountInfo,
    Connection,
    Transaction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { OpenAuction } from './type';
import { ADMINS, API_URL, NETWORK, PROGRAM_ID, TREASURY_WALLET } from '../config';
import { IDL } from './auction';
import { successAlert } from '../components/toastGroup';
import { WalletContextState } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Toast } from 'react-toastify/dist/components';

export const solConnection = new web3.Connection(web3.clusterApiUrl(NETWORK), "processed");
export const conn = new Connection("https://api.mainnet-beta.solana.com/");

export const CreateOpenAuction = async (
    wallet: WalletContextState,
    nft_mint: PublicKey,
    token_mint: PublicKey,
    auctionTitle: String,
    floor: number,
    increment: number,
    biddercap: number,
    startTime: number,
    endTime: number,
    amount: number,
    treasuryWallet: PublicKey,
    project_id: number,
    startLoading: Function,
    closeLoading: Function,
    routering: Function
) => {
    if (!wallet.publicKey) return;


    // if(ADMINS.findIndex((address)=> address.address == wallet.publicKey?.toBase58().toString())==-1){

    //     toast.error("Your not an admin", {
    //         position: "top-right",
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         theme: "colored"
    //     });

    //     return;

    // }

    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const owner = wallet.publicKey;

    if (owner === null) return;

    const [auctionAddress, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("open auction"), owner.toBytes(), Buffer.from(auctionTitle.slice(0, 32))],
        program.programId
    );

    try {

        if (
            (await conn.getRecentPerformanceSamples(1))[0].numTransactions / 60 <
            1400
        ) {
            toast.error("Solana TPS too low atm. Please try again later", {
                position: "top-center",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            })
            return;
        }

        let auctionAta = await getAssociatedTokenAccount(auctionAddress, nft_mint);
        let ownerAta = await getAssociatedTokenAccount(owner, nft_mint);

        let DECIMALS = await getDecimals(owner, token_mint);
        if (DECIMALS === null) return

        startLoading();

        const tx = await program.rpc.createOpenAuction(new anchor.BN(bump),
            auctionTitle,
            new anchor.BN(floor * DECIMALS),
            new anchor.BN(increment * DECIMALS),
            new anchor.BN(startTime),
            new anchor.BN(endTime),
            new anchor.BN(biddercap),
            new anchor.BN(amount),
            new anchor.BN(project_id),
            treasuryWallet, {
            accounts: {
                auction: auctionAddress,
                auctionAta: auctionAta,
                owner,
                ownerAta,
                mint: nft_mint,
                tokenMint: token_mint,
                tokenProgram: TOKEN_PROGRAM_ID,
                ataProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rentSysvar: SYSVAR_RENT_PUBKEY,
            },
            signers: [],
        });

        await solConnection.confirmTransaction(tx, "finalized");


        axios.post(`${API_URL}registerAuctionInfo`, {
            owner: wallet.publicKey?.toBase58(),
            nft_mint: nft_mint,
            token_mint: token_mint,
            auctionTitle: auctionTitle,
            floor: floor.toString(),
            increment: increment.toString(),
            biddercap: biddercap.toString(),
            startTime: startTime,
            endTime: endTime,
            amount: 1,
            auction_id: auctionAddress,
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        closeLoading();

        routering();

        successAlert("Your auction is created successfully");
    } catch (error) {
        console.log(error)
        closeLoading()
    }
    closeLoading()

}

export const CancelOpenAuction = async (
    wallet: WalletContextState,
    auctionAddress: PublicKey,
    startLoading: Function,
    closeLoading: Function,
    routering: Function
) => {

    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const owner = wallet.publicKey;

    try {

        startLoading();
        const tx = await program.rpc.cancelOpenAuction({
            accounts: {
                auction: auctionAddress,
                owner,
                systemProgram: SystemProgram.programId,
            },
            signers: [],
        });
        await solConnection.confirmTransaction(tx, "finalized");
        // await new Promise((resolve, reject) => {
        //     solConnection.onAccountChange(auctionAddress, (data: AccountInfo<Buffer> | null) => {
        //         if (!data) reject();
        //         resolve(true);
        //     });
        // });
        successAlert("Canceling is successful!");
        routering();
        closeLoading();
    } catch (error) {
        console.log(error);
        closeLoading();
    }
}

export const MakeOpenBid = async (
    wallet: WalletContextState,
    auctionAddress: PublicKey,
    amount: number,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function
) => {
    if (wallet.publicKey === null) return;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const bidder = wallet.publicKey
    try {

        let auctionState = await getOpenAuctionState(auctionAddress);
        if (auctionState === null) return
        let token_mint = auctionState.tokenMint;
        let DECIMALS = await getDecimals(bidder, token_mint);
        if (DECIMALS === null) return
        let auctionAta = await getAssociatedTokenAccount(auctionAddress, token_mint);
        let bidderAta = await getAssociatedTokenAccount(bidder, token_mint);

        startLoading();
        let transaction = new Transaction();

        if (await conn.getAccountInfo(auctionAta) == null)
            transaction.add(createAssociatedTokenAccountInstruction(auctionAta, wallet.publicKey, auctionAddress, token_mint))

        transaction.add(program.instruction.makeOpenBid(
            new anchor.BN(amount * DECIMALS), {
            accounts: {
                auction: auctionAddress,
                auctionAta: auctionAta,
                bidder,
                bidderAta,
                tokenMint: token_mint,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                ataProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                rentSysvar: SYSVAR_RENT_PUBKEY,
            },
            signers: [],
        }));

        let tx = await wallet.sendTransaction(transaction, conn);

        await solConnection.confirmTransaction(tx, "finalized");
        // await new Promise((resolve, reject) => {
        //     solConnection.onAccountChange(auctionAddress, (data: AccountInfo<Buffer> | null) => {
        //         if (!data) reject();
        //         resolve(true);
        //     });
        // });
        updatePage();
        successAlert("Bidding is successful!");
        closeLoading();

    } catch (error) {
        closeLoading();
        console.log(error)
    }

}

export const ReclaimOpenBid = async (
    wallet: WalletContextState,
    auctionAddress: PublicKey,
    startLoading: Function,
    closeLoading: Function,
    routering: Function
) => {
    if (wallet.publicKey === null) return;
    const bidder = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    try {

        let auctionState = await getOpenAuctionState(auctionAddress);
        if (auctionState === null) return
        let token_mint = auctionState.tokenMint;
        let auctionAta = await getAssociatedTokenAccount(auctionAddress, token_mint);
        let bidderAta = await getAssociatedTokenAccount(bidder, token_mint);

        startLoading();
        const tx = await program.rpc.reclaimOpenBid({
            accounts: {
                auction: auctionAddress,
                auctionAta: auctionAta,
                bidder,
                bidderAta,
                treasuryWallet: TREASURY_WALLET,
                tokenMint: token_mint,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            },
            signers: [],
        });
        await solConnection.confirmTransaction(tx, "finalized");

        // await new Promise((resolve, reject) => {
        //     solConnection.onAccountChange(auctionAddress, (data: AccountInfo<Buffer> | null) => {
        //         if (!data) reject();
        //         resolve(true);
        //     });
        // });
        successAlert("Reclaim Open bid successful!")
        routering();
        closeLoading();
    } catch (error) {
        console.log(error)
        closeLoading();
    }
}

export const WithdrawItemOpen = async (
    wallet: WalletContextState,
    auctionAddress: PublicKey,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function
) => {
    if (wallet.publicKey === null) return;
    const winner = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    try {
        let auctionState = await getOpenAuctionState(auctionAddress);
        if (auctionState === null) return;
        let nft_mint = auctionState.mint;
        let auctionAta = await getAssociatedTokenAccount(auctionAddress, nft_mint);
        let winnerAta = await getAssociatedTokenAccount(winner, nft_mint);


        startLoading();

        let transaction = new Transaction();

        if (await conn.getAccountInfo(winnerAta) == null)
            transaction.add(createAssociatedTokenAccountInstruction(winnerAta, winner, winner, nft_mint))

        transaction.add(program.instruction.withdrawItemOpen({
            accounts: {
                auction: auctionAddress,
                auctionAta: auctionAta,
                highestBidder: winner,
                highestBidderAta: winnerAta,
                mint: nft_mint,
                tokenProgram: TOKEN_PROGRAM_ID,
                ataProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rentSysvar: SYSVAR_RENT_PUBKEY,
            },
            signers: [],
        }));

        let tx = await wallet.sendTransaction(transaction, conn);

        await solConnection.confirmTransaction(tx, "finalized");
        // await new Promise((resolve, reject) => {
        //     solConnection.onAccountChange(auctionAddress, (data: AccountInfo<Buffer> | null) => {
        //         if (!data) reject();
        //         resolve(true);
        //     });
        // });
        successAlert("Claim NFT successful!")
        updatePage();
        closeLoading();
    } catch (error) {
        closeLoading();
        console.log(error);
    }
}

export const WithdrawWinningBidOpen = async (
    wallet: WalletContextState,
    auctionAddress: PublicKey,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function
) => {
    if (wallet.publicKey === null) return;
    const owner = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    try {
        let auctionState = await getOpenAuctionState(auctionAddress);
        if (auctionState === null) return;
        let token_mint = auctionState.tokenMint;
        let auctionAta = await getAssociatedTokenAccount(auctionAddress, token_mint);
        let ownerAta = await getAssociatedTokenAccount(owner, token_mint);

        startLoading();

        const tx = await program.rpc.withdrawWinningBidOpen({
            accounts: {
                auction: auctionAddress,
                owner,
                auctionAta,
                ownerAta,
                tokenMint: token_mint,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
            signers: [],
        });
        await solConnection.confirmTransaction(tx, "finalized");
        // await new Promise((resolve, reject) => {
        //     solConnection.onAccountChange(auctionAddress, (data: AccountInfo<Buffer> | null) => {
        //         if (!data) reject();
        //         resolve(true);
        //     });
        // });
        successAlert("Withdraw successful!")
        closeLoading();
        updatePage();
    } catch (error) {
        closeLoading();
        console.log(error)
    }

}

export const ReclaimItemOpen = async (
    wallet: WalletContextState,
    auctionAddress: PublicKey,
    startLoading: Function,
    closeLoading: Function,
    routering: Function,
) => {

    if (wallet.publicKey === null) return;
    const owner = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    try {

        if (
            (await conn.getRecentPerformanceSamples(1))[0].numTransactions / 60 <
            1400
        ) {
            toast.error("Solana TPS too low atm. Please try again later", {
                position: "top-center",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            })
            return;
        }

        let auctionState = await getOpenAuctionState(auctionAddress);
        if (auctionState === null) return;
        let nft_mint = auctionState.mint;
        let auctionAta = await getAssociatedTokenAccount(auctionAddress, nft_mint);
        let ownerAta = await getAssociatedTokenAccount(owner, nft_mint);


        startLoading();
        const tx = await program.rpc.reclaimItemOpen({
            accounts: {
                auction: auctionAddress,
                auctionAta,
                owner,
                ownerAta,
                mint: nft_mint,
                tokenProgram: TOKEN_PROGRAM_ID,
                ataProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rentSysvar: SYSVAR_RENT_PUBKEY,
            },
            signers: [],
        });

        await solConnection.confirmTransaction(tx, "finalized");

        routering();
        closeLoading();
    } catch (error) {
        console.log(error);
        closeLoading();
    }
}


export const getAuctionKey = async (
    nft_mint: PublicKey,
    bidderCap: number
): Promise<PublicKey | null> => {

    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    let poolAccounts = await solConnection.getParsedProgramAccounts(
        program.programId,
        {
            filters: [
                {
                    dataSize: 400 + 8 + 40 * bidderCap
                },
                {
                    memcmp: {
                        "offset": 40,
                        "bytes": nft_mint.toBase58()
                    }
                }
            ]
        }
    );

    if (poolAccounts.length !== 0) {
        let rentalKey = poolAccounts[0].pubkey;
        return rentalKey;
    } else {
        return null;
    }
}

export const getOpenAuctionState = async (
    auctionAddress: PublicKey
): Promise<OpenAuction | null> => {

    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    try {
        let auctionState = await program.account.openAuction.fetch(auctionAddress);
        return auctionState as OpenAuction;
    } catch {
        return null;
    }
}

export const getDecimals = async (owner: PublicKey, tokenMint: PublicKey): Promise<number | null> => {
    try {
        let ownerTokenAccount = await getAssociatedTokenAccount(owner, tokenMint);
        const tokenAccount = await solConnection.getParsedAccountInfo(ownerTokenAccount);
        let decimal = (tokenAccount.value?.data as ParsedAccountData).parsed.info.tokenAmount.decimals;
        let DECIMALS = Math.pow(10, decimal);
        return DECIMALS;
    } catch {
        return null;
    }
}

const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
}

export const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        if (walletAddress != owner) {
            const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
            response = await connection.getAccountInfo(userAccount);
            if (!response) {
                const createATAIx = createAssociatedTokenAccountInstruction(
                    userAccount,
                    walletAddress,
                    walletAddress,
                    mint,
                );
                instructions.push(createATAIx);
            }
        }
    }
    return {
        instructions,
        destinationAccounts,
    };
}

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}