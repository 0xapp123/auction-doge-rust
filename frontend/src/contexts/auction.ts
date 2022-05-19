export type Auctionhouse = {
  "version": "0.1.0",
  "name": "auctionhouse",
  "instructions": [
    {
      "name": "createOpenAuction",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ownerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rentSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "floor",
          "type": "u64"
        },
        {
          "name": "increment",
          "type": "u64"
        },
        {
          "name": "startTime",
          "type": "u64"
        },
        {
          "name": "endTime",
          "type": "u64"
        },
        {
          "name": "bidderCap",
          "type": "u64"
        },
        {
          "name": "tokenAmount",
          "type": "u64"
        },
        {
          "name": "projectId",
          "type": "u16"
        },
        {
          "name": "treasuryWallet",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "cancelOpenAuction",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "makeOpenBid",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bidder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bidderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rentSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "reclaimOpenBid",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bidder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bidderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawItemOpen",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "highestBidder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "highestBidderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rentSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawWinningBidOpen",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reclaimItemOpen",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ownerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rentSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "openAuction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "cancelled",
            "type": "bool"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "bidderCap",
            "type": "u64"
          },
          {
            "name": "bidders",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "bids",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "highestBidder",
            "type": "publicKey"
          },
          {
            "name": "highestBid",
            "type": "u64"
          },
          {
            "name": "bidFloor",
            "type": "u64"
          },
          {
            "name": "minBidIncrement",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "projectId",
            "type": "u16"
          },
          {
            "name": "treasuryWallet",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AuctionError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TitleOverflow"
          },
          {
            "name": "InvalidIncrement"
          },
          {
            "name": "InvalidStartTime"
          },
          {
            "name": "InvalidEndTime"
          },
          {
            "name": "InvalidBidFloor"
          },
          {
            "name": "InvalidRevealPeriod"
          },
          {
            "name": "InvalidTokenAmount"
          },
          {
            "name": "UnderBidFloor"
          },
          {
            "name": "InsufficientBid"
          },
          {
            "name": "AuctionCancelled"
          },
          {
            "name": "BidBeforeStart"
          },
          {
            "name": "BidAfterClose"
          },
          {
            "name": "BidderCapReached"
          },
          {
            "name": "OwnerCannotBid"
          },
          {
            "name": "AuctionNotOver"
          },
          {
            "name": "NotBidder"
          },
          {
            "name": "NoWinningBid"
          },
          {
            "name": "WinnerCannotWithdrawBid"
          },
          {
            "name": "AlreadyWithdrewBid"
          },
          {
            "name": "DuplicateSealedBid"
          },
          {
            "name": "MustSendSol"
          },
          {
            "name": "RevealPeriodOver"
          },
          {
            "name": "RevealPeriodNotOver"
          },
          {
            "name": "HashMismatch"
          },
          {
            "name": "CannotCancelRevealPeriod"
          },
          {
            "name": "CannotCancelAfterClose"
          },
          {
            "name": "InsufficientSol"
          },
          {
            "name": "InvalidAdmin"
          },
          {
            "name": "InvalidTreasuryAccount"
          }
        ]
      }
    }
  ]
};

export const IDL: Auctionhouse = {
  "version": "0.1.0",
  "name": "auctionhouse",
  "instructions": [
    {
      "name": "createOpenAuction",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ownerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rentSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "floor",
          "type": "u64"
        },
        {
          "name": "increment",
          "type": "u64"
        },
        {
          "name": "startTime",
          "type": "u64"
        },
        {
          "name": "endTime",
          "type": "u64"
        },
        {
          "name": "bidderCap",
          "type": "u64"
        },
        {
          "name": "tokenAmount",
          "type": "u64"
        },
        {
          "name": "projectId",
          "type": "u16"
        },
        {
          "name": "treasuryWallet",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "cancelOpenAuction",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "makeOpenBid",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bidder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bidderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rentSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "reclaimOpenBid",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bidder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bidderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawItemOpen",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "highestBidder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "highestBidderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rentSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawWinningBidOpen",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reclaimItemOpen",
      "accounts": [
        {
          "name": "auction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "auctionAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "ownerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rentSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "openAuction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "cancelled",
            "type": "bool"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "bidderCap",
            "type": "u64"
          },
          {
            "name": "bidders",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "bids",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "highestBidder",
            "type": "publicKey"
          },
          {
            "name": "highestBid",
            "type": "u64"
          },
          {
            "name": "bidFloor",
            "type": "u64"
          },
          {
            "name": "minBidIncrement",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "projectId",
            "type": "u16"
          },
          {
            "name": "treasuryWallet",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AuctionError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TitleOverflow"
          },
          {
            "name": "InvalidIncrement"
          },
          {
            "name": "InvalidStartTime"
          },
          {
            "name": "InvalidEndTime"
          },
          {
            "name": "InvalidBidFloor"
          },
          {
            "name": "InvalidRevealPeriod"
          },
          {
            "name": "InvalidTokenAmount"
          },
          {
            "name": "UnderBidFloor"
          },
          {
            "name": "InsufficientBid"
          },
          {
            "name": "AuctionCancelled"
          },
          {
            "name": "BidBeforeStart"
          },
          {
            "name": "BidAfterClose"
          },
          {
            "name": "BidderCapReached"
          },
          {
            "name": "OwnerCannotBid"
          },
          {
            "name": "AuctionNotOver"
          },
          {
            "name": "NotBidder"
          },
          {
            "name": "NoWinningBid"
          },
          {
            "name": "WinnerCannotWithdrawBid"
          },
          {
            "name": "AlreadyWithdrewBid"
          },
          {
            "name": "DuplicateSealedBid"
          },
          {
            "name": "MustSendSol"
          },
          {
            "name": "RevealPeriodOver"
          },
          {
            "name": "RevealPeriodNotOver"
          },
          {
            "name": "HashMismatch"
          },
          {
            "name": "CannotCancelRevealPeriod"
          },
          {
            "name": "CannotCancelAfterClose"
          },
          {
            "name": "InsufficientSol"
          },
          {
            "name": "InvalidAdmin"
          },
          {
            "name": "InvalidTreasuryAccount"
          }
        ]
      }
    }
  ]
};
