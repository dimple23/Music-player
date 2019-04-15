/*********************************************************************************************************
* searchLyrics(song, artist)
* Function that makes an ajax call to 'api.lyrics.ovh' api and gets the lyrics of the sonf in the respose
*********************************************************************************************************/


function searchLyrics(song, artist) {

  // var artist = "Beyonce";
  // var song = "I was here";

    var queryURL = `https://api.lyrics.ovh/v1/${artist}/${song}`;
    //https://api.lyrics.ovh/v1/"Beyonce"/"I was here"
    console.log(queryURL);

    //Add a loading Gif in the container until the lyrics are displayed
        
    var $loadingGif = $("<img>");
    $loadingGif
                  .attr("id", "loadGif")
                  .attr("src", "../image/loading.gif")
                  .attr("width", "420")
                  .attr("height", "345")
                  .css("border-radius", "30px")
                  .css("border", "5px solid brown")
                  .appendTo($("#showLyrics"));
  
    //Create <p> tag to append lyrics or error message to it
    var $addText = $("<p>");

    $.ajax({
        url: queryURL,
        method: "GET",
        success: function (lyricsResp) {

            // Printing the entire object to console
            // console.log(lyricsResp);
            console.log(lyricsResp.lyrics);

            // Constructing HTML containing the artist information ------------
            

            //If lyrics response is null
            if(lyricsResp.lyrics === "") {

              //Remove gif to append text to div
              $("#loadGif").remove();

                $addText
                  .text("Lyrics Not Found!!!")
                  .appendTo($("#showLyrics"));

                return;
            }
            else {
                //Remove gif to append text to div
                $("#loadGif").remove();

                //If lyrics is found
                $addText
                .text(lyricsResp.lyrics)
                .appendTo($("#showLyrics"));
            }

        },
        error: function (request, status, error) {
            console.log(request.responseText);
            console.log("Sorry... Lyrics Not Found!!!");

            //Remove gif to append text to div
            $("#loadGif").remove();

            //In case of error show text
            $addText
                  .text("Lyrics Not Found!!!")
                  .appendTo($("#showLyrics"));
        }
    });


}