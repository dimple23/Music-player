// Get username from sessionStorage and store it in global variable 'username' 
var username = sessionStorage.getItem("username");
console.log("Username in RecMusicByWeather.js from sessionstorage-> " + username);

//Creating global variable to store geographical co-ordinates
var latitude = 40;
var longitude = 74;
var flagLocationNotFound = false;

/************************************************************************************************
 * addVideosToPlaylist(snapshot)
 * Function that is used to create the recommended video playlist 
 * This Playlist is based on the current weather of 'Sommerset, New Jersey' 
 * If weather is Cloudy then 'CloudyWeatherPlaylist' will be populated else 
 * 'SunnyWeatherPlaylist' will be populated. These playlist are already in the firebase DB
 * It will also generate playlist defind by user.
 ************************************************************************************************/

function addVideosToPlaylist(snapshot) {

    console.log("Inside addVideosToPlaylist() function");
    console.log(snapshot.val());

    var artist = "";
    var song = "";
    var songObjKey = "";


    //Run snapshot for each child song object    
    snapshot.forEach(function (child) {
        // console.log("child.key: " + child.key);

        child.forEach(function (subChild) {

            // console.log("subChild.key: " + subChild.key);
            // console.log("subChild.val(): " + subChild.val());

            if (subChild.key === "song") {
                song = subChild.val();
            }
            if (subChild.key === "artist") {
                artist = subChild.val();
            }
            if (subChild.key === "songObjKey") {
                songObjKey = subChild.val();
            }

        });

        // console.log(song + " : " + artist + " : " + songObjKey);

        //Call function to Create Table here
        createPlaylistTable(song, artist, songObjKey);

    });

} //End of addVideosToPlaylist(snapshot)


/************************************************************************************************
 * createPlaylistTable(song, artist, songObjKey)
 * Function that is used to create playlist table and takes in 'song', 'artist' and song object 
 * key as input
 ************************************************************************************************/

function createPlaylistTable(song, artist, songObjKey) {

    console.log("Inside createPlaylistTable() function");
    console.log(song + " : " + artist + " : " + songObjKey);

    //create a table row 
    var $tr = $("<tr>");

    //create <td> for the song & artist
    //add content from childSnapshot.val() to corresponding <td> tags
    var $tdSongArtist = $("<td>").text(song + ", " + artist);
    $tdSongArtist
        .attr("keyData", songObjKey)
        .attr("id", "playVideo")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")
        .attr("title", "Play Video");


    var $tdCloseBtn = $("<td>");
    $tdCloseBtn
        .attr("keyData", songObjKey)
        .attr("id", "closeVideo")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")
        .attr("title", "Close Video")
        .html(`<i class="fas fa-window-close"></i>`);


    var $tdLyricsBtn = $("<td>");
    $tdLyricsBtn
        .attr("keyData", songObjKey)
        .attr("id", "lyrics")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")
        .attr("title", "Show Lyrics")
        .html(`<i class="fas fa-music"></i>`);


    var $tdRemoveBtn = $("<td>");
    $tdRemoveBtn
        .attr("keyData", songObjKey)
        .attr("id", "delete")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")
        .attr("title", "Delete Song from Playlist")
        .html(`<i class="far fa-trash-alt"></i>`);


    $tr.append($tdSongArtist, $tdLyricsBtn, $tdCloseBtn);

    //lastly append entire table you created to $("tbody")
    $("tbody").prepend($tr);

}

/************************************************************************************************
 * getGeolocationOfTheUser():
 * This function uses the browser's geoloacation API to get the user's current 
 * Latitide and Logitude values
 ************************************************************************************************/

function getGeolocationOfTheUser() {

    console.log("Inside getGeolocationOfTheUser()");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
        flagLocationNotFound = true;
    }
} //End of getGeolocationOfTheUser()

