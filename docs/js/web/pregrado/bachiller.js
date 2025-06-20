
$(document).ready(function(){
    var mvoucher = 2;
    var ejemplares = 1;
    var costo = 0;
    var escuela = 0;
    var matricula = 0;
    var id_tramite = 0;
    var bachiller = false;
    var rotulado = false;
    $(document).on('change', '.custom-file-input', function(e) {

        var fileIndex = $(this).attr('id');
        var fileName = e.target.files[0].name;
        $('.'+fileIndex).html(fileName);
    });

    $("#una").hide();
    $("#help-obs").hide();
    $(".costo-banco").hide();
    $(".costo-una").hide();
    $('.add-bachiller').hide();
    $('.add-rotulado').hide();
    $('.bachiller-automatico').hide();
    $('.bachiller-nuevo').hide();
    $('#tipo_tramite').prop('disabled', true);

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
        escuela = $(this).find(':selected').val();

    })
    var tmp = '';
    $( ".tipo_tramite" ).change(function() {

        // alert($(this).val())
        id_tramite = $(this).val();
        if(id_tramite == 38 && tmp != '')
        {
            $('.bachiller-automatico').show();
            $('.bachiller-nuevo').hide();
            $('.add-bachiller').show();
            $('.add-rotulado').show();
        }
        else if(id_tramite != 0 && tmp != '') {
            $('.bachiller-automatico').hide();
            $('.bachiller-nuevo').show();
            $('.add-bachiller').show();
            $('.add-rotulado').show();
        }
        else{
            $('.bachiller-automatico').hide();
            $('.bachiller-nuevo').hide();
            $('.add-bachiller').hide();
            $('.add-rotulado').hide();
            $('.tabla-pago tbody').empty();
            bachiller = false;
            rotulado = false;
        }
        let codigo = $("#codigo").val();
        let carrera = $("#carrera").val();
        let tipoTramite = $('#tipo_tramite').find(':selected').val();
        if(tmp !='')
        {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "../pregrado/costo-bachiller",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    carrera:carrera,
                    codigo:codigo,
                    tipoTramite:tipoTramite
                },
                success: function(data) {
                    console.log(data);
                    $('.costo-bachiller-banco').html(data+0.60);
                    spinner.hide();
                },
                error: function(error) {
                    console.log(error)
                }
            });
        }

    });
