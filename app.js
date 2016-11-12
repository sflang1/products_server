var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');  // Parsing the params from the body of a POST request
var fs = require('fs');                   // Reading files.
// For using jquery
var $= require('jQuery');


// Middleware configuration
app.use(bodyParser.json());   // Support JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));   // Support encoded bodies
app.use(express.static('public'));

// Helper functions
function getProductsFromCsv(callback){
  fs.readFile(path.join(__dirname+'/files/products.csv'), 'utf-8', function(err,data){
    products = [];
    if(err)
    {
      return console.log(err);
    }
    lines = data.split("\n");
    // Start from the second line, the first one contains codigo, nombre, precio
    for(i=1; i<lines.length;i++)
    {
      product = {};
      values = lines[i].split(", ");
      product["codigo"] = values[0];
      product["nombre"] = values[1];
      product["precio"] = values[2];
      if(product["codigo"]!='')
      {
        products.push(product);
      }
    }
    callback(products);
  });
}

// Routing
app.get("/", function(req, res){
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

io.on('connection', function(socket) {
  console.log("A user connected");
  socket.on("consultar_producto", function(codigo){
    var product_exists = false;
    products = getProductsFromCsv(function(products){
      for(i=0;i<products.length;i++)
      {
        product = products[i];
        if(product["codigo"]==codigo)
        {
          product_exists=true;
          break;
        }
      }
      if(product_exists)
      {
        console.log("El producto existe. Código: "+product["codigo"]+". Nombre: "+product["nombre"]+". Precio: "+product["precio"]);
        socket.emit("producto_consultado", true, product);
      }
      else
      {
        console.log("El producto no existe");
        socket.emit("producto_consultado", false, {});
      }
    });
  });
  socket.on("consultar_numero_productos", function(){
    getProductsFromCsv(function(products){
      socket.emit("consulta_numero_productos", (products.length));
    });
  });
  socket.on("consultar_precio_mayor_o_igual", function(precio){
    getProductsFromCsv(function(products){
      counter = 0;
      for(i=0;i<products.length;i++)
      {
        product = products[i];
        console.log("Resta: "+(product["precio"]-precio));
        if((product["precio"]-precio)>=0)
        {
          counter++;
        }
      }
      socket.emit("resultado_consulta_precio", counter);
    });
  });
});
// Initialize server
http.listen(3000, function(){
  console.log("App running on port 3000!")
});
