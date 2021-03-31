const { poolPromise } = require("../DBconnection");
const sql = require("mssql");

// Create connection to database

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var phone = req.body.phone;
  var role = req.body.role;
  var location = req.body.location;

  try {
    const pool = await poolPromise;
    //console.log("holla");
    const request = pool.request();
    //console.log("hey");
    request.input("name", sql.VarChar, name);
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);
    request.input("phone", sql.VarChar, phone);
    request.input("role", sql.VarChar, role);
    request.input("location", sql.VarChar, location);
    const sqlString =
      "INSERT INTO Employee VALUES(@name, @phone, @email, HASHBYTES('SHA2_256', @password), @role, @location)";

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
