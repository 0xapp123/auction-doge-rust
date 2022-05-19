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

            var results = await Result.find({})
            console.log("data returned for getAllAuctionInfos")
            res.send(JSON.stringify(results));

          } catch (err) {

            console.log(`error occured for getting all auction infos: ${err}`);
            res.send(JSON.stringify(-100));

          }

    }

}

export default handler;
