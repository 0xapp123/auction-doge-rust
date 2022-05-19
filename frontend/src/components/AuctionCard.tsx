import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { getOpenAuctionState, ReclaimItemOpen } from "../contexts/transaction";
import { adminValidation, getNftMetaData, getTokenName } from "../contexts/utils";
import HashLoader from "react-spinners/HashLoader";
import { useRouter } from "next/router";
import moment from "moment";

export default function AuctionCard(props: {
    auctionId: string,
    updateState: Function,
    floor: number
}) {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    const [image, setImage] = useState("");
    const [tokenName, setTokenName] = useState<String | undefined>();
    const [nftMint, setNFTMint] = useState<String | undefined>();
    const [title, setTitle] = useState<String | undefined>();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [bidders, setBidders] = useState(0);
    const [winningBid, setWiningBid] = useState(0);
    const [isClosed, setIsClosed] = useState(false);
    const [floorPrice, setFloorPrice] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [tokenAmount, setTokenAmount] = useState(0);
    const wallet = useWallet();
    const getAuctionDetail = async () => {
        setLoading(true);
        const detail = await getOpenAuctionState(new PublicKey(props.auctionId))
        if (detail !== null) {
            if (detail?.mint !== undefined) {
                const uri = await getNftMetaData(detail?.mint)
                await fetch(uri)
                    .then(resp =>
                        resp.json()
                    ).then((json) => {
                        setImage(json.image)
                    })
            }
            const now = new Date().getTime();
            let start: any;
            let end: any;
            start = new Date(detail?.startTime.toNumber() * 1000)
            end = new Date(detail?.endTime.toNumber() * 1000)
            setStartTime(start)
            setEndTime(end)
            setTokenName(getTokenName(detail?.tokenMint.toBase58()));
            setIsClosed(end < now);
            setTitle(detail?.title);
            setWiningBid(detail.highestBid.toNumber());
            setFloorPrice(detail.bidFloor.toNumber());
            setTokenAmount(detail.tokenAmount.toNumber());
        }
        setLoading(false);
    }
    const handleReclaim = async () => {
        try {
            await ReclaimItemOpen(
                wallet,
                new PublicKey(props.auctionId),
                () => setButtonLoading(true),
                () => setButtonLoading(false),
                () => router.push("/auction")
            );
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAuctionDetail();
        if (wallet.publicKey !== null) {
            setIsAdmin(adminValidation(wallet.publicKey))
        }
        // eslint-disable-next-line
    }, [wallet.connected]);

    return (
        <div className="auction-card">
            {/* eslint-disable-next-line */}
            <img
                src={image}
                alt=""
                style={{ filter: `${isClosed ? "grayscale(1)" : "none"}` }}
            />
            <p className="card-title">{title}</p>
            {isClosed ?
                <div className="display-center flex-column" style={{ minHeight: 150 }}>
                    {winningBid > floorPrice ?
                        <>
                            <p className="card-winning-title ">Winning Bid</p>
                            <p className="card-winning">{winningBid / Math.pow(10, 6)}&nbsp;{tokenName}</p>
                        </>
                        :
                        <p style={{ fontSize: 20 }}>No bids</p>
                    }
                    <div className="auction-endtime">
                        {!loading &&
                            <p className="close-time">
                                AUCTION CLOSED
                            </p>
                        }
                    </div>
                    {winningBid > floorPrice &&
                        <button className="btn-primary" onClick={() => router.push(`auction/${props.auctionId}`)}>
                            View Winners
                        </button>
                    }
                    {
                        winningBid <= floorPrice && isAdmin && tokenAmount !== 0 &&
                        <button className="btn-primary claim-button" disabled={buttonLoading} onClick={() => handleReclaim()}>
                            {buttonLoading ?
                                <HashLoader size={20} color="#fff" />
                                :
                                <>Reclaim NFT</>
                            }
                        </button>
                    }
                </div>
                :
                <>
                    <p className="card-floor">Floor Price: <span>{props.floor}</span> {tokenName}</p>

                    {startTime !== undefined && !loading &&
                        new Date() < startTime ?
                        <p className="close-countdown" style={{ padding: '30px 0' }}>
                            Comming Soon
                        </p>
                        :
                        <>
                            <p style={{ marginTop: 10 }}>Start Time</p>
                            <p style={{ fontWeight: "bold", marginBottom: 20 }}>
                                {moment(startTime).format('DD/MM/YYYY HH:mm')}
                            </p>
                        </>
                    }
                    <button className="btn-primary" onClick={() => router.push(`auction/${props.auctionId}`)}>
                        View Auction
                    </button>
                </>
            }
        </div >

    )
}