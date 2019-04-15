// Get username from sessionStorage and store it in global variable 'username' 
var username = sessionStorage.getItem("username");
console.log("Username in RecMusicByWeather.js from sessionstorage-> " + username);



/************************************************************************************************
 * recommendedMusicByWeather()
 * Function that makes an ajax call to weather api and gets the respose
 ************************************************************************************************/

function recommendedMusicByWeather() {

    console.log("Inside recommendedMusicByWeather()");

    // console.log("Weather playlist:--------");
    // console.log(weatherPlaylist.cloudy[0].songName + " : " +weatherPlaylist.cloudy[0].artist);
    // console.log(weatherPlaylist.clear[1].songName + " : " +weatherPlaylist.clear[1].artist);


    // This is our API key for weather app
    var APIKey = "166a433c57516f51dfab1f7edaed8413";

    var cityState = "Somerset,New Jersey";
    // var cityState = "Fremont,California";

    // Here we are building the URL we need to query the database
    //https://api.openweathermap.org/data/2.5/weather?q=Somerset,New Jersey&appid=166a433c57516f51dfab1f7edaed8413
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityState}&appid=${APIKey}`;


    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({

        url: queryURL,
        method: "GET",

        // We store all of the retrieved data inside of an object called "response"
        success: function (response) {

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            console.log("Weather: " + response.weather[0].main);

            //Get the weather "Clouds/Clear"
            var currWeather = response.weather[0].main;

            //Empty the user's playlist to add recomended music list
            $("tbody").empty();

            //Set the header of the table now to "Recommended Videos"
            $("#playlistHeader").text("Recommended Videos");

            //Add link to "Go To My Playlist" for user to go back to his/her playlist
            $("<label>")
                // .append(`<i class="fas fa-backward"></i>`)
                //.append(`<i class="far fa-hand-point-left"></i>`)
                .append(`<i class="fas fa-hand-point-left"></i>`)
                .append("  My Playlist")
                .addClass("btn-link")
                .appendTo($("#goToMyPlaylist"));


            //If weather is cloudy get atleast 10 songs with this category 
            if (currWeather === "Clouds") {

                console.log("Its cloudy out there");
                $("#weatherText").text("Clouds in the sky!!!");

                // database.ref(`${username}/${objectName}`).once("value", function (snapshot) {
                database.ref('CloudyWeatherPlaylist').once("value", addVideosToPlaylist,
                    // If any errors are experienced, log them to console.
                    function (errorObject) {
                        console.log("The read failed: " + errorObject.code);
                    });

            } else {
                //If weather is clear get songs for sunny/clear weather
                console.log("Its Sunny out there");
                $("#weatherText").text("Clear is the sky!!!");

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

$("#goToMyPlaylist").on("click", function () {

    console.log("Inside #goToMyPlaylist.onClick()");

    //Set the header of the table back to "My Playlist"
    $("#playlistHeader").text("My Playlist");

    //Remove link that says "Go to my Playlist" as now the user will be shown his/her actual Playlist
    $("#goToMyPlaylist").empty();


    //Empty the user's playlist to add recomended music list
    $("tbody").empty();

    database.ref(`${username}`).on("value", addVideosToPlaylist,
        // If any errors are experienced, log them to console.
        function (errorObject) {
            console.log("The read failed: " + errorObject.code);
    });

   
});

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

            if (subChild.key === "song")
                song = subChild.val();
            if (subChild.key === "artist")
                artist = subChild.val();
            if (subChild.key === "songObjKey")
                songObjKey = subChild.val();

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
    $tr
        .attr("keyData", songObjKey)
        .attr("id", "playVideo")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")
        .attr("title", "Play Video");


    //create <td> for the song & artist
    //add content from childSnapshot.val() to corresponding <td> tags
    var $tdSongArtist = $("<td>").text(song + ", " + artist);


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


    $tr.append($tdSongArtist, $tdLyricsBtn, $tdCloseBtn, $tdRemoveBtn);
    // $tr.append($tdSongArtist, $tdPlayBtn, $tdCloseBtn, $tdLyricsBtn, $tdRemoveBtn);

    //lastly append entire table you created to $("tbody")
    $("tbody").prepend($tr);

}