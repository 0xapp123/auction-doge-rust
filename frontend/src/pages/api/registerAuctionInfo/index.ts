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

    if(req.method === "POST"){  
      try {
        var owner = req.body.owner as string;//req.body.cartId;
        var nft_mint = req.body.nft_mint as string;//req.body.cartId;
        var token_mint = req.body.token_mint as string;//req.body.cartId;
        var auctionTitle = req.body.auctionTitle as string;//req.body.cartId;
        var floor = parseInt(req.body.floor as string);//req.body.cartId;
        var increment = parseInt(req.body.increment as string);//req.body.cartId;
        var biddercap = parseInt(req.body.biddercap as string);//req.body.cartId;
        var startTime = req.body.startTime;//req.body.cartId;
        var endTime = req.body.endTime;//req.body.cartId;
        var amount = req.body.amount;//req.body.cartId;
        var auction_id = req.body.auction_id as string;//req.body.cartId;
    
        console.log(owner, nft_mint, token_mint, auctionTitle, floor, increment, biddercap, startTime, endTime, amount, auction_id);

        console.log(!owner, !nft_mint, !token_mint, !auctionTitle, !floor, !increment, !biddercap, !startTime, !endTime, !amount, !auction_id);
    
        if (!owner || !nft_mint || !token_mint || !auctionTitle || !floor || !increment || !biddercap || !startTime || !endTime || !amount || !auction_id) {
          res.send(JSON.stringify(-1));
          return;
        }
    
    
        let data = {
          auction_id: auction_id,
          owner: owner,
          nft_mint: nft_mint,
          token_mint: token_mint,
          auctionTitle: auctionTitle,
          floor: floor,
          increment: increment,
          biddercap: biddercap,
          startTime: startTime,
          endTime: endTime,
          amount: amount,
          createdTime: new Date().getTime(),
    
        }
        var result = new Result(data);
        await result.save();
    
        console.log("return data success for registerAuctionInfo")
        res.send(JSON.stringify(0));

      } catch (err) {

        console.log(`error occured when register auction info: ${err}`);
        res.send(JSON.stringify(-100));
        
      } 
    }

}

export default handler;
