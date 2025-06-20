$(document).ready(function () {
    // **************************************** INICIO JS PREGRADO **********************************************
    // $("#mbanco").css("display","hidden")
    var mvoucher = 2;
    var ejemplares = 1;
    var costo = 0;
    var escuela = "";

    // $(".tipo_tramite option[value=9]").hide();
    $(".ejemplares").on("input", function () {
        ejemplares = $(this).val();
        if (parseInt(ejemplares) > 0 && costo > 0) {
            $(".costo-banco").html(
                "Costo: S/ " + ((parseFloat(costo) + 5.5) * ejemplares + 0.6)
            );
            $(".costo-una").html(
                "Costo: S/ " + (parseFloat(costo) + 5.5) * ejemplares
            );
            $(".costo-banco").show();
            $(".costo-una").show();
        }
    });
    $(document).on("change", ".custom-file-input", function (e) {
        var fileIndex = $(this).attr("id");
        var fileName = e.target.files[0].name;
        $("." + fileIndex).html(fileName);
    });
    // $('.ejemplares').change(function(){
    //     ejemplares = $(this).val();
    //     $('.costo-banco').html('Costo: S/ '+data.costo*ejemplares);
    // });

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
    $(".tipo_tramite").change(function () {
        // alert($(this).val())
        $(".tabla-pago tbody").empty();
        $(".alert-banco div").remove();
        let id_tramite = $(this).val();
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
                    $(".costo-banco").show();
                    $(".costo-una").show();
                    $(".costo-banco").html(
                        "Costo: S/ " +
                            ((parseFloat(costo) + 5.5) * ejemplares + 0.6)
                    );
                    $(".costo-una").html(
                        "Costo: S/ " + (parseFloat(costo) + 5.5) * ejemplares
                    );
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
                        $(".costo-banco").show();
                        $(".costo-una").show();
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

    // validacion y envio de formulario constancia pregrado
    $("#form-pos-constancia").on("submit", function (e) {
        e.preventDefault();
        $("#codigo").val(tmp);
        spinner.show();
        var formDerivar = document.getElementById("form-pos-constancia");
        let data = new FormData(formDerivar);
        // let data = $(this).serialize();
        // console.log(data);
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
                    console.log(data.status);
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
                    console.log(errores);
                    for (var clave in errores) {
                        console.log(clave);
                        if (i == 0) {
                            console.log(clave);
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
                    // cols += '<td><input required class="form-control" style="padding: 2px 2px; text-align: center; border: #fff;" type="date" name="fecha_vencimiento[]"></td>'

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
