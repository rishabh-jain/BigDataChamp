/*Gets payment data from 2 collections and dumps into PaymentData*/

var cur = db.AuctionCheckoutComplete.find({"Payload.TransactionArray.PaidTime" : {$ne : null}}, {"Payload.TransactionArray.Buyer.UserID" : 1, "Payload.TransactionArray.PaidTime" : 1, "Payload.TransactionArray.Buyer.BuyerInfo.ShippingAddress.Name" : 1});
var cur1 = db.FixedPriceTransaction.find({"Payload.TransactionArray.PaidTime" : {$ne : null}}, {"Payload.TransactionArray.Buyer.UserID" : 1, "Payload.TransactionArray.PaidTime" : 1, "Payload.TransactionArray.Buyer.BuyerInfo.ShippingAddress.Name" : 1});
print("From Auction Checkout Complete");
while(cur.hasNext())
{
    var doc = cur.next();
    var paymentDoc = { "BuyerID" : doc.Payload.TransactionArray[0].Buyer.UserID, "BuyerName" : doc.Payload.TransactionArray[0].Buyer.BuyerInfo.ShippingAddress.Name,"PaymentTime" : doc.Payload.TransactionArray[0].PaidTime};
    db.PaymentData.insert(paymentDoc);
    print("UserID : " + doc.Payload.TransactionArray[0].Buyer.UserID + "\tPayment Time : " + doc.Payload.TransactionArray[0].PaidTime);
}
print("From Fixed Price Transaction");
while(cur1.hasNext())
{
    var doc = cur1.next();
    var paymentDoc = { "BuyerID" : doc.Payload.TransactionArray[0].Buyer.UserID, "BuyerName" : doc.Payload.TransactionArray[0].Buyer.BuyerInfo.ShippingAddress.Name,"PaymentTime" : doc.Payload.TransactionArray[0].PaidTime};
    db.PaymentData.insert(paymentDoc);
    print("UserID : " + doc.Payload.TransactionArray[0].Buyer.UserID + "\tPayment Time : " + doc.Payload.TransactionArray[0].PaidTime);
}
