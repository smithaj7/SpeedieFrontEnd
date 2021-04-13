// Create connection to SQL database
const { poolPromise } = require("../DBconnection");
const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;

  //Parameters included in the API request
  var size = req.body.size;
  var amount = req.body.amount;
  var location = req.body.location;
  

  try {
    const pool = await poolPromise;
    const request = pool.request();

    console.log(location);
    console.log(amount);
    //Convert API parameters into SQL variables
    request.input("size", sql.VarChar, size);
    request.input("amount", sql.Int, amount);
    request.input("location", sql.VarChar, location);


    // SQL query text to determine if the entered username/password combination
    // matches an existing entry in the database. To protect users' password information,
    // we store hashed passwords and compare the hash of the user-entered password
    // for each login request. If the login request succeeds, we return the location and
    // role the user is bound to so their experience is catered to that location/role.
    var sqlString = "";
    if (size == "Quarts"){
        sqlString = "UPDATE Inventory SET Quarts = Quarts + @amount WHERE Location = @location"
    }
    else{
        sqlString = "UPDATE Inventory SET HalfGals = HalfGals + @amount WHERE Location = @location"
    }
    
    await request.query(sqlString);
    
    sqlString = "SELECT * FROM Inventory WHERE location = @location"
    var query = await request.query(sqlString);
    var numQuarts = query.recordset[0].Quarts;
    var numHalfGals = query.recordset[0].HalfGals;
    

    

  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  //Returns values that tell the system if the user logged in, and if logged in,
  // we also return the location and role pertaining to the user
  context.res = {
    body: {
      status: statusCode,
      Quarts: numQuarts,
      HalfGals: numHalfGals,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
