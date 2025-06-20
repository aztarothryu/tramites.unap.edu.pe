$(document).ready(function () {
    var mvoucher = 2;
    var ejemplares = 1;
    var costo = 0;
    var escuela = 0;
    var matricula = 0;
    var id_tramite = 0;
    var titulo = false;
    var rotulado = false;
    var validacion = false;
    $(document).on("change", ".custom-file-input", function (e) {
        var fileIndex = $(this).attr("id");
        var fileName = e.target.files[0].name;
        $("." + fileIndex).html(fileName);
    });
    /*Acta*/
    $("#acta").hide();

    $("#una").hide();
    $("#help-obs").hide();
    $(".costo-banco").hide();
    $(".costo-una").hide();

    $(".add-titulo").hide();
    $(".add-rotulado").hide();

    $(".titulo-examen").hide();
    $(".titulo-sustentacion").hide();
    $(".titulo-trabajo").hide();
    // $('.titulo_sustentacion').hide();
    $("#tipo_tramite").prop("disabled", true);
    $("#muna").click(function () {
        if ($(this).is(":checked")) {
            $("#banco").hide();
            $("#una").show();
        }
        mvoucher = 1;
    });
    $("#mbanco").click(function () {
        if ($(this).is(":checked")) {
            $("#banco").show();
            $("#una").hide();
        }
        mvoucher = 2;
    });
    $(".escuela").change(function () {
        escuela = $(this).find(":selected").val();
    });
    var tmp = "";
    $(".tipo_tramite").change(function () {
        id_tramite = $(this).val();
        switch (id_tramite) {
            case "40":
                $(".add-titulo").show();
                $(".add-rotulado").show();
                // if (validacion) {
                //     $('.titulo-sustentacion').hide();
                // }else{
                //     $('.titulo-sustentacion').show();
                // }
                $(".titulo-examen").hide();
                $(".titulo-trabajo").hide();
                $(".titulo_sustentacion").show();
                break;
            case "41":
                $(".add-titulo").show();
                $(".add-rotulado").show();
                // $('.titulo-sustentacion').hide();
                $(".titulo-examen").hide();
                $(".titulo-trabajo").show();
                $(".titulo_sustentacion").hide();
                break;
            case "42":
                $(".add-titulo").show();
                $(".add-rotulado").show();
                // $('.titulo-sustentacion').hide();
                $(".titulo-examen").show();
                $(".titulo-trabajo").hide();
                $(".titulo_sustentacion").hide();
                break;
            default:
                $(".add-titulo").hide();
                $(".add-rotulado").hide();
                $(".titulo-examen").hide();
                // $('.titulo-sustentacion').hide();
                $(".titulo-trabajo").hide();
                $(".titulo_sustentacion").hide();
                $(".tabla-pago tbody").empty();
                titulo = false;
                rotulado = false;
                break;
        }
    });
    // validacion y envio de formulario certificado pregrado
    $("#form-pre-titulo").on("submit", function (e) {
        e.preventDefault();
        $("#codigo").val(tmp);

        var formDerivar = document.getElementById("form-pre-titulo");
        let data = new FormData(formDerivar);
        // let data = $(this).serialize();
        let url = $(this).attr("action");

        if (titulo == false) {
            $(".alert-pago").html(
                '<div class="alert alert-danger" role="alert">El pago por concepto de Titulo Profesional es obligatorio.</div>'
            );
            $("html, body").animate(
                {
                    scrollTop: $("#pago").offset().top,
                },
                700,
                function () {
                    // $("#"+clave).focus();
                }
            );
        } else if (rotulado == false) {
            $(".alert-pago").html(
                '<div class="alert alert-danger" role="alert">El pago por concepto de rotulado de diploma es obligatorio.</div>'
            );
            $("html, body").animate(
                {
                    scrollTop: $("#pago").offset().top,
                },
                700,
                function () {
                    // $("#"+clave).focus();
                }
            );
        } else {
            spinner.show();

            $.ajax({
                type: "POST",
                dataType: "json",
                url: url,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                data: data,
                contentType: false,
                processData: false,
                success: function (data) {
                    $(".error").html("");
                    $(".coderror").html("");

                    if (data.status == false) {
                        $("html, body").animate(
                            {
                                scrollTop: $("#pago").offset().top,
                            },
                            700,
                            function () {
                                // $("#"+clave).focus();
                            }
                        );
                        $(".alert-pago").html(
                            '<div class="alert alert-danger" role="alert">' +
                                data.message +
                                "</div>"
                        );
                        $(".tabla-pago tbody").empty();
                        titulo = false;
                        rotulado = false;
                    } else {
                        window.location.replace(data.url);
                    }

                    spinner.hide();
                },
                error: function (errors) {
                    spinner.hide();
                    if (errors.status === 422) {
                        let errores = errors.responseJSON.errors;
                        $(".error").html("");
                        $(".coderror").html("");
                        var i = 0;
                        for (var clave in errores) {
                            if (i == 0) {
                                $("html, body").animate(
                                    {
                                        scrollTop: $("#" + clave).offset().top,
                                    },
                                    700,
                                    function () {
                                        // $("#"+clave).focus();
                                    }
                                );
                            }

                            $("#error_" + clave).html(errores[clave]);
                            i++;
                        }
                    }
                },
            });
        }
    });

    $("#buscar-codigo").click(function () {
        spinner.show();
        let codigo = $("#codigo").val();
        let carrera = $("#carrera").val();
        $(".pcodigo").val(codigo);

        if (codigo != "") {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "../estudianteTitulo/" + codigo,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                data: {
                    carrera: carrera,
                },
                success: function (data) {
                    $(".tipo_tramite").val("0");

                    $(".add-titulo").hide();
                    $(".add-rotulado").hide();
                    // $(".costo-banco").hide();
                    // $(".costo-una").hide();

                    $("#help-obs").hide();
                    if (data.estudiante.length === 0) {
                        $("#nombres").val("");
                        $("#escuela").val("");
                        $("#dni").val("");
                        if (data.status) {
                            $("#modal-deudor").modal("show");
                            $(".deuda").html(data.deuda);
                            $("#codigo").val("");

                            $(".coderror").html("");
                        } else {
                            $(".coderror").html(
                                "El código ingresado no existe o la escuela profesional no es la correcta, intentelo nuevamente"
                            );
                        }
                    } else {
                        if (data.no_habilitado) {
                            //alert(data.messages);
                            $("#modal-nohabilitado").modal("show");
                            $(".deuda").html(data.habilitacion);
                            $("#codigo").val("");
                            $("#nombres").val("");

                            $(".coderror").html("");
                        } else if (data.duplicado) {
                            //alert(data.messages);
                            $("#modal-repetido").modal("show");
                            $(".deuda").html(data.messages);
                            $("#codigo").val("");
                            $("#nombres").val("");

                            $(".coderror").html("");
                            // var newRow = $('<tr>');
                            // var cols = "";
                            // cols += '<td><div class="alert alert-warning mb-0" role="alert">'+data.messages+'</div></td>';

                            // newRow.append(cols);
                            // $(".tabla-deuda tbody").append(newRow);
                        } else {
                            $(".coderror").html("");
                            $("#nombres").val(data.estudiante.nombres);
                            $("#escuela").val(data.estudiante.escuela);
                            $("#dni").val(data.estudiante.dni);
                            escuela = data.estudiante.codigo_carrera;
                            tmp = codigo;
                            $("#tipo_tramite").prop("disabled", false);
                        }
                    }
                    if (data.pilar) {
                        $(".tipo_tramite").val("0");
                        $(".tipo_tramite option[value='41']").hide();
                        $(".tipo_tramite option[value='42']").hide();
                        //$('#tipo_tramite').prop('disabled', true);
                    } else {
                        $(".tipo_tramite option[value='41']").show();
                        $(".tipo_tramite option[value='42']").show();
                    }
                    //validacion = data.validacion;
                    if (data.validacion == 0) {
                        $("#acta").show();
                    } else if (data.validacion == 1) {
                        $("#acta").hide();
                    } else {
                        $("#acta").html("Error");
                    }
                    spinner.hide();
                },
                error: function (result) {},
            });
        } else {
            spinner.hide();
            $(".coderror").html("* Ingrese un código valido");
        }
    });

    $("#validar-titulo").click(function (e) {
        console.log("validar-titulo");
        spinner.show();
        e.preventDefault();

        let data = $("#form-bpago-titulo").serialize();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "../pago/titulo",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: data,
            success: function (data) {
                $(".berror").html("");
                $(".alert-pago").html("");

                if (data.status) {
                    $("#bsecuencia").val("");
                    $("#bmonto").val("");
                    $("#bfecha").val("");
                    titulo = true;
                    var newRow = $("<tr>");
                    var cols = "";
                    cols +=
                        '<td><div class="alert alert-secondary" role="alert"> Secuencia: <b style="font-weight:bold;font-size:15px">' +
                        data.secuencia +
                        '</b> | Monto: <b style="font-weight:bold;font-size:15px">' +
                        data.monto +
                        '</b></div><input type="hidden" id="pago-banco" name="pago[]" value="' +
                        data.token +
                        '"></td>';
                    cols += data.concepto
                        ? '<td><div class="alert alert-success" role="alert">' +
                          data.message +
                          "</div></td>"
                        : '<td><div class="alert alert-warning" role="alert">' +
                          data.message +
                          "</div></td>";

                    newRow.append(cols);
                    $(".tabla-pago").append(newRow);

                    $("#modalPagoBachiller").modal("hide");
                } else {
                    $(".alert-pago").html(
                        '<div class="alert alert-danger" role="alert">' +
                            data.message +
                            "</div>"
                    );
                    $("#modalPagoBachiller").modal("hide");
                }
                spinner.hide();
            },
            error: function (errors) {
                spinner.hide();
                if (errors.status === 422) {
                    let errores = errors.responseJSON.errors;
                    $(".berror").html("");
                    var i = 0;
                    for (var clave in errores) {
                        $("#berror_" + clave).html(errores[clave]);
                        i++;
                    }
                }
            },
        });
    });
    $("#validar-rotulado").click(function (e) {
        spinner.show();
        e.preventDefault();

        let data = $("#form-bpago-rotulado").serialize();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "../pago/titulo",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: data,
            success: function (data) {
                $(".berror").html("");
                $(".alert-pago").html("");

                if (data.status) {
                    $(".bsecuencia").val("");
                    $(".bmonto").val("");
                    $(".bfecha").val("");
                    rotulado = true;
                    var newRow = $("<tr>");
                    var cols = "";
                    cols +=
                        '<td><div class="alert alert-secondary" role="alert"> Secuencia: <b style="font-weight:bold;font-size:15px">' +
                        data.secuencia +
                        '</b> | Monto: <b style="font-weight:bold;font-size:15px">' +
                        data.monto +
                        '</b></div><input type="hidden" id="pago-banco" name="pago[]" value="' +
                        data.token +
                        '"></td>';
                    cols += data.concepto
                        ? '<td><div class="alert alert-success" role="alert">' +
                          data.message +
                          "</div></td>"
                        : '<td><div class="alert alert-warning" role="alert">' +
                          data.message +
                          "</div></td>";

                    newRow.append(cols);
                    $(".tabla-pago").append(newRow);

                    $("#modalPagoRotulado").modal("hide");
                } else {
                    $(".alert-pago").html(
                        '<div class="alert alert-danger" role="alert">' +
                            data.message +
                            "</div>"
                    );
                    $("#modalPagoRotulado").modal("hide");
                }
                spinner.hide();
            },
            error: function (errors) {
                spinner.hide();
                if (errors.status === 422) {
                    let errores = errors.responseJSON.errors;
                    $(".rerror").html("");
                    var i = 0;
                    for (var clave in errores) {
                        $("#rerror_" + clave).html(errores[clave]);
                        i++;
                    }
                }
            },
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

    $("#validar-banco").click(function (e) {
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
            url: "../pago",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: {
                bsecuencia: secuencia,
                bfecha: fecha,
                bmonto: monto,
                bn_voucher: bn_voucher,
                concepto: concepto,
            },
            success: function (data) {
                $(".berror").html("");
                $(".alert-banco").html("");

                if (data.status) {
                    $("#bsecuencia").val("");
                    $("#bmonto").val("");
                    $("#bfecha").val("");

                    var newRow = $("<tr>");
                    var cols = "";
                    cols +=
                        '<td><div class="alert alert-secondary" role="alert"> Monto: <b style="font-weight:bold;font-size:15px">' +
                        data.monto +
                        '</b></div><input type="hidden" id="pago-banco" name="pago[]" value="' +
                        data.token +
                        '"></td>';
                    cols += data.concepto
                        ? '<td><div class="alert alert-success" role="alert">' +
                          data.message +
                          "</div></td>"
                        : '<td><div class="alert alert-warning" role="alert">' +
                          data.message +
                          "</div></td>";

                    newRow.append(cols);
                    $(".tabla-pago").append(newRow);

                    $("#modalPago").modal("hide");
                } else {
                    $(".alert-banco").html(
                        '<div class="alert alert-danger" role="alert">' +
                            data.message +
                            "</div>"
                    );
                    $("#modalPago").modal("hide");
                }
                spinner.hide();
            },
            error: function (errors) {
                spinner.hide();
                if (errors.status === 422) {
                    let errores = errors.responseJSON.errors;
                    $(".berror").html("");
                    var i = 0;
                    for (var clave in errores) {
                        $("#error_" + clave).html(errores[clave]);
                        i++;
                    }
                }
            },
        });
    });
    $("input#codigo").on("input", function (e) {
        tmp = "";
        $("#nombres").val("");
        $("#escuela").val("");
        $(".tabla-pago tbody").empty();
        titulo = false;
        rotulado = false;
        $("#tipo_tramite").prop("disabled", true);
        $("#tipo_tramite").val(0);
        $(".add-titulo").hide();
        $(".add-rotulado").hide();
    });
});
