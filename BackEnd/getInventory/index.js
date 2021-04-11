// Create connection to SQL database
const { poolPromise } = require("../DBconnection");
const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;

  //Parameters included in the API request
  var location = req.body.location;
  

  try {
    const pool = await poolPromise;
    const request = pool.request();

    //Convert API parameters into SQL variables
    request.input("location", sql.VarChar, location);

    // SQL query text to determine if the entered username/password combination
    // matches an existing entry in the database. To protect users' password information,
    // we store hashed passwords and compare the hash of the user-entered password
    // for each login request. If the login request succeeds, we return the location and
    // role the user is bound to so their experience is catered to that location/role.
    const sqlString = "SELECT * FROM Inventory WHERE location = @location"
    var query = await request.query(sqlString);

    console.log("Location: ", location)
    var quarts = query.recordset[0].Quarts;
    var halfGals = query.recordset[0].HalfGals;

    console.log("Quarts: ", quarts)
    console.log("Location: ", location)

  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  //Returns values that tell the system if the user logged in, and if logged in,
  // we also return the location and role pertaining to the user
  context.res = {
    body: {
      Quarts: quarts,
      HalfGals: halfGals,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
