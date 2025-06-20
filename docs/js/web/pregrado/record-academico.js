
$(document).ready(function(){
    var mvoucher = 2;
    var ejemplares = 1;
    var costo = $('#tipo-tramite').val();
    // $(".tipo_tramite option[value=9]").hide();
    $(document).on('change', '.custom-file-input', function(e) {

        var fileIndex = $(this).attr('id');
        var fileName = e.target.files[0].name;
        $('.'+fileIndex).html(fileName);
    });
    $(".ejemplares").on("input", function(){
        ejemplares = $(this).val();
        if(parseInt(ejemplares) > 0 && costo > 0)
        {
            $('.costo-banco').html('Costo: S/ '+ (costo*ejemplares + 0.60) );
            $('.costo-una').html('Costo: S/ '+ (costo*ejemplares) );
            $(".costo-banco").show();
            $(".costo-una").show();
        }
    });
    $("#una").hide();
    $("#help-obs").hide();

    $("#muna").click(function(){
        if( $(this).is(':checked'))
        {
            $("#banco").hide();
            $("#una").show();
        }
        mvoucher =1;

    });
    $("#mbanco").click(function(){
        if( $(this).is(':checked'))
        {
            $("#banco").show();
            $("#una").hide();
        }
        mvoucher =2;
    });
    $('.escuela').change(function(){
        idCarrera = $(this).find(':selected').val();


    })
    var tmp = '';
// validacion y envio de formulario record academico pregrado
    $("#form-record-academico").on("submit", function(e){
        e.preventDefault();
        $('#codigo').val(tmp);
        spinner.show();
        var formDerivar = document.getElementById("form-record-academico");
        let data = new FormData(formDerivar);
        // let data = $(this).serialize();
        let url = $(this).attr('action')

        $.ajax({
            type: "POST",
            dataType: "json",
            url:url,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:data,
            contentType: false,
            processData: false,
            success: function(data) {
                $(".error").html('');
                $('.coderror').html("");

                if(data.status == false)
                {
                    $('html, body').animate({
                        scrollTop: $("#pago").offset().top
                    }, 700, function() {
                        // $("#"+clave).focus();
                    });
                    $('#error_pago').html(data.message);
                    $('.tabla-pago tbody').remove();
                }
                else{
                    window.location.replace(data.url);
                }
                spinner.hide();
            },
            error: function(errors) {
                spinner.hide();
                if( errors.status === 422 ) {
                    let errores = errors.responseJSON.errors;
                    $(".error").html('');
                    $('.coderror').html("");
                    var i = 0;
                    for(var clave in errores) {
                        if(i == 0)
                        {
                            $('html, body').animate({
                                scrollTop: $("#"+clave).offset().top
                            }, 700, function() {
                                // $("#"+clave).focus();
                            });
                        }

                        $('#error_'+clave).html(errores[clave]);
                        i++;
                    }
                }
            }
        });
    });

    $("#buscar-codigo").click(function(){
        spinner.show();
        let codigo = $("#codigo").val();
        let carrera = $("#carrera").val();

        if(codigo != "")
        {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "../estudiante/"+codigo,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    carrera:carrera
                },
                success: function(data) {
                    $('.tipo_tramite').val("0");
                    $("#help-obs").hide();
                    if((data.estudiante).length === 0){
                        $("#nombres").val('');
                        $("#escuela").val('');
                        $("#dni").val('');
                        if(data.status)
                        {
                            $('#modal-deudor').modal('show');
                            $('.deuda').html(data.deuda);
                            $('#codigo').val('');
                        }
                        else{
                            $('.coderror').html("* El código ingresado no existe o la escuela profesional no es la correcta, intentelo nuevamente");
                        }
                    }
                    else{
                        if(data.estudiante.codigo_carrera == 16 || data.estudiante.codigo_carrera == 17 || data.estudiante.codigo_carrera == 18 || data.estudiante.codigo_carrera == 20 || data.estudiante.codigo_carrera == 21)
                            {
                            $('.coderror').html("");
                            $("#nombres").val(data.estudiante.nombres);
                            $("#escuela").val(data.estudiante.escuela);
                            $("#dni").val(data.estudiante.dni);
                            escuela = data.estudiante.codigo_carrera;
                            tmp = codigo;
                        }
                        else{
                            $("#codigo").val('');
                            $('.coderror').html("* Este documento solo puede ser tramitado por estudiantes de Educacion Inicial, Primaria y Secundaria");
                        }
                    }
                    spinner.hide();
                },
                error: function(result) {
                }
            });
        }
        else
        {
            spinner.hide();
            $('.coderror').html("* Ingrese un código valido");
        }
    });

    $("#blugar").change(function () {
        let imgGuiaPago = $("#img_guia_pago");
        let lugar = $(this).val();
        if (lugar == "002") {
            imgGuiaPago.attr("src", "/images/pagalo.jpg");
        } else {
            imgGuiaPago.attr("src", "/images/voucher.jpg");
        }
    });

    $("#validar-banco").click(function(e){
        spinner.show();
        e.preventDefault();

        let lugar = $("#blugar").val();
        let secuencia = $("#bsecuencia").val();
        let fecha = $("#bfecha").val();
        let monto = $("#bmonto").val();
        let bn_voucher = $("#bn_voucher").val();
        let concepto = $("#concepto").val();

         //validar que el lugar no sea cero o vacio
         if (lugar == 0 || lugar == "") {
            $("#error_blugar").html("Seleccione una opción");
            spinner.hide();
            return false;
        } else {
            $("#error_blugar").html("");
        }

        $.ajax({
            type: "POST",
            dataType: "json",
            url:"../pago",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:{
                blugar:lugar,
                bsecuencia: secuencia,
                bfecha:fecha,
                bmonto:monto,
                bn_voucher:bn_voucher,
                concepto:concepto
            },
            success: function(data) {
                $(".berror").html('');
                $(".alert-banco").html('');

                if(data.status)
                {
                    $("#bsecuencia").val('');
                    $("#bmonto").val('');
                    $("#bfecha").val('');

                    var newRow = $('<tr>');
                    var cols = "";
                    cols += '<td><div class="alert alert-secondary" role="alert"> Secuencia: <b style="font-weight:bold;font-size:15px">'+data.secuencia+'</b> | Monto: <b style="font-weight:bold;font-size:15px">'+data.monto+'</b></div><input type="hidden" id="pago-banco" name="pago[]" value="'+data.token+'"></td>';
                    cols += data.concepto ? '<td><div class="alert alert-success" role="alert">'+data.message+'</div></td>' : '<td><div class="alert alert-warning" role="alert">'+data.message+'</div></td>';

                    newRow.append(cols);
                    $(".tabla-pago").append(newRow);

                    $('#modalPago').modal('hide')

                }
                else
                {
                    $(".alert-banco").html('<div class="alert alert-danger" role="alert">'+data.message+'</div>')
                    $('#modalPago').modal('hide')
                }
                spinner.hide();
            },
            error: function(errors) {
                spinner.hide();
                if( errors.status === 422 ) {
                    let errores = errors.responseJSON.errors;
                    $(".berror").html('');
                    var i = 0;
                    for(var clave in errores) {
                        $('#error_'+clave).html(errores[clave]);
                        i++;
                    }
                }
            }
        });
    });
    $('input#codigo').on('input',function(e){
        tmp = '';
        $('#nombres').val('');
        $('#escuela').val('');
    });
});

