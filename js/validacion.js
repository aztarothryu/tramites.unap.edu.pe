
$("#form-buscar-token").submit(function(e){
  e.preventDefault();
  spinner.show();
  let token1 = $("#token1").val();
  let token2 = $("#token2").val();
  let token3 = $("#token3").val();

  $.ajax({
      type: "GET",
      dataType: "json",
      url:'validartoken/'+token1+'/'+token2+'/'+token3,
      headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success: function(data) {
        if (data.doc == null) {
          $("#embed").html('<h5>No se encontraron coincidencias Verifique los datos ingresados.</h5>');
        }else {
          $("#embed").html('<div class="embed-responsive embed-responsive-16by9" ><iframe class="embed-responsive-item" src="showvalidar/'+data.doc.pathbn+'" allowfullscreen></iframe></div>');
        }
        spinner.hide();
      },
      error: function(error) {
        spinner.hide();
      }
  });
});
