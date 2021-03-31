const accountSid = "AC5f15274869368d4f486ed2f45e9ff6aa";
const authToken = "ee0149c2c913d3be2674231b1e78735e";
const client = require("twilio")(accountSid, authToken);
const { poolPromise } = require("./DBconnection");
const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  var statusCode = 200;
  var location = req.body.location;
  var orderNumber = req.body.orderNumber;
  var newStatus = req.body.newStatus;
  var filledBy = req.body.filledBy;
  console.log("Location",location)
  console.log("Filled By ",filledBy)
  //var deliveryDT = req.body.deliveryDT;
  //var customerPhone = req.body.customerPhone;
  var bottlesReturned = req.body.bottlesReturned;
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input("filledBy", sql.VarChar, filledBy);
    request.input("newStatus", sql.VarChar, newStatus);
    //request.input("customerPhone", sql.NVarChar, customerPhone);
    request.input("bottlesReturned", sql.Int, bottlesReturned);
    request.input("location", sql.VarChar, location);
    request.input("orderID", sql.Int, orderNumber);
    
    //console.log("Filled: " + filledBy);
    if (newStatus == 'I'){
    const sqlString =
        "Declare @NewOrderID INT " +
        "SELECT ROW_NUMBER() OVER(ORDER BY OrderID) AS RowNum,* " +
        "INTO #temp " +
        "FROM Orders " +
        "WHERE [Location] = @location " +
        "SELECT @NewOrderID = OrderID FROM #temp " +
        "WHERE RowNum = @orderID " +
        "UPDATE Orders SET Order_Status = @newStatus WHERE OrderID = @NewOrderID ";
    await request.query(sqlString);
    }
    else {
      //request.input("deliveryDT", sql.Date, deliveryDT);
      const sqlString =
          "Declare @NewOrderID INT " +
          "Declare @CustomerPhone varchar(30) " +
          "Declare @DeliveryDT Date " +
          "DECLARE @EmployeeID INT " +
          "SELECT @EmployeeID = (SELECT EmployeeID FROM Employee WHERE Email=@filledBy) " +
          "SELECT ROW_NUMBER() OVER(ORDER BY OrderID) AS RowNum,* " +
          "INTO #temp " +
          "FROM Orders " +
          "WHERE [Location] = @location " +
          "SELECT @NewOrderID = OrderID, @CustomerPhone = Phone_Number, @DeliveryDT = Delivery_Date  FROM #temp " +
          "WHERE RowNum = @orderID " +
          "UPDATE Orders SET Order_Status = @newStatus WHERE OrderID = @NewOrderID " +

          "INSERT INTO OrderHistory VALUES (@DeliveryDT, @CustomerPhone, @EmployeeID, @bottlesReturned) " +
          "DELETE FROM Orders WHERE OrderID = @NewOrderID";
      await request.query(sqlString);
    }
    // request.input('location', sql.VarChar, location);
    // request.input('orderNumber', sql.Int, orderNumber);
    // const sqlString = "SELECT Max(OrderID) AS OrderID FROM (SELECT TOP (@orderNumber) orderID FROM Orders WHERE Location = @location AND Order_Status = 'A' ORDER BY OrderID) AS foo";
    // var result = await request.query(sqlString);
    // var orderID = result.recordset[0].OrderID;
    // request.input('orderID', sql.Int, orderID);
    // const sqlString2 = "UPDATE Orders SET Order_Status = 'I' WHERE OrderID = @orderID";
    // await request.query(sqlString2);

    // const sqlString3 = "SELECT Phone_Number FROM Orders WHERE OrderID = @orderID"
    // var result2 = await request.query(sqlString3);
    // var customerPhone = result2.recordset[0].Phone_Number;

    // client.messages
    // .create({
    //     body: 'Your driver is on the way',
    //     from:'+12055515154',
    //     to: customerPhone
    // })
  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  context.res = {
    body: {
      status: statusCode,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
