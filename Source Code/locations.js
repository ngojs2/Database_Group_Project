
module.exports = function(){

    var express = require('express');
    var router = express.Router();

    // get locations data 
    function getLocations(res, mysql, context, complete)
    {
        mysql.pool.query("SELECT storeID, street, city, state, zip, country, phoneNumber FROM Locations", function(error, results, fields) 
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

    // get location data by id
    function getLocationsByID(req, res, mysql, context, complete) {
        var query = "SELECT l.storeID, l.storeID as id, l.street, l.city, l.state, l.zip, l.country, l.phoneNumber FROM Locations AS l WHERE l.storeID = ?";
        var inserts = [req.params.id]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.locations = results;
              complete();
          });
      }

    // display the locations
    router.get('/', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteLocation.js","filterLocation.js"];
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('locations', context);
            }
        }
    });

    
    // Display Filtered location by ID
    router.get('/filter/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteLocation.js","filterLocation.js"];
        var mysql = req.app.get('mysql');
        getLocationsByID(req,res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('locations', context);
            }
        }
    });

    
    // add new locations
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Locations (street, city, state, zip, country, phoneNumber) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.street, req.body.city, req.body.state, req.body.zip, req.body.country, req.body.phoneNumber];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/locations');
            }
        });
    });

    // get specific location to update
    function getLocation(res, mysql, context, id, complete){
        var sql = "SELECT storeID as id, street, city, state, zip, country, phoneNumber FROM Locations WHERE storeID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.location = results[0];
            complete();
        });
    }

    // display update location page
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateLocation.js"];
        var mysql = req.app.get('mysql');
        getLocation(res, mysql, context, req.params.id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-location', context);
            }
        }

    });

    // update location
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Locations SET street=?, city=?, state=?, zip=?, country=?, phoneNumber=? WHERE storeID=?";
        var inserts = [req.body.street, req.body.city, req.body.state, req.body.zip, req.body.country, req.body.phoneNumber, req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    // Delete a location
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Locations WHERE storeID = ?";
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