// validacion y envio de formulario certificado pregrado
    $("#form-pre-bachiller").on("submit", function(e){
        e.preventDefault();
        $('#codigo').val(tmp);

        var formDerivar = document.getElementById("form-pre-bachiller");
        let data = new FormData(formDerivar);
        // let data = $(this).serialize();
        let url = $(this).attr('action')
        if (bachiller == false) {
            $('.alert-pago').html('<div class="alert alert-danger" role="alert">El pago por concepto de grado académico bachiller es obligatorio.</div>')
            $('html, body').animate({
                scrollTop: $("#pago").offset().top
            }, 700, function() {
                // $("#"+clave).focus();
            });
        }
        else if(rotulado == false)
        {
            $('.alert-pago').html('<div class="alert alert-danger" role="alert">El pago por concepto de rotulado de grado bachiller es obligatorio.</div>')
            $('html, body').animate({
                scrollTop: $("#pago").offset().top
            }, 700, function() {
                // $("#"+clave).focus();
            });
        }
        else
        {
            spinner.show();
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
                            $('.alert-pago').html('<div class="alert alert-danger" role="alert">'+data.message+'</div>');
                            $('.tabla-pago tbody').empty();
                            bachiller = false;
                            rotulado = false;

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
        }
    });

    $("#buscar-codigo").click(function(){
        spinner.show();
        let codigo = $("#codigo").val();
        let carrera = $("#carrera").val();
        $(".pcodigo").val(codigo);

        $('.tabla-deuda tbody').empty();

        if(codigo != "")
        {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "../estudianteBachiller/"+codigo,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    carrera:carrera
                },
                success: function(data) {
                    $('.tipo_tramite').val("0");
                    $('.add-bachiller').hide();
                    $('.add-rotulado').hide();
                    // $(".costo-banco").hide();
                    // $(".costo-una").hide();
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
                            console.log(data);


                            for (const key in data.messages) {

                                var newRow = $('<tr>');
                                var cols = "";
                                cols += '<td><div class="alert alert-warning mb-0" role="alert">'+data.messages[key]+'</div></td>';

                                newRow.append(cols);
                                $(".tabla-deuda tbody").append(newRow);
                            }
                            $('.coderror').html("");
                        }
                        else{
                            $('.coderror').html("El código ingresado no existe o la escuela profesional no es la correcta, intentelo nuevamente");
                        }
                    }
                    else{
                        $('.coderror').html("");
                        $("#nombres").val(data.estudiante.nombres);
                        $("#escuela").val(data.estudiante.escuela);
                        $("#dni").val(data.estudiante.dni);
                        escuela = data.estudiante.codigo_carrera;
                        tmp = codigo;
                        $('#tipo_tramite').prop('disabled', false);
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

    $("#validar-bachiller").click(function(e){
        spinner.show();
        e.preventDefault();

        let data = $('#form-bpago-bachiller').serialize();
        $.ajax({
            type: "POST",
            dataType: "json",
            url:"../pago/bachiller",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:data,
            success: function(data) {
                $(".berror").html('');
                $(".alert-pago").html('');

                if(data.status)
                {
                    $("#bsecuencia").val('');
                    $("#bmonto").val('');
                    $("#bfecha").val('');
                    bachiller = true;
                    var newRow = $('<tr>');
                    var cols = "";
                    cols += '<td><div class="alert alert-secondary" role="alert"> Secuencia: <b style="font-weight:bold;font-size:15px">'+data.secuencia+'</b> | Monto: <b style="font-weight:bold;font-size:15px">'+data.monto+'</b></div><input type="hidden" id="pago-banco" name="pago[]" value="'+data.token+'"></td>';
                    cols += data.concepto ? '<td><div class="alert alert-success" role="alert">'+data.message+'</div></td>' : '<td><div class="alert alert-warning" role="alert">'+data.message+'</div></td>';

                    newRow.append(cols);
                    $(".tabla-pago").append(newRow);

                    $('#modalPagoBachiller').modal('hide')

                }
                else
                {
                    $(".alert-pago").html('<div class="alert alert-danger" role="alert">'+data.message+'</div>')
                    $('#modalPagoBachiller').modal('hide')
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
                        $('#berror_'+clave).html(errores[clave]);
                        i++;
                    }
                }
            }
        });
    });

    $("#validar-rotulado").click(function(e){
        spinner.show();
        e.preventDefault();

        let data = $('#form-bpago-rotulado').serialize();
        $.ajax({
            type: "POST",
            dataType: "json",
            url:"../pago/bachiller",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:data,
            success: function(data) {
                $(".berror").html('');
                $(".alert-pago").html('');

                if(data.status)
                {
                    $(".bsecuencia").val('');
                    $(".bmonto").val('');
                    $(".bfecha").val('');
                    rotulado = true;
                    var newRow = $('<tr>');
                    var cols = "";
                    cols += '<td><div class="alert alert-secondary" role="alert"> Secuencia: <b style="font-weight:bold;font-size:15px">'+data.secuencia+'</b> | Monto: <b style="font-weight:bold;font-size:15px">'+data.monto+'</b></div><input type="hidden" id="pago-banco" name="pago[]" value="'+data.token+'"></td>';
                    cols += data.concepto ? '<td><div class="alert alert-success" role="alert">'+data.message+'</div></td>' : '<td><div class="alert alert-warning" role="alert">'+data.message+'</div></td>';

                    newRow.append(cols);
                    $(".tabla-pago").append(newRow);

                    $('#modalPagoRotulado').modal('hide')

                }
                else
                {
                    $(".alert-pago").html('<div class="alert alert-danger" role="alert">'+data.message+'</div>')
                    $('#modalPagoRotulado').modal('hide')
                }
                spinner.hide();
            },
            error: function(errors) {
                spinner.hide();
                if( errors.status === 422 ) {
                    let errores = errors.responseJSON.errors;
                    $(".rerror").html('');
                    var i = 0;
                    for(var clave in errores) {
                        $('#rerror_'+clave).html(errores[clave]);
                        i++;
                    }
                }
            }
        });
    });

    $("#blugar1").change(function () {
        let imgGuiaPago = $("#img_guia_pago1");
        let lugar = $(this).val();
        if (lugar == "002") {
            imgGuiaPago.attr("src", "/images/pagalo.jpg");
        } else {
            imgGuiaPago.attr("src", "/images/voucher.jpg");
        }
    });

    $("#blugar2").change(function () {
        let imgGuiaPago = $("#img_guia_pago2");
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
        let secuencia = $("#bsecuencia").val();
        let fecha = $("#bfecha").val();
        let monto = $("#bmonto").val();
        let bn_voucher = $("#bn_voucher").val();
        let concepto = $("#concepto").val();
        $.ajax({
            type: "POST",
            dataType: "json",
            url:"../pago",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:{
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
                    cols += '<td><div class="alert alert-secondary" role="alert"> Monto: <b style="font-weight:bold;font-size:15px">'+data.monto+'</b></div><input type="hidden" id="pago-banco" name="pago[]" value="'+data.token+'"></td>';
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
        $('.tabla-pago tbody').empty();
        bachiller = false;
        rotulado = false;
        $('#tipo_tramite').prop('disabled', true);
        $('#tipo_tramite').val(0);
        $('.add-bachiller').hide();
        $('.add-rotulado').hide();
    });
});
