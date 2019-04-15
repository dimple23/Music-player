

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

    //TO-DO: show the loading gif here
   
    $.ajax({
        url: queryURL,
        method: "GET",
        success: function (lyricsResp) {
    
            // Printing the entire object to console
            // console.log(lyricsResp);
            console.log(lyricsResp.lyrics);

            // Constructing HTML containing the artist information
            // var artistName = $("<h1>").text(lyricsResp.lyrics);
        },
        error: function (request, status, error) {
            console.log(request.responseText);
            console.log("Sorry... Lyrics Not Found!!!");
        }
    });


}