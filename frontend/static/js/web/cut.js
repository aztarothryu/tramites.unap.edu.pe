window.addEventListener("DOMContentLoaded", function () {
    const inputImage = document.querySelector("#image_data");
    inputImage.addEventListener("change", abrirEditor, false);
    var button = document.getElementById("button_save");
    var button_modal = document.getElementById("abrir-modal-seleccion-imagen");
    //var image = document.querySelector('#image');
    //var data = document.querySelector('#data');
    //var cropBoxData = document.querySelector('#cropBoxData');
    var result = document.getElementById("result");
    let urlImage = undefined;
    var canvasshow;

    function abrirEditor(e) {
        urlImage = URL.createObjectURL(e.target.files[0]);
        var dataWidth = document.getElementById("ancho");
        var dataHeight = document.getElementById("alto");
        // Borra editor en caso que existiera una imagen previa
        editor.innerHTML = "";
        let cropprImg = document.createElement("img");
        cropprImg.setAttribute("id", "image");
        cropprImg.setAttribute("class", "img-fluid");
        cropprImg.setAttribute("alt", "Responsive image");
        editor.appendChild(cropprImg);

        //contexto.clearRect(0, 0, miCanvas.width, miCanvas.height);

        // Envia la imagen al editor para su recorte
        document.querySelector("#image").setAttribute("src", urlImage);

        var cropper = new Cropper(image, {
            aspectRatio: 4 / 5.15,
            ready: function (event) {
                // Zoom the image to its natural size
                cropper.zoomTo();
            },
            crop: function (event) {
                var data = event.detail;
                //data.textContent = JSON.stringify(cropper.getData());
                //cropBoxData.textContent = JSON.stringify(cropper.getCropBoxData());
                dataHeight.innerHTML = Math.round(data.height);
                dataWidth.innerHTML = Math.round(data.width);
                result.innerHTML = "";
                result.appendChild(cropper.getCroppedCanvas());
                canvasshow = cropper.getCroppedCanvas();
                var list = document.getElementById("result").firstChild;
                list.setAttribute("class", "img-fluid");
                list.setAttribute("alt", "Responsive image");
            },
            zoom: function (event) {
                // Keep the image in its natural size
                if (event.detail.oldRatio === 1) {
                    event.preventDefault();
                }
            },
        });
    }
    button.onclick = function () {
        var alto = document.getElementById("alto").innerHTML;
        var ancho = document.getElementById("ancho").innerHTML;

        if (alto == "" && ancho == "") {
            document.getElementById("error_imagen").innerHTML =
                "<ul><li>Seleccione una imagen</li></ul>";
        } else if (alto < 531 && ancho < 413) {
            document.getElementById("error_imagen").innerHTML =
                "<ul><li>El recorte es muy pequeño</li></ul>";
        } else {
            var canvas = canvasshow;
            var imagenEn64 = "";
            imagenEn64 = canvas.toDataURL("image/png");
            // Mostramos el código generado
            document.getElementById("show").innerHTML = "";
            var show = document.querySelector("#show");
            let img = document.createElement("img");
            var newDataUri = resizedataURL(imagenEn64, 413, 531);
            newDataUri
                .then((r) => {
                    document.getElementById("fotografia").value = r;
                    img.setAttribute("src", r);
                    img.setAttribute("class", "img-fluid");
                    img.setAttribute("width", "274");
                    img.setAttribute("height", "343");
                    img.setAttribute("alt", "Responsive image");
                    img.setAttribute("width", "274");
                    img.setAttribute("height", "343");
                    show.appendChild(img);
                })
                .catch(() => {
                    document.getElementById("fotografia").value = "";
                    document.getElementById("error_foto").innerHTML =
                        "Error al cargar imagen, Por favor vuelva a intentar";
                });
            $("#exampleModal").modal("hide");
        }
    };

    button_modal.onclick = function () {
        $("#exampleModal").modal("show");
        document.getElementById("error_imagen").innerHTML = "";
    };
    function resizedataURL(datas, wantedWidth, wantedHeight) {
        return new Promise(async function (resolve, reject) {
            var img = document.createElement("img");
            img.onload = function () {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = wantedWidth;
                canvas.height = wantedHeight;
                ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);
                var dataURI = canvas.toDataURL();
                resolve(dataURI);
            };
            img.src = datas;
        });
    }
});
