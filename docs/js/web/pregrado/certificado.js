$(document).ready(function () {
    var mvoucher = 2;
    var ejemplares = 1;
    var costo = 0;
    var escuela = "";
    var periodo = 0;
    var id_tramite = 0;
    var count = 0;
    // $(".tipo_tramite option[value=9]").hide();
    $(".periodo").on("change", function () {
        count = 0;
        $(".periodo:checked:enabled").each(function () {
            count++;
        });
        periodo = Math.round(count / 2);
        if (id_tramite != 0) {
            periodo == 0 ? $(".add-banco").hide() : $(".add-banco").show();
            periodo == 0 ? $(".costo-banco").hide() : $(".costo-banco").show();
            if (escuela == 53) {
                $(".costo-banco").html(
                    "Costo: S/ " +
                        ((parseFloat(costo * count) + 5.5) * ejemplares + 0.6)
                );
                $(".costo-una").html(
                    "Costo: S/ " +
                        (parseFloat(costo * count) + 5.5) * ejemplares
                );
            } else {
                $(".costo-banco").html(
                    "Costo: S/ " +
                        ((parseFloat(costo * periodo) + 5.5) * ejemplares + 0.6)
                );
                $(".costo-una").html(
                    "Costo: S/ " +
                        (parseFloat(costo * periodo) + 5.5) * ejemplares
                );
            }
        }
    });

    $(".ejemplares").on("input", function () {
        ejemplares = $(this).val();
        if (parseInt(ejemplares) > 0 && costo > 0) {
            $(".costo-banco").html(
                "Costo: S/ " +
                    ((parseFloat(costo * periodo) + 5.5) * ejemplares + 0.6)
            );
            $(".costo-una").html(
                "Costo: S/ " + (parseFloat(costo * periodo) + 5.5) * ejemplares
            );
            $(".costo-banco").show();
            $(".costo-una").show();
        }
    });
    $("#una").hide();
    $("#help-obs").hide();
    $(".costo-banco").hide();
    $(".costo-una").hide();
    $(".add-banco").hide();
    $(".add-una").hide();

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
        idCarrera = $(this).find(":selected").val();
        if (idCarrera == 53) {
            $(".row-certificado").hide();
        } else {
            $(".row-certificado").show();
        }
    });
    var tmp = "";
    $(".tipo_tramite").change(function () {
        // alert($(this).val())
        id_tramite = $(this).val();
        if (id_tramite != 0) {
            $(".add-banco").show();
            $(".add-una").show();
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "../tipo-tramite/" + id_tramite,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                success: function (data) {
                    costo = data.costo;
                    $("#concepto").val(data.codigo);

                    if (escuela == 53) {
                        $(".costo-banco").html(
                            "Costo: S/ " +
                                ((parseFloat(costo * count) + 5.5) *
                                    ejemplares +
                                    0.6)
                        );
                        $(".costo-una").html(
                            "Costo: S/ " +
                                (parseFloat(costo * count) + 5.5) * ejemplares
                        );
                    } else {
                        $(".costo-banco").html(
                            "Costo: S/ " +
                                ((parseFloat(costo * periodo) + 5.5) *
                                    ejemplares +
                                    0.6)
                        );
                        $(".costo-una").html(
                            "Costo: S/ " +
                                (parseFloat(costo * periodo) + 5.5) * ejemplares
                        );
                    }
                    if (data.indicaciones == null) {
                        $("#help-obs").hide();
                    } else {
                        $("#help-obs").show();
                        $("#help-obs span").html(data.indicaciones);
                    }
                    if (id_tramite == 9 && escuela != "") {
                        if (
                            escuela != "08" &&
                            escuela != "29" &&
                            escuela != "27"
                        ) {
                            $(".tipo_tramite").val("0");
                            $(".costo-banco").hide();
                            $(".costo-una").hide();
                            $("html, body").animate(
                                {
                                    scrollTop: $("#tipo_tramite").offset().top,
                                },
                                700,
                                function () {
                                    // $("#"+clave).focus();
                                }
                            );
                            $("#error_tipo_tramite").html(
                                "El tramite seleccionado solo es valido para las carreras de Medicina, Enfermeria y Odontologia"
                            );
                        }
                    } else {
                        periodo == 0
                            ? $(".add-banco").hide()
                            : $(".add-banco").show();
                        periodo == 0
                            ? $(".costo-banco").hide()
                            : $(".costo-banco").show();
                        // $(".costo-una").show();
                        $("#error_tipo_tramite").html("");
                    }
                },
                error: function (result) {},
            });
        } else {
            costo = 0;
            $(".add-banco").hide();
            $(".add-una").hide();
            $(".costo-banco").html("");
            $(".costo-una").html("");
        }
    });
    // validacion y envio de formulario certificado pregrado
    $("#form-pre-certificado").on("submit", function (e) {
        e.preventDefault();
        $("#codigo").val(tmp);
        spinner.show();
        let data = $(this).serialize();
        let url = $(this).attr("action");

        $.ajax({
            type: "POST",
            dataType: "json",
            url: url,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: data,
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
                    $("#error_pago").html(data.message);
                    $(".tabla-pago tbody").remove();
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
    });

    $("#buscar-codigo").click(function () {
        spinner.show();
        let codigo = $("#codigo").val();
        let carrera = $("#carrera").val();

        if (codigo != "") {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "../estudiante/" + codigo,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                data: {
                    carrera: carrera,
                },
                success: function (data) {
                    $(".periodo").prop("checked", false);
                    $(".tipo_tramite").val("0");
                    $(".add-banco").hide();
                    $(".add-una").hide();
                    $(".costo-banco").hide();
                    $(".costo-una").hide();
                    $("#help-obs").hide();
                    if (data.estudiante.length === 0) {
                        $("#nombres").val("");
                        $("#escuela").val("");
                        $("#dni").val("");
                        if (data.status) {
                            $("#modal-deudor").modal("show");
                            $(".deuda").html(data.deuda);
                            $("#codigo").val("");
                        } else {
                            $(".coderror").html(
                                "El código ingresado no existe o la escuela profesional no es la correcta, intentelo nuevamente"
                            );
                        }
                    } else {
                        $(".coderror").html("");
                        $("#nombres").val(data.estudiante.nombres);
                        $("#escuela").val(data.estudiante.escuela);
                        $("#dni").val(data.estudiante.dni);
                        escuela = data.estudiante.codigo_carrera;
                        tmp = codigo;
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

    $("#blugar").change(function () {
        let imgGuiaPago = $("#img_guia_pago");
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
            url: "../pago",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            data: {
                blugar: lugar,
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
    });

    $(".tipo_solicitud").change(function () {
        let tipoSolcitud = $(this).val();

        if (tipoSolcitud == "2") {
            $("#requisito_pago").hide();
        } else {
            $("#requisito_pago").show();
        }
    });
});
