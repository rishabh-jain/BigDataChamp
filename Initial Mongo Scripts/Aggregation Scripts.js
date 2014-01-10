/* Aggregate all the items from various categories */
db.ItemEntityWithDescription.aggregate([
	{ $project : { category : "$Item.PrimaryCategory.CategoryName", itemCode : "$ItemCode" } }, { $group : { _id : "$category", count : { $sum : 1} } }
	])

// date variable in js is 0-indexed
var startDate = new Date(2013, 7, 24); // 25th August 2013
var endDate = new Date(2013, 7, 25); // 26th August 2013

db.ItemEntityWithDescription.aggregate([
	{ $match : { Item.ListingDetails.StartTime : { $gte : startDate, $lt : endDate } } } ])

// or

db.ItemEntityWithDescription.aggregate([
	{ $match : { Item.ListingDetails.StartTime : { $gte : ISODate("2013-08-25T00:00:00.000Z"), $lt : ISODate("2013-08-26T00:00:00.000Z") } } } ])



/* Aggregate and get all the Titles of the various orders by a particular buyer*/
db.OrderEntity.aggregate([
	{ $project : { BuyerID : "$Order.BuyerUserID", ItemArray : "$Order.TransactionArray", CityName : "$Order.ShippingAddress.CityName", StateName : "$Order.ShippingAddress.StateOrProvince", Country : "$Order.ShippingAddress.CountryName" } }, { $unwind : "$ItemArray" }, { $group : { _id : "$BuyerID", items : { $addToSet : "$ItemArray.Item.Title" } } } ])



/* Aggregate and get the data based on user id from item sold.*/
var cur = db.ItemSold.aggregate(
    { $project : 
        {
            "TimeStamp" : "$Payload.TimeStamp", 
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
     { $group : 
         { 
             _id : "$BuyerID", 
             Email : { $first :  "$BuyerEmail" }, 
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
						 "Specifics" : "$ItemSpecifics"
                       }
               }
         }
      } );

      print(cur.result);
	  


/* Aggregate and get the data based on user id from fixed price transaction.*/
var cur = db.FixedPriceTransaction.aggregate(
    { $project : 
        {
            "TimeStamp" : "$Payload.TimeStamp", 
            "ItemID" : "$Payload.Item.ItemID", 
            "ItemURL" : "$Payload.Item.ListingDetails.ViewItemURL", 
            "ItemCategory" : "$Payload.Item.PrimaryCategory.CategoryName", 
            "ItemQuantity" : "$Payload.Item.Quantity", 
            "TransactionArray" : "$Payload.TransactionArray",
            "ItemTitle" : "$Payload.Item.Title", 
            "ItemSpecifics" : "$Payload.Item.ItemSpecifics" 
        }
     }, 
     {
       $unwind : "$TransactionArray"
     },
     { $group : 
         { 
             _id : "$TransactionArray.Buyer.UserID", 
             Email : { $first : "$TransactionArray.Buyer.Email" }, 
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
						 "Specifics" : "$ItemSpecifics"
                       }
               }
         }
      } );

      print(cur.result);
	  
	  
	  
	  
	  
