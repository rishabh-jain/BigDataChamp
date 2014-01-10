/* Gets the data on the basis of the date of the payload from item sold.*/

var cur = db.ItemSold.aggregate(
    { $project : 
        {
            "TimeStamp" : "$Payload.Timestamp", 
			"hh" :
				{
					"$hour" : "$Payload.Timestamp"
				},
			"mm" :
				{
					"$minute" : "$Payload.Timestamp"
				},
			"ss" :
				{
					"$second" : "$Payload.Timestamp"
				},
			"ms" :
				{
					"$millisecond" : "$Payload.Timestamp"
				},
			"ItemID" : "$Payload.Item.ItemID", 
            "ItemURL" : "$Payload.Item.ListingDetails.ViewItemURL", 
            "ItemCategory" : "$Payload.Item.PrimaryCategory.CategoryName", 
            "ItemQuantity" : "$Payload.Item.Quantity", 
            "BidCount" : "$Payload.Item.SellingStatus.BidCount", 
            "BuyerEmail" : "$Payload.Item.SellingStatus.HighBidder.Email", 
            "BuyerID" : "$Payload.Item.SellingStatus.HighBidder.UserID", 
            "QuantityPurchased" : "$Payload.Item.SellingStatus.QuantitySold", 
            "ItemTitle" : "$Payload.Item.Title", 
            "ItemSpecifics" : "$Payload.Item.ItemSpecifics" 
        }
    },
	{	$project :
		{
			"Date" : 
				{
					"$subtract" :
					[
						"$TimeStamp",
						{
							"$add" :
							[
								"$ms",      
                               {      
                                    "$multiply" : [      
                                         "$ss",      
                                         1000      
                                    ]      
                               },      
                               {      
                                    "$multiply" : [      
                                         "$mm",      
                                         60,      
                                         1000      
                                    ]      
                               },      
                               {      
                                    "$multiply" : [      
                                         "$hh",      
                                         60,      
                                         60,      
                                         1000      
                                    ]      
                               }      
							]
						}
					]
				},
			"TimeStamp" : 1,
			"ItemID" : 1, 
            "ItemURL" : 1, 
            "ItemCategory" : 1, 
            "ItemQuantity" : 1, 
            "BidCount" : 1, 
            "BuyerEmail" : 1, 
            "BuyerID" : 1, 
            "QuantityPurchased" : 1, 
            "ItemTitle" : 1, 
            "ItemSpecifics" : 1
		}
	
	},
     { $group : 
         { 
             _id : "$Date", 
             Items : 
               { 
                   $addToSet : 
                      { 
						 "ID" : "$ItemID", 
						 "Title" : "$ItemTitle", 
						 "TimeStamp" : "$TimeStamp", 
						 "URL" : "$ItemURL", 
						 "Category" : "$ItemCategory", 
						 "Quantity" : "$ItemQuantity", 
						 "BidCount" : "$BidCount", 
						 "QuantityPurchased" : "$QuantityPurchased", 
						 "Specifics" : "$ItemSpecifics",
						 "Buyer" : "$BuyerID",
						 "BuyerEmail" : "$BuyerEmail"
                       }
               }
         }
      } );

      print(cur.result);
      

/* Gets the data on the basis of the date of the payload from fixed price transaction.*/
var cur = db.FixedPriceTransaction.aggregate(
    { $project : 
        {
            "TimeStamp" : "$Payload.Timestamp",
			"hh" :
				{
					"$hour" : "$Payload.Timestamp"
				},
			"mm" :
				{
					"$minute" : "$Payload.Timestamp"
				},
			"ss" :
				{
					"$second" : "$Payload.Timestamp"
				},
			"ms" :
				{
					"$millisecond" : "$Payload.Timestamp"
				},
            "ItemID" : "$Payload.Item.ItemID", 
            "ItemURL" : "$Payload.Item.ListingDetails.ViewItemURL", 
            "ItemCategory" : "$Payload.Item.PrimaryCategory.CategoryName", 
            "ItemQuantity" : "$Payload.Item.Quantity", 
            "TransactionArray" : "$Payload.TransactionArray",
            "ItemTitle" : "$Payload.Item.Title", 
            "ItemSpecifics" : "$Payload.Item.ItemSpecifics" 
        }
     }, 
	 {	$project :
		{
			"Date" : 
				{
					"$subtract" :
					[
						"$TimeStamp",
						{
							"$add" :
							[
								"$ms",      
                               {      
                                    "$multiply" : [      
                                         "$ss",      
                                         1000      
                                    ]      
                               },      
                               {      
                                    "$multiply" : [      
                                         "$mm",      
                                         60,      
                                         1000      
                                    ]      
                               },      
                               {      
                                    "$multiply" : [      
                                         "$hh",      
                                         60,      
                                         60,      
                                         1000      
                                    ]      
                               }      
							]
						}
					]
				},
			"TimeStamp" : 1,
			"ItemID" : 1, 
            "ItemURL" : 1, 
            "ItemCategory" : 1, 
            "ItemQuantity" : 1, 
            "BidCount" : 1,
            "ItemTitle" : 1, 
            "ItemSpecifics" : 1,
			"TransactionArray" : 1
		}
	
	},
	
     {
       $unwind : "$TransactionArray"
     },
     { $group : 
         { 
             _id : "$Date",
             Items : 
               { 
                   $addToSet : 
                      { 
						 "ID" : "$ItemID", 
						 "Title" : "$ItemTitle", 
						 "TimeStamp" : "$TimeStamp", 
						 "URL" : "$ItemURL", 
						 "Category" : "$ItemCategory", 
						 "Quantity" : "$ItemQuantity",
						 "QuantityPurchased" : "$TransactionArray.QuantityPurchased", 
						 "Specifics" : "$ItemSpecifics",
						 "Buyer" : "$TransactionArray.Buyer.UserID", 
						 "Email" : "$TransactionArray.Buyer.Email"
                       }
               }
         }
      } );

      print(cur.result);
