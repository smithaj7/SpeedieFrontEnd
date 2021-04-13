//Create connection to SQL database
const { poolPromise } = require("./DBconnection");
const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  var statusCode = 200;

  //Parameters included in the API request
  var location = req.body.location;
  var orderNumber = req.body.orderNumber;
  var newStatus = req.body.newStatus;
  var filledBy = req.body.filledBy;
  var bottlesReturned = req.body.bottlesReturned;
  var quarts = req.body.quarts;
  var halfGals = req.body.halfGals;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    //Convert API parameters into SQL variables
    request.input("filledBy", sql.VarChar, filledBy);
    request.input("newStatus", sql.VarChar, newStatus);
    request.input("bottlesReturned", sql.Int, bottlesReturned);
    request.input("location", sql.VarChar, location);
    request.input("orderID", sql.Int, orderNumber);
    
    //Query to change that status of an outstanding order to a claimed one
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
    //Query to change that status of a claimed order to a closed one
    else {
      request.input("quarts", sql.Int, quarts);
      request.input("halfGals", sql.Int, halfGals);
      const sqlString =
          //Declare SQL variables
          "Declare @NewOrderID INT " +
          "Declare @CustomerPhone varchar(30) " +
          "Declare @DeliveryDT Date " +
          "DECLARE @EmployeeID INT " +

          //Find employee ID using the email parameter
          "SELECT @EmployeeID = (SELECT EmployeeID FROM Employee WHERE Email=@filledBy) " +
          "SELECT ROW_NUMBER() OVER(ORDER BY OrderID) AS RowNum,* " +
          "INTO #temp " +
          "FROM Orders " +
          "WHERE [Location] = @location " +
          "SELECT @NewOrderID = OrderID, @CustomerPhone = Phone_Number, @DeliveryDT = Delivery_Date  FROM #temp " +
          "WHERE RowNum = @orderID " +
          "UPDATE Orders SET Order_Status = @newStatus WHERE OrderID = @NewOrderID " +

          //Insert order record into order history table and delete the record from
          //the active orders table
          "INSERT INTO OrderHistory VALUES (@DeliveryDT, @CustomerPhone, @EmployeeID, @bottlesReturned) " +
          "DELETE FROM Orders WHERE OrderID = @NewOrderID  " +
          "UPDATE Inventory SET Quarts = Quarts - @quarts WHERE Location = @location " +
          "UPDATE Inventory SET HalfGals = HalfGals - @halfGals WHERE Location = @location"; 
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
