
module.exports = function(){

    var express = require('express');
    var router = express.Router();

    // get details data 
    function getDetails(res, mysql, context, id, complete)
    {
		
       var sql = "SELECT o.orderID as id, p.productID, d.quantity FROM Details AS d INNER JOIN Orders AS o ON d.orderID = o.orderID INNER JOIN Products as p ON d.productID = p.productID WHERE o.orderID = ? "
		
		var inserts = [id];
		console.log(id);
		mysql.pool.query(sql, inserts, function(error, results, fields)
		{
            if (error)
            {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.details = results;
			console.log(results);
            complete();

        });
    }
    
    // display the details for the selected order
    router.get('/:id', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = [""];
        var mysql = req.app.get('mysql');
        getDetails(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('details', context);
            }
        }
    });
	
	return router;

}();
