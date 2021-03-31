const { poolPromise } = require("./DBconnection");
const sql = require("mssql");

// Create connection to database

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;
  var email = req.body.email;
  var password = req.body.password;

  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);
    const sqlString =
      "IF EXISTS(SELECT * FROM Employee WHERE Email=@email AND password=HASHBYTES('SHA2_256', @password)) " +
      "BEGIN " +
      "SELECT Location,Role, LoggedIn = 'Yes' FROM Employee WHERE Email=@email and password=HASHBYTES('SHA2_256', @password)" +
      "END " +
      "ELSE " +
      "BEGIN " +
      "SELECT 'No' AS LoggedIn, Location='' " +
      "END ";
    var query = await request.query(sqlString);
    var loggedIn = query.recordset[0].LoggedIn;
    var location = query.recordset[0].Location;
    var role = query.recordset[0].Role;

  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  context.res = {
    body: {
      //status: statusCode,
      LoggedIn: loggedIn,
      Location: location,
      Role: role
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
