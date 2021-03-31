//const accountSid = 'AC5f15274869368d4f486ed2f45e9ff6aa';
//const authToken = 'ee0149c2c913d3be2674231b1e78735e';
//const client = require('twilio')(accountSid, authToken);

const { poolPromise } = require("./DBconnection");
const sql = require("mssql");

// Create connection to database

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;
  var location = req.body.location;
  var searchText = req.body.searchText;
  console.log("Search", searchText)
  console.log("Location", location)
  //var orderStatus = req.body.orderStatus;

  try {
    const pool = await poolPromise;
    //console.log("holla");
    const request = pool.request();
    //console.log("hey");
    request.input("location", sql.VarChar, location);
    //request.input("orderStatus", sql.VarChar, orderStatus);
    var sqlString;
    if (location == "All" && !searchText) {
      sqlString = "SELECT * FROM Orders";
    } else if (location == "All") {
      request.input("searchText", sql.VarChar, searchText);
      sqlString =
        "SELECT * FROM Orders WHERE Name LIKE @searchText + '%' OR Address LIKE @searchText + '%' OR Phone_Number LIKE @searchText + '%'";
    } else if (!searchText) {
      sqlString =
        "SELECT * FROM Orders WHERE Location = @location";
    } else {
      request.input("searchText", sql.VarChar, searchText);
      sqlString =
        "SELECT * FROM Orders WHERE Location = @location AND (Name LIKE @searchText + '%' OR Address LIKE @searchText + '%' OR Phone_Number LIKE @searchText + '%')";
    }
    var query = await request.query(sqlString);
    var orderID = [];
    var phones = [];
    var names = [];
    var addresses = [];
    var quantities = [];
    var locations = [];
    var deliveryDates = [];
    var orderStatuses = [];
    var i = 0;

    for (i; i < query.recordset.length; i++) {
      orderID.push(query.recordset[i].OrderID);
      phones.push(query.recordset[i].Phone_Number);
      names.push(query.recordset[i].Name);
      addresses.push(query.recordset[i].Address);
      quantities.push(query.recordset[i].Quantity);
      locations.push(query.recordset[i].Location);
      orderStatuses.push(query.recordset[i].Order_Status);
      if (query.recordset[i].Delivery_Date != null) {
        var day = query.recordset[i].Delivery_Date;
        deliveryDates.push(
          day.getMonth() +
            1 +
            "-" +
            (day.getDate() + 1) +
            "-" +
            day.getFullYear()
        );
      } else {
        deliveryDates.push(query.recordset[i].Delivery_Date);
      }
      

      //console.log(query.recordset[i].OrderID);
    }
    console.log("Names: ", names)
    //var final = query.recordset[1].OrderID;
  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  context.res = {
    body: {
      status: statusCode,
      result: orderID,
      phoneNumbers: phones,
      names: names,
      addresses: addresses,
      quantities: quantities,
      locations: locations,
      deliveryDates: deliveryDates,
      orderStatuses: orderStatuses
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
