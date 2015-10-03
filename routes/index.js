
/*
 * GET home page.
 */

//var portNumber = "11427";
//var password = "deepblue";
//var endpoint = "pub-redis-11427.us-east-1-2.3.ec2.garantiadata.com";

var portNumber = "12514";
var password = "deepblue";
var endpoint = "pub-redis-12514.us-east-1-2.3.ec2.garantiadata.com";


var redis = require('redis');
var client = redis.createClient(portNumber, endpoint, { auth_pass: password });

//This is the function which will render the order details
exports.orders = function (req, res) {
   

    //client.on('connect', function () {
       

    //});
    
    client.smembers('orders', function (err, response) {
        if (response) {
            
            for (var i = 0; i < response.length; i++) {
                
                try {
                    response[i] = JSON.parse(response[i]);
                }
                    catch (error) {
                    response[i] = {};
                }
            }
        }
        res.render('orders', { page_title: "Orders", data: response });

    });
   
  
};

exports.addOrder = function (req, res) {
    
    var order = { "customer": "", "desc": "", "orderId": "", "status": "Sold", "uom": "", "weight": "" }
    res.render('saveOrder', { orderId: null, page_title: "Add new Order", data: order });
  
};

exports.saveOrder = function (req, res) {
    
    //This method uses POST
    //For getting the passed in values, we have to parse the json
    var input = JSON.parse(JSON.stringify(req.body));
    
    var id = input.Id;
   
    
    
    var customer = input.customer;
    var desc = input.desc;
    var orderId = input.orderId;
    var status = "Sold";
    var uom = input.uom;
    var weight = input.weight;
    
    var order = { "customer": customer, "desc": desc, "orderId": orderId, "status": status, "uom": uom, "weight": weight }
    
    //var redis = require('redis');
    //var client = redis.createClient(portNumber, endpoint, { auth_pass: password });


    //update
    if (id && id != "") {
        
        client.smembers('orders', function (err, response) {
            if (response) {
                
                var selectedOrder = response[id];
                
                client.srem("orders", selectedOrder, function (err, replay) {
                    
                    client.sadd('orders', JSON.stringify(order), function (err, response) {
                        if (response) {
                        }
                        res.redirect('/');
                    });

                });
                
            }
        });
    }
    //add     
    else {
        
        client.sadd('orders', JSON.stringify(order), function (err, response) {
            if (response) {
            }
            res.redirect('/');
        });
    }

   
  
};

exports.editOrder = function (req, res) {
    
    var orderId = req.params.id;
    
    //var redis = require('redis');
    //var client = redis.createClient(portNumber, endpoint, { auth_pass: password });
    
    client.smembers('orders', function (err, response) {
        if (response) {
            
            var selectedOrder = response[orderId];
            selectedOrder = JSON.parse(selectedOrder);
            
            res.render('saveOrder', { orderId: orderId, page_title: "Edit Order", data: selectedOrder });

        }
            

    });

};

exports.deleteOrder = function (req, res) {
    
    var orderId = req.params.id;
  
    //var redis = require('redis');
    //var client = redis.createClient(portNumber, endpoint, { auth_pass: password });
    
    client.smembers('orders', function (err, response) {
        if (response) {
            
            var selectedOrder = response[orderId];
            
            client.srem("orders", selectedOrder, function (err, replay) { 

            });
                
        }
        
        res.redirect('/');
            

    });

};

