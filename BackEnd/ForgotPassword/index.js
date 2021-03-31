
const { poolPromise } = require("../DBconnection");
const sql = require("mssql");

// Create connection to database

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  var statusCode = 200;
  var email = req.body.email;
  var password = req.body.password;
  var resetStatus = "success";
  //var newPassword = req.body.newPassword;

  try {
  
    const pool = await poolPromise;
    const request = pool.request();
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);
    const sqlString = "SELECT EmployeeID FROM Employee WHERE email = @email"
    var query = await request.query(sqlString);
    if (query.recordset.length > 0){
        const sqlString2 = "UPDATE Employee SET password = HASHBYTES('SHA2_256', @password) WHERE email = @email"
        await request.query(sqlString2);
        //passwordReset = "Yes"
    }
    else{
      resetStatus = "invalid email";
    }
    
    

    //var final = query.recordset[1].OrderID;
  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  context.res = {
    body: {
      status: statusCode,
      ResetStatus: resetStatus,
      //PasswordReset: passwordReset,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
