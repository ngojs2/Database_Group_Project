module.exports = function(){

    var express = require('express');
    var router = express.Router();

    // get Customers data 
    function getCustomers(res, mysql, context, complete)
    {
        mysql.pool.query("SELECT customerID, firstName, lastName, username, password, dateOfBirth, phoneNumber, email, street, city, state, zip, country FROM Customers", function(error, results, fields) 
        {
            if (error)
            {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    // get Customers based on search parameters first name
    function getCustomersBy(req, res, mysql, context, complete) {
        
        //sanitize the input as well as include the % character
         var query = "SELECT * FROM Customers WHERE Customers.firstName LIKE " + mysql.pool.escape(req.params.s + '%'); 
        console.log(query)
  
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.customers = results;
              complete();
          });
      }


    // get Customers based on search parameters last name
    function getCustomersByLastName(req, res, mysql, context, complete) {
        
        //sanitize the input as well as include the % character
         var query = "SELECT * FROM Customers WHERE Customers.lastName LIKE " + mysql.pool.escape(req.params.last + '%'); 
        console.log(query)
  
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.customers = results;
              complete();
          });
      }

    // Display All Customers 
    router.get('/', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteCustomer.js", "searchCustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }
        }
    });


    // Add new customers
    router.post('/', function(req, res){

		console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customers (firstName, lastName, username, password, dateOfBirth, phoneNumber, email, street, city, state, zip, country) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.body.dateOfBirth, req.body.phoneNumber, req.body.email, req.body.street, req.body.city, req.body.state, req.body.zip, req.body.country];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customers');
            }
        });
    });

    // Search a customer by first name
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteCustomer.js","searchCustomer.js"];
        context.css = ["/style.css"]
		var mysql = req.app.get('mysql');
        getCustomersBy(req, res, mysql, context, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }
        }
    });


    // Search a customer by last name
    router.get('/searchLast/:last', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteCustomer.js","searchCustomer.js"];
        context.css = ["/style.css"]
		var mysql = req.app.get('mysql');
        getCustomersByLastName(req, res, mysql, context, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }
        }
    });

	// Retrieves a specific customer for editing
    function getCustomer(res, mysql, context, id, complete){
        var sql = "SELECT customerID as id, firstName, lastName, phoneNumber, email FROM Customers WHERE customerID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0];
            complete();
        });
    }

    // Display Edit Customer Page
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateCustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, req.params.id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-customer', context);
            }
        }
    });


    // Update a Customer
	router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Customers SET firstName=?, lastName=?, phoneNumber=?, email=? WHERE customerID=?";
        var inserts = [req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.email, req.params.id];
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

    // Delete a Customer
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customers WHERE customerID = ?";
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


