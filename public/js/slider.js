function renderPicture() {
    $.ajax({
        url: "/pictures?day=" + currentDate,
        method: "POST",
    }).then(function(res) {
        var images = res.images;
        var mainPhoto= res.mainPhoto || '/images/photo.jpg';
        $('#main-photo').attr('src', mainPhoto + "?" + Math.random());

        if (images.length == 0) {
            $("#showGallery").hide();
            $('#modal-slider').modal('hide');
        } else {

            $("#showGallery").show();
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
                }, function() {
                    renderPicture();
                });
            });
            $picture.find(".main-photo").click(function(e) {
                PhotoRepository.setMainPhoto({
                    image: image,
                    day: currentDate
                }, function(res) {
                    renderPicture();
                });
            });

        });
    });
}
renderPicture();
