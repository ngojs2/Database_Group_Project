module.exports = function(){

    var express = require('express');
    var router = express.Router();

	
	// get Product ID and Product Name data
	function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT productID as id, productName FROM Products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products  = results;
            complete();
        });
    }

    // get Current Items data 
    function getItems(res, mysql, context, complete){
        mysql.pool.query("SELECT orderID, productID, quantity FROM Details WHERE orderID = (SELECT MAX(orderID) FROM Details)", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.details = results;
            complete();
        });
    }


    // Get ID of recently added Order  
    function getOrderID(res, mysql, context, complete){
		var temp = "SELECT MAX(orderID) as lastID FROM Orders";
        mysql.pool.query(temp, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.order_id = results[0].lastID;
            complete();
        });
    }

    // Display Add Details Page
    router.get('/', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteItem.js"];
        var mysql = req.app.get('mysql');
        getItems(res, mysql, context, complete);
       	getProducts(res,mysql,context,complete);
		getOrderID(res,mysql, context, complete);
		function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('addDetails', context);
            }
        }
    });


    // Display Add Details Page with current items
    router.get('/current', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteItem.js"];
        var mysql = req.app.get('mysql');
        getItems(res, mysql, context, complete);
       	getProducts(res,mysql,context,complete);
		getOrderID(res,mysql, context, complete);
		function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('addDetails', context);
            }
        }
    });


	// Add Items to Order
	router.post('/', function(req,res){
		console.log(req.body.orderID)
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Details (orderID, productID, quantity) VALUES (?,?,?)";
		var inserts = [req.body.orderID, req.body.productID, req.body.quantity];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/addDetails');
			}
		});
	});


    /*
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Details WHERE orderID = ? AND productID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })
	*/
 
    return router;
}();



