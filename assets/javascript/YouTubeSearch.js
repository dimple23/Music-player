$(document).ready(function () {

  youtubeSearch(song, artist);

}); //End of $(document).ready(function)



/************************************************************************************************
* youtubeSearch()
* Function that makes an ajax call to youtube api and gets the respose
************************************************************************************************/

function youtubeSearch(song, artist) {

console.log("Inside youtubeSearch()");
console.log(song + " : " + artist);

// This is our API key for YouTube app
var APIKey = "AIzaSyCM6nHLO1qSaQ6vXhIR60m7lnT2ufZeul4";

//var songAndArtist = "waka waka shakira";
var songAndArtist = song + " " + artist;


// Here we are building the URL we need to query the database
var queryURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${songAndArtist}&key=${APIKey}`;



// Here we run our AJAX call to the YouTube API
$.ajax({
url: queryURL,
method: "GET"
})
// We store all of the retrieved data inside of an object called "response"
.then(function(youTubeResp) {

//console.log("----------");
// Log the resulting object
//console.log(youTubeResp);
//console.log("----------");


//waka waka: "https://www.youtube.com/embed/pRpeEdMmmQ0"
var videoId = youTubeResp.items[0].id.videoId;

// console.log("VideoId: " + videoId);

$("#youtubesearch")
.attr("src", `https://www.youtube.com/embed/${videoId}`);
  
});
}