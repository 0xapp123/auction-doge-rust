import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import AuctionCard from "./AuctionCard";

export default function AuctionList() {
    const [auctionList, setAuctionList] = useState<any>();
    const getAuctionList = () => {
        axios.post(`${API_URL}getAllAuctionInfos`)
            .then(function (response) {
                const res = response.data;
                res.sort((a: any, b: any) => a.createdTime - b.createdTime);
                setAuctionList(res);
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    useEffect(() => {
        getAuctionList()
    }, [])
    return (
        <div className="container">
            <div className="auction-list">
                {auctionList && auctionList.length !== 0 &&
                    auctionList.reverse().map((item: any, key: number) => (
                        <AuctionCard
                            auctionId={item.auction_id}
                            updateState={() => getAuctionList()}
                            floor={item.floor}
                            key={key}
                        />
                    ))
                }
            </div>
        </div>
    )
}