const { poolPromise } = require("../DBconnection");
const sql = require("mssql");

// Create connection to database

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;
  var name = req.body.name;
  var phone = req.body.phone;
  var location = req.body.location;
  var deliveryDate = req.body.deliveryDate;
  var address = req.body.address;
  var quantity = req.body.quantity;

  try {
    const pool = await poolPromise;
    //console.log("holla");
    const request = pool.request();
    //console.log("hey");
    request.input("name", sql.VarChar, name);
    request.input("phone", sql.VarChar, phone);
    request.input("location", sql.VarChar, location);
    request.input("deliveryDate", sql.VarChar, deliveryDate);
    request.input("address", sql.VarChar, address);
    request.input("quantity", sql.Int, quantity);
    const sqlString =
      "INSERT INTO Orders VALUES(@name, @phone, @deliveryDate, @location, @address, @quantity, 'A')";

    await request.query(sqlString);

    //var final = query.recordset[1].OrderID;
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
