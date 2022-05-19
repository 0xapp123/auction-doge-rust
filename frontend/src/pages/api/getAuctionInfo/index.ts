import dbConnect from '../../../../utils/dbConnect';
import Result from '../../../../models/result';

dbConnect();

async function handler(req: any, res: any) {

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return res.status(200).end();
    }

    if (req.method === "POST") {
        try {
            var auction_id = req.body.auction_id as string;
            
            if (!auction_id) {
                res.send(JSON.stringify(-1));
                return;
            }

            var result = await Result.findOne({auction_id:auction_id})

            console.log(result, "return data for getAuctionInfo")
            res.send(JSON.stringify(result));
        } catch (err) {
            console.log(`error occured when responsing for get auction info: ${err}`);
            res.send(JSON.stringify(-100));
        }

    }

}

export default handler;
