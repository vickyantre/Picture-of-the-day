function renderPicture(){
    $.ajax({
        url: "/pictures?day=" + currentDate,
        method: "POST",
    }).then(function(images){
        if (images.length == 0){
            $( "#showGallery" ).hide();
            $('#modal-slider').modal('hide');
        } else{

            $( "#showGallery" ).show();
        }

        $("#placeForPictures").html('');

        images.forEach(function(image, index) {
            var $picture = $("#template > div").clone();

            if (index === 0) {
                $picture.addClass('active');
            }

            $picture.find("[data-picture]").attr("src", image);
            $picture.find("[data-href]").attr("href", image);

            $("#placeForPictures").append($picture);  

            $picture.find(".delete-photo").click(function(e) {
                PhotoRepository.removePhoto({
                    image: image,
                    day: currentDate
                }, function () {
                    renderPicture();
                });
            });          
        });
    });
}
    renderPicture();