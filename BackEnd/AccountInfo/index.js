
const { poolPromise } = require("../DBconnection");
const sql = require("mssql");

// Create connection to database

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;
  var email = req.body.email;
  

  try {
    
    const pool = await poolPromise;
    const request = pool.request();
    request.input("email", sql.VarChar, email);
    const sqlString = "EXEC sp_getAccountInfo @email";
    var query = await request.query(sqlString);
    ordersTaken = query.recordset[0].OrdersTaken;
    bottlesReturned = query.recordset[0].BottlesReturned;
    location = query.recordset[0].Location;
    console.log(ordersTaken);
    console.log(bottlesReturned);
    console.log(location);
    

    //var final = query.recordset[1].OrderID;
  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  context.res = {
    body: {
      status: statusCode,
      OrdersTaken: ordersTaken,
      BottlesReturned: bottlesReturned,
      Location: location,
      //PasswordReset: passwordReset,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
