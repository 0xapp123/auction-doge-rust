import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import copy from "copy-to-clipboard";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import Countdown from "../../components/Countdown";
import { PastIcon } from "../../components/svgIcons";
import { errorAlertCenter } from "../../components/toastGroup";
import { ADMINS, API_URL } from "../../config";
import { CancelOpenAuction, getOpenAuctionState, MakeOpenBid, ReclaimItemOpen, ReclaimOpenBid, WithdrawItemOpen, WithdrawWinningBidOpen } from "../../contexts/transaction";
import { adminValidation, getNftMetaData, getTokenDecimal, getTokenName } from "../../contexts/utils";

export default function AuctionItemPage(props: {
    startLoading: Function,
    closeLoading: Function
}) {
    const { startLoading, closeLoading } = props;
    const router = useRouter();
    const { auctionId } = router.query;
    const wallet = useWallet();

    const [loading, setLoading] = useState(false);
    // const [buttonLoading, setButtonLoading] = useState(false);
    const [nftName, setNftName] = useState("");
    const [nftDescription, setNftDescription] = useState("");
    const [bidPrice, setBidPrice] = useState<any>()

    const [image, setImage] = useState("");
    const [tokenName, setTokenName] = useState<String | undefined>()
    const [nftMint, setNFTMint] = useState<String | undefined>()
    const [title, setTitle] = useState<String | undefined>()
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    // const [bidders, setBidders] = useState(0);
    const [winningBid, setWiningBid] = useState(0);
    const [isClosed, setIsClosed] = useState(false);
    const [floorPrice, setFloorPrice] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [minIncrement, setMinIncrement] = useState(0);
    const [highestBidder, setHighestBidder] = useState<PublicKey>();
    const [tokenDecimal, setTokenDecimal] = useState<number | undefined>();
    const [bidderCap, setBidderCap] = useState<number | undefined>();
    const [oldBids, setOldBids] = useState<number | undefined>();
    const [isLastBidder, setIsLastBidder] = useState(false);

    const [bidders, setBidders] = useState<any>();

    const [isClaimed, setIsClaimed] = useState(false);
    const [decimal, setDecimal] = useState(0);

    const getNFTdetail = async () => {
        if (auctionId === undefined) return
        setLoading(true);
        const detail = await getOpenAuctionState(new PublicKey(auctionId))

        axios.post(`${API_URL}getAuctionInfo`,
            { "auction_id": auctionId }
        )
            .then(function (response) {
                setFloorPrice(response.data.floor);
                setMinIncrement(response.data.increment);
            })
            .catch(function (error) {
                console.log(error);
            })
        if (detail !== null) {

            let bidderList = [];
            if (detail.bidders.length !== 0) {
                for (let i = 0; i < detail?.bidders.length; i++) {
                    bidderList.push({
                        address: detail.bidders[i].toBase58(),
                        bidPrice: detail.bids[i].toNumber()
                    })
                }
                bidderList.sort((a: any, b: any) => a.bidPrice - b.bidPrice);
                setBidders(bidderList)
            }
            if (detail?.mint !== undefined) {
                const uri = await getNftMetaData(detail?.mint)
                await fetch(uri)
                    .then(resp =>
                        resp.json()
                    ).then((json) => {
                        setImage(json.image);
                        setNftName(json.name);
                        setNFTMint(json.mint)
                        setNftDescription(json.description);
                    })
            }
            const now = new Date().getTime();
            let start: any;
            let end: any;
            start = new Date(detail?.startTime.toNumber() * 1000);
            end = new Date(detail?.endTime.toNumber() * 1000);
            if (end < now && detail.tokenAmount.toNumber() === 0 && detail.bids.length !== 0) {
                setIsClaimed(true);
            }
            setStartTime(start);
            setEndTime(end);
            setTokenName(getTokenName(detail?.tokenMint.toBase58()));
            setTokenDecimal(getTokenDecimal(detail?.tokenMint.toBase58()));
            setIsClosed(end < now);
            setTitle(detail?.title);
            setTokenAmount(detail.tokenAmount.toNumber());
            setHighestBidder(detail.highestBidder);
            setBidderCap(detail.bidderCap.toNumber());
            setOldBids(detail.bids.length);
            const decimal = getTokenDecimal(detail.tokenMint.toBase58());
            for (let item of detail.bidders) {
                if (item.toBase58() === wallet.publicKey?.toBase58())
                    setIsLastBidder(true);
            }
            if (decimal) {
                setBidPrice(floorPrice + minIncrement)
                setWiningBid(detail.highestBid.toNumber() / Math.pow(10, 6));
                setDecimal(decimal);
            }
        }
        setLoading(false);
    }

    const handleCancel = async () => {
        if (auctionId === undefined) return;
        try {
            await CancelOpenAuction(
                wallet,
                new PublicKey(auctionId),
                () => startLoading(),
                () => closeLoading(),
                () => router.push("/create-auction")
            )
        } catch (error) {

        }
    }

    const handleReclaimNFT = async () => {
        if (auctionId === undefined) return;
        try {
            await ReclaimItemOpen(
                wallet,
                new PublicKey(auctionId),
                () => startLoading(),
                () => closeLoading(),
                () => router.push("/auction")
            );
        } catch (error) {
            console.log(error)
        }
    }

    const handleReclaimBid = async () => {
        if (auctionId === undefined) return;
        try {
            await ReclaimOpenBid(
                wallet,
                new PublicKey(auctionId),
                () => startLoading(),
                () => closeLoading(),
                () => router.push("/auction")
            );
        } catch (error) {
            console.log(error)
        }
    }

    const handleClaimNFT = async () => {
        if (auctionId === undefined) return;
        try {
            await WithdrawItemOpen(
                wallet,
                new PublicKey(auctionId),
                () => startLoading(),
                () => closeLoading(),
                () => router.push("/auction")
            );
        } catch (error) {
            console.log(error)
        }
    }

    const handleWithdrawWinningBid = async () => {
        if (auctionId === undefined) return;
        try {
            await WithdrawWinningBidOpen(
                wallet,
                new PublicKey(auctionId),
                () => startLoading(),
                () => closeLoading(),
                () => router.push("/auction")
            );
        } catch (error) {
            console.log(error)
        }
    }

    const handleMakeBid = async () => {
        if (auctionId === undefined) return;
        if (bidPrice < winningBid + minIncrement) {
            errorAlertCenter(`The price must to be bigger than ${winningBid + minIncrement}`)
            return
        }
        if (bidPrice < floorPrice) {
            errorAlertCenter(`The price must to be bigger than floor price.`)
            return
        }
        if (bidderCap === undefined || oldBids === undefined) return
        if (oldBids > bidderCap - 1) {
            errorAlertCenter(`You can't bid`)
            return
        }
        try {
            await MakeOpenBid(
                wallet,
                new PublicKey(auctionId),
                bidPrice,
                () => startLoading(),
                () => closeLoading(),
                () => getNFTdetail()
            )
        } catch (error) {
            console.log(error)
        }
    }


    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = (text: string) => {
        copy(text);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    useEffect(() => {
        if (auctionId !== undefined)
            getNFTdetail();
        if (wallet.publicKey !== null) {
            setIsAdmin(adminValidation(wallet.publicKey))
        } else {
            setIsAdmin(false)
        }
        // eslint-disable-next-line
    }, [wallet.connected, router]);

    return (
        <main>
            <div className="container">
                <div className="create-content">
                    <div className="nft-info">
                        <div className="media">
                            {/* eslint-disable-next-line */}
                            <img
                                src={image}
                                alt=""
                            />
                        </div>
                        <div className="info-item">
                            <label>Name: </label>
                            <h2>{nftName}</h2>
                        </div>
                        <div className="info-item">
                            <label>Description: </label>
                            <p className="description">{nftDescription}</p>
                        </div>
                    </div>
                    {!isClaimed ?
                        <>
                            <div className="create-panel">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="auction-info-item">
                                            <h2>{title}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-half">
                                        <div className="auction-info-item">
                                            <label>Highest Bid</label>
                                            <p>{winningBid} {tokenName}</p>
                                        </div>
                                    </div>
                                    <div className="col-half">
                                        <div className="auction-info-item">
                                            <label>Bidder Cap</label>
                                            <p>{oldBids} / {bidderCap}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-half">
                                        <div className="auction-info-item">
                                            <label>Floor Price</label>
                                            <p>{floorPrice} {tokenName}</p>
                                        </div>
                                    </div>
                                    <div className="col-half">
                                        <div className="auction-info-item">
                                            <label>Min Increment</label>
                                            <p>{minIncrement} {tokenName}</p>
                                        </div>
                                    </div>
                                </div>

                                {startTime !== undefined && endTime !== undefined &&
                                    <>
                                        <div className="row">
                                            <div className="col-half">
                                                <div className="auction-info-item">
                                                    <label>Start time</label>
                                                    {new Date() < startTime ?
                                                        <p>
                                                            <Countdown endDateTime={startTime} upDatePage={() => getNFTdetail()} />
                                                        </p>
                                                        :
                                                        <p style={{ color: "#888", fontWeight: "bold" }}>
                                                            {moment(startTime).format('DD/MM/YYYY HH:mm')}
                                                        </p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-half">
                                                <div className="auction-info-item">
                                                    <label>End time</label>
                                                    {new Date() < endTime ?
                                                        <p>
                                                            <Countdown endDateTime={endTime} upDatePage={() => getNFTdetail()} />
                                                        </p>
                                                        :
                                                        <p style={{ color: "#888", fontWeight: "bold" }}>
                                                            closed
                                                        </p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            new Date() > startTime && new Date() < endTime &&
                                            <>
                                                <div className="row">
                                                    <div className="col-half">
                                                        <div className="form-control">
                                                            <label>Your bid ({tokenName})</label>
                                                            <input
                                                                value={bidPrice}
                                                                onChange={(e) => setBidPrice(e.target.value)}
                                                                placeholder="Please enter the bid price"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-half">
                                                        <button className="btn-create-aution mt-10" onClick={() => handleMakeBid()}>
                                                            Place Bid
                                                        </button>
                                                    </div>
                                                    {isLastBidder &&
                                                        <div className="col-half">
                                                            <button className="btn-cancel-aution mt-10" onClick={() => handleReclaimBid()}>
                                                                Reclaim Bid
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                            </>
                                        }
                                        {
                                            new Date() > endTime &&
                                            <div className="row">
                                                <div className="col-half">
                                                    {wallet.publicKey === highestBidder ?
                                                        <button className="btn-create-aution mt-10">
                                                            Claim NFT
                                                        </button>
                                                        :
                                                        (
                                                            (ADMINS.findIndex((address) => address.address == wallet.publicKey?.toBase58().toString()) != -1) ?
                                                                <button className="btn-create-aution mt-10" onClick={() => handleReclaimNFT()}>
                                                                    Reclaim NFT
                                                                </button>
                                                                :
                                                                <button className="btn-cancel-aution mt-10" onClick={() => handleReclaimBid()}>
                                                                    Reclaim bid
                                                                </button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {new Date() > endTime && highestBidder?.toBase58() === wallet.publicKey?.toBase58() &&
                                            <div className="row">
                                                <div className="col-half">
                                                    <button className="btn-create-aution mt-20" onClick={() => handleClaimNFT()}>
                                                        Claim NFT
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                        {
                                            new Date() < endTime && (ADMINS.findIndex((address) => address.address == wallet.publicKey?.toBase58().toString()) != -1) &&
                                            <div className="row">
                                                <div className="col-half">
                                                    <button className="btn-cancel-aution mt-20" onClick={() => handleCancel()}>
                                                        Cancel Auction
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        </>
                        :
                        <>
                            <div className="create-panel">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="auction-info-item">
                                            <h2>{title}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-half">
                                        <div className="auction-info-item">
                                            <label>Winning Bid</label>
                                            <p>{winningBid} {tokenName}</p>
                                        </div>
                                    </div>
                                    <div className="col-half">
                                        <div className="auction-info-item">
                                            <label>Bidder Cap</label>
                                            <p>{oldBids} / {bidderCap}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-half">
                                        <div className="auction-info-item">
                                            <label>Floor Price</label>
                                            <p>{floorPrice} {tokenName}</p>
                                        </div>
                                    </div>
                                    <div className="col-half">
                                        <div className="auction-info-item">
                                            <label>Min Increment</label>
                                            <p>{minIncrement} {tokenName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div style={{ paddingLeft: 20 }}>
                                        <div className="auction-info-item">
                                            <label>Winning bidder</label>
                                            {highestBidder?.toBase58() &&
                                                <p className="winner-address" onClick={() => handleCopy(highestBidder?.toBase58())}>
                                                    {highestBidder?.toBase58().slice(0, 8)}...{highestBidder?.toBase58().slice(-8)}
                                                    <span className="copy-icon">
                                                        {!isCopied ?
                                                            <PastIcon /> :
                                                            <span className="copied">copied!</span>
                                                        }
                                                    </span>
                                                </p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-half">
                                        <div className="auction-info-item">
                                            {(ADMINS.findIndex((address) => address.address == wallet.publicKey?.toBase58().toString()) != -1) &&
                                                <button className="btn-create-aution mt-20" onClick={() => handleWithdrawWinningBid()}>
                                                    Withdraw winning bid
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div style={{ paddingLeft: 20 }}>
                                        <div className="auction-info-item">
                                            <label>Bidder List</label>
                                            {bidders && bidders.map((item: any, key: number) => (
                                                <p className="winner-address" onClick={() => handleCopy(item.address)} key={key}>
                                                    {item.address.slice(0, 8)}...{item.address.slice(-8)}
                                                    <span className="copy-icon">
                                                        {!isCopied ?
                                                            <PastIcon /> :
                                                            <span className="copied">copied!</span>
                                                        }
                                                    </span>
                                                </p>
                                            ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </main>
    )
}