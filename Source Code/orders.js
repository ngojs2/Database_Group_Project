module.exports = function(){

    var express = require('express');
    var router = express.Router();

	// get CustomerID data
	function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customerID as id FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers  = results;
            complete();
        });
    }


     // Get Orders by Customer ID
     function getOrdersbyCustomerID(req, res, mysql, context, complete){
        var query = "SELECT o.orderID, c.customerID, c.customerID as id, o.orderStatus, o.orderDate, o.shippedDate, o.storeID, o.payment FROM Orders AS o INNER JOIN Customers AS c ON o.customerID = c.customerID WHERE c.customerID = ?";
        var inserts = [req.params.id]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.orders = results;
              complete();
          });
      }

      // get storeID data
	function getStoreID(res, mysql, context, complete){
        mysql.pool.query("SELECT storeID as store FROM Locations", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations  = results;
            complete();
        });
    }

     // Get Orders by Store ID
     function getOrdersbyStoreID(req, res, mysql, context, complete){
        var query = "SELECT o.orderID, o.customerID, o.orderStatus, o.orderDate, o.shippedDate, l.storeID, l.storeID as store, o.payment FROM Orders AS o INNER JOIN Locations AS l ON o.storeID = l.storeID WHERE l.storeID = ?";
		var inserts = [req.params.store]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.orders = results;
              complete();
          });
      }

    // get Orders data 
    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT orderID, customerID, orderStatus, orderDate, shippedDate, storeID, payment FROM Orders", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders = results;
            complete();
        });
    }

    // Display All Orders 
    router.get('/', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteOrder.js", "filterOrders.js"];
        var mysql = req.app.get('mysql');
        getOrders(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
		getStoreID(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('orders', context);
            }
        }
    });


    // Add new orders, then redirect to addDetails page to add items to the order
    router.post('/', function(req, res){
		console.log(req.body.customerID)
		console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders (customerID, orderStatus, orderDate, storeID, payment) VALUES (?,?,?,?,?)";
        var inserts = [req.body.customerID, req.body.orderStatus, req.body.orderDate, req.body.storeID, req.body.payment];
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


    // Filter orders by customerID
    router.get('/filter/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteOrder.js","filterOrders.js"];
        var mysql = req.app.get('mysql');
        getOrdersbyStoreID(req, res, mysql, context, complete);
        getStoreID(res, mysql, context, complete);
        getOrdersbyCustomerID(req, res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('orders', context);
            }
        }
    });

    
    // Filter orders by Store ID
    router.get('/filterstore/:store', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteOrder.js","filterOrders.js"];
        var mysql = req.app.get('mysql');
        getOrdersbyStoreID(req, res, mysql, context, complete);
        getStoreID(res, mysql, context, complete);
       // getOrdersbyCustomerID(req, res, mysql, context, complete);
       // getCustomers(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('orders', context);
            }
        }
    });
    

	// Retrieves a specific order for edits
    function getOrder(res, mysql, context, id, complete){
        var sql = "SELECT orderID as id, orderStatus, shippedDate, storeID, payment FROM Orders WHERE orderID = ?";
        var inserts = [id];
		console.log(id);
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.order = results[0];
            complete();
        });
    }

    // Display Edit Order Page
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateOrder.js"];
        var mysql = req.app.get('mysql');
        getOrder(res, mysql, context, req.params.id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-order', context);
            }
        }
    });


    // Update an Order
	router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Orders SET orderStatus=?, shippedDate=?, storeID=?, payment=? WHERE orderID=?";
        var inserts = [req.body.orderStatus, req.body.shippedDate, req.body.storeID, req.body.payment, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    // Delete an Order
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Orders WHERE orderID = ?";
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

 
    return router;
}();

