const { poolPromise } = require("../DBconnection");
const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  var statusCode = 200;

  var location = req.body.Location;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    if (location != "") {
      request.input("location", sql.VarChar, location);
      var sqlString =
        "SELECT Employee_Name FROM Inventory WHERE location=@location";
    } else {
      var sqlString = "SELECT Employee_Name FROM Inventory";
    }
    var query = await request.query(sqlString);
    var names = [];
    var i = 0;

    for (i; i < query.recordset.length; i++) {
      names.push(query.recordset[i].Employee_Name);
    }
  } catch (err) {
    console.log(err);
    statusCode = 400;
  }

  context.res = {
    body: {
      status: statusCode,
      nameList: names,
    },

    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
