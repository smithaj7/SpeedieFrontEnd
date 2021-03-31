const {poolPromise} = require('./DBconnection');
const sql = require("mssql");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var statusCode = 200;
    var employeePhone = req.body.number;
    try{
        
        
        const pool = await poolPromise;
        const request = pool.request();
        request.input('employeePhone', sql.VarChar, employeePhone);
        const sqlString = "SELECT * FROM Employee WHERE Phone_Number = @employeePhone";
        var query = await request.query(sqlString);
        var employeeLocation = query.recordset[0].Location;
        request.input('employeeLocation', sql.VarChar, employeeLocation);
        var sqlString2 = "SELECT * FROM Orders  WHERE Location = @employeeLocation";
        var query2 = await request.query(sqlString2);
        var names = query2.recordset[0].Name;

        names = "";
        var i;
        for(i=0; i < query2.recordset.length; i++){
            names += '#' + (i+1) + ': ';
            names += query2.recordset[i].Name + "\n";
            
        }

     

    }
    catch (err){
        console.log(err)
        statusCode = 400;
    }


    context.res = {
        body: {
            status: statusCode,  
            result: names

        }

    }
};