function showPosition(position) {

    console.log("Inside showPosition()");

    console.log("Latitude: " + position.coords.latitude + " : Longitude: " + position.coords.longitude);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

function showError(error) {

    //Turn on flag to say that location is not found continue with default values
    flagLocationNotFound = true;
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
  }
/************************************************************************************************
 * recommendedMusicByWeather()
 * Function that makes an ajax call to weather api and gets the respose
 ************************************************************************************************/

function recommendedMusicByWeather() {

    console.log("Inside recommendedMusicByWeather()");

    //Remove currently played video div
    $("#myVideo").empty();

    // This is our API key for weather app
    var APIKey = "166a433c57516f51dfab1f7edaed8413";

    var cityState = "Somerset,New Jersey";
    // var cityState = "Fremont,California";


    //Get geographical co-ordinates
    getGeolocationOfTheUser();

    //If loaction is not found then by default get weather data for "Sommerset, New Jersey" 
    if (flagLocationNotFound === true) {

        flagLocationNotFound = false; //Reset flag

        //default values set to that of "Somerset,New Jersey"
        latitude = 40; 
        longitude = 74;
    }

    // Here we are building the URL we need to query the database
    //https://api.openweathermap.org/data/2.5/weather?q=Somerset,New Jersey&appid=166a433c57516f51dfab1f7edaed8413
    // queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityState}&appid=${APIKey}`;


    //https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=166a433c57516f51dfab1f7edaed8413
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}`;
    
    console.log("queryURL: " + queryURL);

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({

        url: queryURL,
        method: "GET",

        // We store all of the retrieved data inside of an object called "response"
        success: function (response) {

            //Remove link that says "Go to my Playlist" as now the user will be shown his/her actual Playlist
            $("#goToMyPlaylist").empty();

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            console.log("Weather: " + response.weather[0].main);

            //Get the weather "Clouds/Clear"
            var currWeather = response.weather[0].main;

            //Empty the user's playlist to add recomended music list
            $("tbody").empty();


            //Add link to "Go To My Playlist" for user to go back to his/her playlist
            $("#goToMyPlaylist")
                .text("My Playlist")
                .addClass("btn-link");

            //Set the header of the table now to "Recommended Videos"
            $("#playlistHeader").text("Recommended Videos");


            //If weather is cloudy get atleast 10 songs with this category 
            if (currWeather === "Clouds") {

                console.log("Its cloudy out there");
                $("#weatherText").text("Clouds in the sky!!!");

                //Set playlist name
                setCurrentPlaylistName("CloudyWeatherPlaylist");

                database.ref('CloudyWeatherPlaylist').once("value", addVideosToPlaylist,
                    // If any errors are experienced, log them to console.
                    function (errorObject) {
                        console.log("The read failed: " + errorObject.code);
                    });

            } else {
                //If weather is clear get songs for sunny/clear weather
                console.log("Its Sunny out there");
                $("#weatherText").text("Clear is the sky!!!");

                //Set playlist name
                setCurrentPlaylistName("SunnyWeatherPlaylist");

                database.ref('SunnyWeatherPlaylist').on("value", addVideosToPlaylist,
                    // If any errors are experienced, log them to console.
                    function (errorObject) {
                        console.log("The read failed: " + errorObject.code);
                    });
            }
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }

    });


} //End of recommendedMusicByWeather()



/************************************************************************************************
 * This is an onClick event that triggers when the user clicks on "My Playlist" to go back to see
 * his/her playlist that was created by the user and that is linked to the username
 ************************************************************************************************/

$("#goToMyPlaylist").on("click", loadMyPlaylist);

function loadMyPlaylist() {
    {

        console.log("Inside #goToMyPlaylist.onClick()");

        //Set the header of the table back to "My Playlist"
        $("#playlistHeader").text("My Playlist");

        //Remove link that says "Go to my Playlist" as now the user will be shown his/her actual Playlist
        $("#goToMyPlaylist").empty();

        //Set current playlist
        setCurrentPlaylistName("My Playlist");


        //Empty the user's playlist to add recomended music list
        $("tbody").empty();

        database.ref(`${username}`).on("value", addVideosToPlaylist,
            // If any errors are experienced, log them to console.
            function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });

    } //End of loadMyPlaylist()


}
