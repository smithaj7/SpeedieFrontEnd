//Create connection to SQL database
const { poolPromise } = require("./DBconnection");
const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;

  //Parameters included in the API request
  var location = req.body.location;
  var searchText = req.body.searchText
  

  try {
    const pool = await poolPromise;
    const request = pool.request();

    //Convert location parameter into an SQL variable
    request.input("location", sql.VarChar, location);
    var sqlString;
    if (!searchText) {
      sqlString = "SELECT * FROM Orders WHERE Location = @location";
    } else {
      //Filters orders if user enters search bar text
      request.input("searchText", sql.VarChar, searchText);
      sqlString =
        "SELECT * FROM Orders WHERE Location = @location AND (Name LIKE @searchText + '%' OR Address LIKE @searchText + '%' OR Phone_Number LIKE @searchText + '%')";
    }

    var query = await request.query(sqlString);

    //Create lists to store column values from order information
    var orderID = [];
    var phones = [];
    var names = [];
    var addresses = [];
    var quantities = [];
    var locations = [];
    var deliveryDates = [];
    var orderStatuses = [];

    //Iterate through table rows and populate lists with column values
    var i = 0;
    for (i; i < query.recordset.length; i++) {
      orderID.push(query.recordset[i].OrderID);
      phones.push(query.recordset[i].Phone_Number);
      names.push(query.recordset[i].Name);
      addresses.push(query.recordset[i].Address);
      quantities.push(query.recordset[i].Quantity);
      locations.push(query.recordset[i].Location);
      orderStatuses.push(query.recordset[i].Order_Status);

      //Format the date
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
      
    }
    
  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  context.res = {

    //Return the lists associated with each column of the orders table
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
