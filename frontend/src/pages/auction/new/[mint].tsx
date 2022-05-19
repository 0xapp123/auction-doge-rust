import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { getNftMetaData } from "../../../contexts/utils";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import { API_URL, PROJECT_ID, SPL_TOKENS, TREASURY_WALLET } from "../../../config";
import { CreateOpenAuction } from "../../../contexts/transaction";
import { toast } from "react-toastify";

export default function CreateNewAuctionPage(props: {
    startLoading: Function,
    closeLoading: Function
}) {
    const { startLoading, closeLoading } = props;
    const router = useRouter();
    const wallet = useWallet();
    const { mint } = router.query;
    const [nftMint, setNFTMint] = useState("");
    const [image, setImage] = useState("");
    const [nftName, setNftName] = useState("");
    const [nftDescription, setNftDescription] = useState("");

    const [tokenMint, setTokenMint] = useState(SPL_TOKENS[0].token_mint);

    const [title, setTitle] = useState("");
    const [floorPrice, setFloorPrice] = useState(0);
    const [minIncrease, setMinIncrease] = useState(0);
    const [startTime, setStartTime] = useState(moment(new Date()).format());
    const [endTime, setEndTime] = useState(moment(new Date()).format());
    const [bidderCap, setBidderCap] = useState(10);

    const [titleVal, setTitleVal] = useState(false);
    const [floorPriceVal, setFloorPriceVal] = useState(false);
    const [minIncreaseVal, setMinIncreaseVal] = useState(false);
    const [startTimeVal, setStartTimeVal] = useState(false);
    const [endTimeVal, setEndTimeVal] = useState(false);
    const [bidderCapVal, setBidderCapVal] = useState(false);

    const handleTitle = (e: any) => {
        setTitle(e.target.value);
        setTitleVal(false);
    };

    const handleToken = (event: SelectChangeEvent) => {
        setTokenMint(event.target.value as string);
    };

    const handleFloorPrice = (e: any) => {
        setFloorPrice(e.target.value);
        setFloorPriceVal(false);
    };

    // const handleBidderCap = (e: any) => {
    //     setBidderCap(e.target.value);
    //     setBidderCapVal(false);
    // };

    const handleStartTime = (e: any) => {
        setStartTime(e.target.value)
        setStartTimeVal(false);
    };

    const handleEndTime = (e: any) => {
        setEndTime(e.target.value)
        setEndTimeVal(false);
    }

    const getNFTdetail = async () => {
        if (mint !== undefined) {
            const uri = await getNftMetaData(new PublicKey(mint))
            try {
                await fetch(uri)
                    .then(resp =>
                        resp.json()
                    ).then((json) => {
                        setImage(json.image)
                        setNftName(json.name)
                        setNftDescription(json.description)
                    })
            } catch (e) {
                console.log(e);
            }
        }
        closeLoading();
    }

    const checkValidate = () => {
        if (title === "") {
            setTitleVal(true);
            return false;
        }
        if (floorPrice <= 0) {
            setFloorPriceVal(true);
            return false;
        }
        if (minIncrease <= 0) {
            setMinIncreaseVal(true);
            return false;
        }
        if (bidderCap <= 0) {
            setBidderCapVal(true);
            return false;
        }
        const now = new Date();
        if ((new Date(startTime)).getTime() <= now.getTime()) {
            setStartTimeVal(true);
            return false;
        }
        if ((new Date(endTime)).getTime() <= now.getTime()) {
            setEndTimeVal(true);
            return false
        }
        if ((new Date(endTime)).getTime() <= (new Date(startTime)).getTime()) {
            setEndTimeVal(true);
            return false
        }
        return true
    }

    const handleCreate = async () => {
        if (!checkValidate()) return
        try {
            await CreateOpenAuction(
                wallet,
                new PublicKey(nftMint),
                new PublicKey(tokenMint),
                title,
                floorPrice,
                minIncrease,
                bidderCap,
                (new Date(startTime)).getTime() / 1000,
                (new Date(endTime)).getTime() / 1000,
                1,
                TREASURY_WALLET,
                PROJECT_ID,
                () => startLoading(),
                () => closeLoading(),
                () => router.push("/auction")
            )
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        startLoading()
        getNFTdetail();
        // eslint-disable-next-line
    }, [wallet.connected])

    useEffect(() => {
        if (mint !== undefined && typeof mint === "string") {
            setNFTMint(mint);
        }
    }, [mint]);

    // let incNum = () => {

    //     if (Number(num.toFixed(1)) < 10) {
    //         setNum(Number((Number(num.toFixed(1)) + 0.1).toFixed(1)));
    //         handleMinInc(Number((Number(num.toFixed(1)) + 0.1).toFixed(1))*10);
    //     }else{
    //         setNum(10);
    //         handleMinInc(100);
    //     }

    // };

    // let decNum = () => {
    //     if (Number(num.toFixed(1)) > 0) {
    //         setNum(Number((Number(num.toFixed(1)) - 0.1).toFixed(1)));
    //         handleMinInc(Number((Number(num.toFixed(1)) - 0.1).toFixed(1))*10);
    //     }else{
    //         setNum(0);
    //         handleMinInc(0);
    //     }
    // }

    let handleMinIncrement = (e: any) => {

        setMinIncrease(Math.round(e.target.value));
        setMinIncreaseVal(false);

    }

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

                    <div className="create-panel">
                        <div className="row">
                            <div className="col-half">
                                <div className="form-control">
                                    <label>Title</label>
                                    <input
                                        value={title}
                                        onChange={handleTitle}
                                        placeholder="Please enter auction title"
                                    />
                                    {titleVal &&
                                        <p className="error-helper">Required fields!</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-half">
                                <div className="form-control">
                                    <label>Select SPL token</label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={tokenMint}
                                            onChange={handleToken}
                                        >
                                            {SPL_TOKENS.map((item, key) => (
                                                <MenuItem value={item.token_mint} key={key}>{item.tokenName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div className="col-half">
                                <div className="form-control">
                                    <label>Floor Price</label>
                                    <input
                                        value={floorPrice}
                                        onChange={handleFloorPrice}
                                        placeholder="Please enter the floor price"
                                    />
                                    {floorPriceVal &&
                                        <p className="error-helper">Required fields!</p>
                                    }
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="col-half">
                                <div className="form-control" style={{flexDirection:"row",justifyContent:"space-between"}}>
                                        <div style={{width:"-webkit-fill-available",paddingTop:"19px", paddingRight:"5px"}}>
                                            <button className="btn btn-outline-primary" type="button" onClick={decNum} style={{width: "-webkit-fill-available",height: "50px"}}>-</button>
                                        </div>
                                        <input type="text" className="form-control" value={num} />
                                        <div style={{width:"-webkit-fill-available",paddingTop:"19px",paddingLeft:"5px"}}>
                                            <button className="btn btn-outline-primary" type="button" onClick={incNum} style={{width: "-webkit-fill-available",height: "50px"}}>+</button>
                                        </div> 
                                    </div>
                            </div>
                        </div> */}
                        <div className="col-half">
                            <div className="form-control">
                                <label>Min Increment</label>
                                <input
                                    value={minIncrease}
                                    onChange={handleMinIncrement}
                                    placeholder="Please enter the min increment"
                                />
                                {!minIncrease &&
                                    <p className="error-helper">Required fields!</p>
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-half">
                                <div className="form-control">
                                    <label>Start Time</label>
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={handleStartTime}
                                        placeholder="Please choose start time"
                                    />
                                    {startTimeVal &&
                                        <p className="error-helper">Please select the correct date.</p>
                                    }
                                </div>
                            </div>
                            <div className="col-half">
                                <div className="form-control">
                                    <label>End time</label>
                                    <input
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={handleEndTime}
                                        placeholder="Please choose end time"
                                    />
                                    {endTimeVal &&
                                        <p className="error-helper">Please select the correct date.</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-half">
                                <button className="btn-create-aution mt-20" onClick={() => handleCreate()}>
                                    Create an auction
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
