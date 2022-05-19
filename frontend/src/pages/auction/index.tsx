import type { NextPage } from "next";
import AuctionList from "../../components/AuctionList";
import HeroBanner from "../../components/HeroBanner";
const AuctionPage: NextPage = () => {
    return (
        <main>
            <HeroBanner />
            <div className="page-tabs">
                <button className="tab">raffles</button>
                <button className="tab active">auctions</button>
            </div>
            <AuctionList />
        </main>
    )
}

export default AuctionPage
