$(function () {

    // header settings
    var nasaUrl = "https://api.nasa.gov/planetary/apod?api_key=wLg2jcPqwt6ezGujrUDQ3Tj2ZxrNGp4urG21TLRa";
    var mainPhoto = $("section.mainPhoto");

    function setHeader(photo) {
        mainPhoto.css("background-image", `url(${photo})`);
    }

    function loadMainPhoto() {
        $.ajax({
            url: nasaUrl
        }).done(function (response) {
            if (response.hdurl) {
                setHeader(response.hdurl)
            } else {
                $("iframe").attr("src", response.url + "?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=W0LHTWG-UmQ");
            }
        }).fail(function (error) {
            console.log(error);
        })
    }

    loadMainPhoto();

    // gallery settings
    var marsUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1";
    var apiKey = "wLg2jcPqwt6ezGujrUDQ3Tj2ZxrNGp4urG21TLRa";
    var gallery = $("section.gallery");

    var currentPage = 0;
    var imagesDatabase = [];


    function loadImages(count, callback) {

        if (imagesDatabase.length < count) {

            var requestParams = {
                api_key: apiKey,
                page: currentPage
            };

            $.ajax({
                url: marsUrl,
                method: "GET",
                data: requestParams,
                dataType: "json"
            }).done(function (response) {
                console.log(response);
                var urls = response.photos.map(obj => obj.img_src
            )
                ;
                imagesDatabase = imagesDatabase.concat(urls);
                var urlsToReturn = imagesDatabase.splice(0, count);
                callback(urlsToReturn);
            });
            currentPage++;

        } else {
            var urlsToReturn = imagesDatabase.splice(0, count);
            callback(urlsToReturn);
        }

    }

    loadImages(6, function (urls) {
        urls.forEach(function (url) {
            $("<img>").attr("src", url).appendTo(gallery);
        })
    });


    $(".more-button").on("click", function () {

        loadImages(6, function (urls) {
            urls.forEach(function (url) {
                $("<img>").attr("src", url).appendTo(gallery);
            })

        })
    });


    $.fn.isOnScreen = function () {

        var win = $(window);

        var viewport = {
            top: win.scrollTop()
        };
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();

        return ( viewport.bottom < bounds.top);

    };

    $(window).scroll(function() {
        if ($("section.gallery").isOnScreen()) {
            console.log("działa");
            $(".more-button").removeClass("display");
        } else {
            $(".more-button").addClass("display");
        }
    })

});