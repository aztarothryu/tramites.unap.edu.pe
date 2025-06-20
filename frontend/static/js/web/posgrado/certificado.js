$(document).ready(function () {
    var mvoucher = 2;
    var ejemplares = 1;
    var costo = $("#tipo-tramite").val();
    var periodo = 0;
    $(".periodo").on("change", function () {
        var count = 0;
        $(".periodo:checked:enabled").each(function () {
            count++;
        });
        periodo = count;
        periodo == 0 ? $(".add-banco").hide() : $(".add-banco").show();
        periodo == 0 ? $(".costo-banco").hide() : $(".costo-banco").show();

        $(".costo-banco").html(
            "Costo: S/ " +
                ((parseFloat(costo * periodo) + 5.5) * ejemplares + 0.6)
        );
        $(".costo-una").html(
            "Costo: S/ " + (parseFloat(costo * periodo) + 5.5) * ejemplares
        );
        if (count == 0) {
            $(".tabla-pago tbody").empty();
        }
    });
    $(document).on("change", ".custom-file-input", function (e) {
        var fileIndex = $(this).attr("id");
        var fileName = e.target.files[0].name;
        $("." + fileIndex).html(fileName);
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
    $("#exito-busqueda").hide();

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
    });
    var tmp = "";
    // validacion y envio de formulario certificado pregrado
    $("#form-pos-certificado").on("submit", function (e) {
        e.preventDefault();
        $("#codigo").val(tmp);
        spinner.show();
        var formDerivar = document.getElementById("form-pos-certificado");
        let data = new FormData(formDerivar);
        // let data = $(this).serialize();
        let url = $(this).attr("action");

        $.ajax({
            type: "POST",
            dataType: "json",
            url: url,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
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
                    $("#error_pago").html(data.message);
                    $(".tabla-pago tbody").empty();
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
        let pro = $("#pro").val();
        $(".tabla-deuda tbody").empty();
        if (codigo != "") {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "../estudiantePosgrado/" + codigo,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                data: {
                    carrera: carrera,
                    pro,
                },
                success: function (data) {
                    $("#escuela").empty().trigger("change");
                    $(".tipo_tramite").val("0");
                    $("#help-obs").hide();
                    if (data.estudiante.length === 0) {
                        $("#nombres").val("");
                        $("#escuela").val("");
                        $("#escuela").trigger("change");
                        $("#carrera").val("");
                        $("#dni").val("");
                        if (data.statusDeuda) {
                            $("#modal-deudor").modal("show");
                            $(".deuda").html(data.deuda);
                            $("#codigo").val("");

                            for (const key in data.messages) {
                                var newRow = $("<tr>");
                                var cols = "";
                                cols +=
                                    '<td><div class="alert alert-warning mb-0" role="alert">' +
                                    data.messages[key] +
                                    "</div></td>";

                                newRow.append(cols);
                                $(".tabla-deuda tbody").append(newRow);
                            }
                            $(".coderror").html("");
                            $("#exito-busqueda").hide();
                        } else {
                            if (data.programas.length > 1) {
                                $(".select").prop("disabled", false);
                                var newOption = new Option(
                                    "Seleccione una opción",
                                    "",
                                    false,
                                    false
                                );
                                $("#escuela")
                                    .append(newOption)
                                    .trigger("change");
                                for (var clave in data.programas) {
                                    // console.log(data.programas[clave]);
                                    var newOption = new Option(
                                        data.programas[clave].programa,
                                        data.programas[clave].id,
                                        false,
                                        false
                                    );
                                    $("#escuela")
                                        .append(newOption)
                                        .trigger("change");
                                }
                                $(".coderror").html("");
                                tmp = codigo;
                                $("#exito-busqueda").show();
                            } else {
                                $(".select").prop("disabled", true);
                                $(".coderror").html(
                                    "El código ingresado no existe, verifique e intente  nuevamente"
                                );
                                $("#exito-busqueda").hide();
                            }
                        }
                    } else {
                        $(".select").prop("disabled", true);
                        $(".coderror").html("");
                        $("#nombres").val(data.estudiante.nombres);
                        var newOption = new Option(
                            data.estudiante.escuela,
                            data.estudiante.codigo_carrera,
                            false,
                            false
                        );
                        $("#escuela").append(newOption).trigger("change");
                        $("#escuela").val(data.estudiante.codigo_carrera);
                        $("#escuela").trigger("change");
                        $("#carrera").val(data.estudiante.codigo_carrera);
                        $("#dni").val(data.estudiante.dni);
                        escuela = data.estudiante.codigo_carrera;
                        tmp = codigo;
                        $("#exito-busqueda").show();
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
    $(".escuela").change(function (e) {
        if ($(this).val() != null && $(this).val() != "") {
            // console.log($(this).val());
            // console.log(tmp);
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "../estudianteDoblePosgrado/" + tmp,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                data: {
                    carrera: $(this).val(),
                },
                success: function (data) {
                    if (data.habil) {
                        $(".coderror").html("");
                        $("#nombres").val(data.estudiante.nombres);
                        $("#carrera").val(data.estudiante.codigo_carrera);
                        $("#dni").val(data.estudiante.dni);
                        escuela = data.estudiante.codigo_carrera;
                    } else {
                        $(".select").prop("disabled", true);
                        $("#nombres").val("");
                        $("#escuela").val("");
                        $("#escuela").trigger("change");
                        $("#carrera").val("");
                        $("#dni").val("");
                        $("#modal-deudor").modal("show");
                        $(".deuda").html(data.deuda);
                        $("#codigo").val("");

                        for (const key in data.messages) {
                            var newRow = $("<tr>");
                            var cols = "";
                            cols +=
                                '<td><div class="alert alert-warning mb-0" role="alert">' +
                                data.messages[key] +
                                "</div></td>";

                            newRow.append(cols);
                            $(".tabla-deuda tbody").append(newRow);
                        }
                        $(".coderror").html("");
                        $("#exito-busqueda").hide();
                    }

                    spinner.hide();
                },
                error: function (result) {},
            });
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
});
