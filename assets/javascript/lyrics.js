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
              $(".lyricsimg")
                    .css("background-color","rgba(235, 179, 38, 0.726")
                    .css("color","black")
                    .css("font-size","18px")
                    .css("border-radius", "30px")
                    .css("border", "5px solid brown")
                    .css("width","700")
                    .css("height","300")
                  

    var $loadingGif = $("<img>");
    $loadingGif
                  .attr("id", "loadGif")
                  .attr("src", "../image/loading.gif")
                  .attr("width", "700")
                  .attr("height", "350")                
                  .appendTo($("#showLyrics"));
  
    //Create <p> tag to append lyrics or error message to it
    var $addText = $("<pre>");

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
                .attr("src", "../image/loading.gif")
                  .attr("width", "700")
                  .attr("height", "350")
                  .css("pdding","20px")
                  .css("margin","20px")
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