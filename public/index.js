function emitConsultarProducto(event) {
  codigo = $("#consultar_producto").find("input[name=codigo]").val();
  socket.emit("consultar_producto", codigo);
  $("#consultar_producto").find("input[name=codigo]").val('');  // Reset the inpút
  // Reset the table
  $('#codigo_consultar_producto').html('');
  $('#nombre_consultar_producto').html('');
  $('#precio_consultar_producto').html('');
}

function emitConsultarNumeroProductos(){
    socket.emit("consultar_numero_productos");
    $('#resultado_numero').html('');
}

function emitConsultarPrecioMayorOIgual(event) {
  precio = $('#consultar_precio_mayor_o_igual').find("input[name=precio]").val();
  socket.emit("consultar_precio_mayor_o_igual", precio);
  $("#consultar_precio_mayor_o_igual").find("input[name=precio]").val('');  // Reset the inpút
  $('#resultado_consulta_precio').html('');
}


// Escuchar al evento producto consultado
socket.on("producto_consultado", function(exists, product){
  if(exists)
  {
    $('#codigo_consultar_producto').html(product["codigo"]);
    $('#nombre_consultar_producto').html(product["nombre"]);
    $('#precio_consultar_producto').html(product["precio"]);
  }
  else
  {
      $('#alert_message').html('El producto no existe');
  }
});

socket.on("consulta_numero_productos", function(numero){
  $('#resultado_numero').html(numero);
});

socket.on("resultado_consulta_precio", function(numero){
  $('#resultado_consulta_precio').html(numero);
});
