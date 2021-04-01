// Create connection to SQL database
const { poolPromise } = require("./DBconnection");
const sql = require("mssql");


module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;

  //Parameters included in the API request
  var email = req.body.email;
  var password = req.body.password;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    //Convert API parameters into SQL variables
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);

    // SQL query text to determine if the entered username/password combination
    // matches an existing entry in the database. To protect users' password information,
    // we store hashed passwords and compare the hash of the user-entered password
    // for each login request. If the login request succeeds, we return the location and
    // role the user is bound to so their experience is catered to that location/role.
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

    //Variables to store the query results
    var loggedIn = query.recordset[0].LoggedIn;
    var location = query.recordset[0].Location;
    var role = query.recordset[0].Role;

  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  //Returns values that tell the system if the user logged in, and if logged in,
  // we also return the location and role pertaining to the user
  context.res = {
    body: {
      LoggedIn: loggedIn,
      Location: location,
      Role: role
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
