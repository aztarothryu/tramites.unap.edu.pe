$("#error").hide();
$("#tabla-seguimiento").hide();
$("#aviso").hide();
$("#form-buscar-tramite").submit(function (e) {
    e.preventDefault();
    spinner.show();
    var cut = $("#cut").val();
    $("#solicitante").html("");

    $("#solicitud").html("");
    $("#solicitante").html("");
    $("#fecha_solicitada").html("");
    $("#oficina").html("");
    $("#tarea").html("");
    $("#estado").html("");
    $("#label-oficina").html(
        "<b>Su Trámite se Encuentra en la Oficina de:</b>"
    );
    //$('#ofice').hide();

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "buscar-tramite/" + cut,
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (data) {
            $("#error").html("");
            $("table#table-aviso").empty();
            spinner.hide();
            if (data.status) {
                $("#seguimiento").show();
                $("#aviso").hide();
                if (data.aviso != "") {
                    $("#aviso").show();
                    var aviso = data.aviso;
                    // for (const [key, value] of aviso) {
                    //     // console.log(key);
                    //     console.log(value);
                    // }
                    var newRow = "";
                    for (const key in aviso) {
                        if (Object.hasOwnProperty.call(aviso, key)) {
                            newRow += `<tr>
                                            <td class="text-right"><b>${key}: </b></td>
                                            <td class="text-left">${aviso[key]}</td>
                                        </tr>`;
                        }
                    }
                    $("table#table-aviso").append(newRow);
                }
                $("#solicitante").append(
                    data.tramite.estadoTramite.solicitante
                );
                $("#solicitud").append(
                    "<b> TRÁMITE DE " +
                        data.tramite.estadoTramite.NombreTipoTramite +
                        "</b>"
                );

                var d = new Date(data.tramite.estadoTramite.created);
                var options = {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };

                $("#fecha_solicitada").append(
                    "<small>Fecha Solicitada: " +
                        d.toLocaleDateString("es-ES", options) +
                        "</small>"
                );

                var descripcion = "";
                if (data.tramite.estadoTramite.AreaUsers == null) {
                    descripcion = data.tramite.estadoTramite.Descripcion;
                } else {
                    if (
                        data.tramite.total == 1 &&
                        data.tramite.estadoTramite.visualizado == "P"
                    ) {
                        descripcion = "PENDIENTE DE RECEPCIÓN";
                    } else {
                        descripcion = data.tramite.estadoTramite.Descripcion;
                    }
                }

                var oficina = "";
                if (data.tramite.estadoTramite.NombreDependencia == null) {
                    oficina = data.tramite.oficina;
                } else {
                    oficina =
                        data.tramite.estadoTramite.NombreArea +
                        " - " +
                        data.tramite.estadoTramite.NombreDependencia;
                }
                $("#oficina").append(oficina);
                $("#tarea").append(
                    '<b class="text-info">' + descripcion + "</b>"
                );
                //
                let clas = "";
                let updated_atendido = "";
                if (
                    data.tramite.atendido == "O" &&
                    data.tramite.estadoTramite.AreaUsers == null
                ) {
                    clas =
                        'class="text-danger"> OBSERVADO, POR FAVOR REVISE SU CORREO';

                    $("#label-oficina").html(
                        "<b>Su Trámite fue Observado por:</b>"
                    );
                } else if (data.tramite.estadoTramite.atendido == "F") {
                    clas = 'class="text-success"> FINALIZADO';
                    $(".item-task").hide();
                    $(".item-office").hide();
                    $("#ofice").hide();
                    $("#work").hide();
                    $("#view").hide();
                } else {
                    clas = 'class="text-info"> EN TRÁMITE ';
                    $(".item-task").show();
                    $(".item-office").show();
                    $("#ofice").show();
                    $("#work").show();
                    $("#view").show();
                }

                $("#estado").append("<b " + clas + "</b>");

                spinner.hide();
                $("#error").hide();
            } else {
                $("#seguimiento").hide();
                $("#error").html("<small>" + data.message + "</small>");
                $("#error").show();
            }
        },
        error: function (error) {
            $("#error").html("<small>" + error.message + "</small>");
            $("#error").show();
            spinner.hide();
        },
    });
});
