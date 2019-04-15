function searchLyrics(song, artist) {

  // var artist = "Beyonce"
  // var song = "I was here"

  // var artist = $('#artist-input').val().trim();
  // var song = $('#song-input').val().trim();
  // var display = song + " - " + artist;


 var queryURL = `https://api.lyrics.ovh/v1/"${artist}"/"${song}"`;
  //https://api.lyrics.ovh/v1/"Beyonce"/"I was here"
  console.log(queryURL);
s
 $.ajax({
  url: queryURL,
  method: "GET"
 }).then(function(lyricsResp) {

  // Printing the entire object to console
  // console.log(lyricsResp);
  console.log(lyricsResp.lyrics);

  // Constructing HTML containing the artist information
  // var artistName = $("<h1>").text(lyricsResp.lyrics);
});

}