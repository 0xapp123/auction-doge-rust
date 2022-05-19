import mongoose from "mongoose";
var Schema = mongoose.Schema;

var ResultSchema = new Schema(
  {
    auction_id: {
      type: String,
      unique: true,
      required: true,
    },
    nft_mint: {
      type: String,
      required: true,
    },
    token_mint: {
      type: String,
      required: true,
    },
    auctionTitle: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    increment: {
      type: String,
      required: true,
    },
    biddercap: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "result",
  }
);

mongoose.models = {};

var Result = mongoose.model("Rarity", ResultSchema);

export default Result;
