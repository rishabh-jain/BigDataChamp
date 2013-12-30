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