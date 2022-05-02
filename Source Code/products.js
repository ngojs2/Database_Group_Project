
module.exports = function(){

    var express = require('express');
    var router = express.Router();

    // Get data for products
    function getProducts(res, mysql, context, complete)
    {
        mysql.pool.query("SELECT p.productID, p.productName, p.price, p.brand, p.category, l.storeID FROM Products AS p INNER JOIN Locations AS l ON p.storeID = l.storeID", function(error, results, fields) 
        {
            if (error)
            {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
            
        });
    }


    // get location data
    function getLocations(res, mysql, context, complete)
    {
        mysql.pool.query("SELECT storeID as id FROM Locations", function(error, results, fields) 
        {
            if (error)
            {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
            
        });
    }


    // get products data by store id
    function getProductsbyStoreID(req, res, mysql, context, complete){
        var query = "SELECT p.productID, p.productName, p.price, p.brand, p.category, l.storeID, l.storeID as id FROM Products AS p INNER JOIN Locations AS l ON p.storeID = l.storeID WHERE l.storeID = ?";
        var inserts = [req.params.id]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.products = results;
              complete();
          });
      }

    // Display products
    router.get('/', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteProduct.js","filterProducts.js"];
        var mysql = req.app.get('mysql');
        getProducts(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('products', context);
            }
        }
    });

    // Add a new product
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Products (productName, price, brand, category, storeID) VALUES (?,?,?,?,?)";
        var inserts = [req.body.productName, req.body.price, req.body.brand, req.body.category, req.body.storeID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if (error)
            {
                res.write(JSON.stringify(error));
                res.end();
            }
            else{
                res.redirect('/products');
            }

        });
    });


    // Filter products by store
    router.get('/filter/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteProduct.js","filterProducts.js"];
        var mysql = req.app.get('mysql');
        getProductsbyStoreID(req,res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('products', context);
            }

        }
    });

    
	// get specific product
    function getProduct(res, mysql, context, id, complete){
        var sql = "SELECT productID as id, productName, price, brand, category, storeID FROM Products WHERE productID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product = results[0];
            complete();
        });
    }

    // Display update page
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateProduct.js"];
        var mysql = req.app.get('mysql');
        getProduct(res, mysql, context, req.params.id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-product', context);
            }
        }
    });


    // Update a product
	router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Products SET productName=?, price=?, brand=?, category=?, storeID=? WHERE productID=?";
        var inserts = [req.body.productName, req.body.price, req.body.brand, req.body.category, req.body.storeID, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    // Delete a product
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Products WHERE productID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
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
