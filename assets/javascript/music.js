// Initialize Firebase
var config = {
    apiKey: "AIzaSyAAiQ_zDAg8V89Mq1Ea1lqXsphzI3YPscQ",
    authDomain: "muvutv.firebaseapp.com",
    databaseURL: "https://muvutv.firebaseio.com",
    projectId: "muvutv",
    storageBucket: "muvutv.appspot.com",
    messagingSenderId: "243405082277"
};
firebase.initializeApp(config);

var database = firebase.database();

//------------------------------------------------------------------------------------------------------

//GLOBAL variables declared/defined here:

//Variable to store global data 'username'
var username = "";

//Variable that hold song id of currently playing song
var currentVideoId = "";

//------------------------------------------------------------------------------------------------------

$(document).ready(function () {

    // Get username from sessionStorage and store it in global variable 'username' 
    username = sessionStorage.getItem("username");
    console.log("Username in music.js from sessionstorage-> " + username);
    $("#username-text").text(username);

    /************************************************************************************************
     * OnClick event listner that captures song and artist searched by the user
     ************************************************************************************************/

    $("#mySearchBtn").on("click", addSongToFirebase);

    function addSongToFirebase() {

        console.log("Inside addSongToFirebase()");

        //Get song and artist from input boxes
        var inputSong = $("#song-input").val().trim();
        var inputArtist = $("#artist-input").val().trim();

        //Both song and artist name is mandatory so do not proceed if either one is null
        if (inputSong === "" || inputArtist === "") {

            if (inputSong === "")
                $("#song-input").attr("placeholder", "Enter valid song!");

            if (inputArtist === "")
                $("#artist-input").attr("placeholder", "Enter valid artist!");

            return;
        }

        //Now code has both song name and artist name
        console.log(inputSong + " : " + inputArtist);

        //Add both in an object
        var songObj = {
            song: inputSong,
            artist: inputArtist,
            songObjKey: "" //Initially this key will be empty and will be populated on "database.ref().on("child_added".." event
        };


        //If 'username' is present 'key' will reference to that obj else create an object whith name 'username'
        var rootRef = database.ref();
        var key = rootRef.child(`${username}`);
        console.log("key = " + key);

        // Store 'songObj' in username's playlist in firebase DB
        database.ref(`/${username}`).push(songObj);


        //Clear sond and artist input fields
        $("#song-input").val("");
        $("#artist-input").val("");
    }




    /************************************************************************************************
     * OnClick event listner that triggers only when a child is added and populates only data of that new child 
     ************************************************************************************************/

    database.ref(`/${username}`).on("child_added", childAddedEvent,
        // If any errors are experienced, log them to console.
        function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    function childAddedEvent(childSnapshot) {

        console.log("In childAddedEvent()");

        console.log(childSnapshot.val());

        //Get the Object (Key) of the songObj to be associated with Delete, Play, Close and lyrics button
        var objectName = childSnapshot.key;
        console.log("objectName: " + objectName);

        //Also set the objects child "songObjKey" set to it for further reference
        //database.ref().child(`${username}`).child(`${objectName}`).child('songObjKey').set(objectName, function () {
        database.ref(`${username}/${objectName}/songObjKey`).set(objectName, function () {

            // query database for song info
            database.ref(`${username}/${objectName}`).once("value", function (snapshot) {

                // console.log(snapshot.val());

                //Get all objects from DB
                var songObj = snapshot.val();

                console.log(songObj.song + " : " + songObj.artist + " : " + songObj.songObjKey);


                //------------------------------------ Create Table row --------------------------------------
                //create a table row 
                var $tr = $("<tr>");

                //create <td> for the song & artist
                //add content from childSnapshot.val() to corresponding <td> tags
                var $tdSongArtist = $("<td>").text(songObj.song + ", " + songObj.artist);

                var $tdPlayBtn = $("<td>");
                $tdPlayBtn
                    .attr("keyData", songObj.songObjKey)
                    .attr("id", "playVideo")
                    .attr("data-toggle", "tooltip")
                    .attr("data-placement", "top")
                    .attr("title", "Play Video")
                    .html(`<i class="fas fa-play-circle"></i>`);

                var $tdCloseBtn = $("<td>");
                $tdCloseBtn
                    .attr("keyData", songObj.songObjKey)
                    .attr("id", "closeVideo")
                    .attr("data-toggle", "tooltip")
                    .attr("data-placement", "top")
                    .attr("title", "Close Video")
                    .html(`<i class="fas fa-window-close"></i>`);

                var $tdLyricsBtn = $("<td>");
                $tdLyricsBtn
                    .attr("keyData", songObj.songObjKey)
                    .attr("id", "lyrics")
                    .attr("data-toggle", "tooltip")
                    .attr("data-placement", "top")
                    .attr("title", "Show Lyrics")
                    .html(`<i class="fas fa-music"></i>`);

                var $tdRemoveBtn = $("<td>");
                $tdRemoveBtn
                    .attr("keyData", songObj.songObjKey)
                    .attr("id", "delete")
                    .attr("data-toggle", "tooltip")
                    .attr("data-placement", "top")
                    .attr("title", "Delete Song from Playlist")
                    .html(`<i class="far fa-trash-alt"></i>`);


                $tr.append($tdSongArtist, $tdPlayBtn, $tdLyricsBtn, $tdRemoveBtn);
                // $tr.append($tdSongArtist, $tdPlayBtn, $tdCloseBtn, $tdLyricsBtn, $tdRemoveBtn);

                //lastly append entire table you created to $("tbody")
                $("tbody").prepend($tr);

            })
        });


    } //End of childAddedEvent(childSnapshot)


    /************************************************************************************************
     * OnClick event listner that triggers only when user wants to Play video of the song selected 
     ************************************************************************************************/

    // Set up event listener for Play video button 
    $("tbody").on("click", "#playVideo", playVideo);

    function playVideo(event) {

        console.log("Inside playVideo event");

        //Variable to store key value
        var keyVal = $(this).attr("keyData");
        console.log("keyVal to be played: " + keyVal);

        //If user clicks the Play btn of same song that is already playing/open then do nothing
        if (keyVal === currentVideoId) {
            return;
        }
        
        //
        $("#myVideo").empty();

        //Store song id in the global variable 
        currentVideoId = keyVal;

        var rootRef = database.ref().child(`${username}`);
        var dataRef = rootRef.child(`${keyVal}`);
        dataRef.once("value", function (snapshot) {

            $("<iframe>")
                .addClass("p-3")
                .attr("id", "youtubesearch")
                .attr("width", "420")
                .attr("height", "345")
                .css("border-radius", "30px")
                .css("border", "5px solid brown")
                .appendTo($("#myVideo"));


            //console.log(snapshot.val().song + " : "+ snapshot.val().artist);
            //Call youtubeSearch() function with song and artist as inputs to play the video
            youtubeSearch(snapshot.val().song, snapshot.val().artist);
        });

    } //End of playVideo()



    /*************************************************************************************************
     * OnClick event listner that triggers only when user wants to delete a song from the playlist 
     *************************************************************************************************/
    // Set up event listener for Delete button 
    $("tbody").on("click", "#delete", deleteSongData);

    function deleteSongData(event) {

        console.log("Inside deleteSongData()");

        //Variable to store key value
        var keyVal = $(this).attr("keyData");
        console.log("keyVal to be deleted: " + keyVal);

        var rootRef = database.ref().child(`${username}`);
        var dataRef = rootRef.child(`${keyVal}`);
        dataRef.once("value", function (snapshot) {
            console.log(snapshot.val());
        });

        //Remove song from the list in DB
        dataRef.remove()
            .then(function () {
                console.log("Remove succeeded.")
            })
            .catch(function (error) {
                console.log("Remove failed: " + error.message)
            });


        //Empty tbody data to refresh the entire user playlist
        $("tbody").empty();

        //Get the new playlist and reconstruct the playlist in UI
        rootRef = database.ref().child(`${username}`);
        rootRef.once("value", function (snapshot) {

            console.log(snapshot.val());
            console.log("-------snapshot over-------");

            snapshot.forEach(function (child) {
                // console.log(child.key+": "+child.val());
                childAddedEvent(child);
            });

        });

    } // End of deleteSongData(event) function


    /************************************************************************************************
     * OnClick event listner that triggers only when user wants to view the song lyrics 
     ************************************************************************************************/

    // Set up event listener for Lyrics button 
    $("tbody").on("click", "#lyrics", showSongLyrics);

    function showSongLyrics(event) {

        console.log("Inside showSongLyrics()");

        //Variable to store key value
        var keyVal = $(this).attr("keyData");
        console.log("keyVal used to get lyrics: " + keyVal);

        var rootRef = database.ref().child(`${username}`);
        var dataRef = rootRef.child(`${keyVal}`);
        dataRef.once("value", function (snapshot) {
            // console.log(snapshot.val());
            console.log("Calling searchLyrics() from lyrics.js");
            console.log(snapshot.val().song + " : " + snapshot.val().artist);

            //Call getLyrics function with song and artist as inputs to display the lyrics
            searchLyrics(snapshot.val().song, snapshot.val().artist);
        });

    } //End of showSongLyrics()


    /************************************************************************************************
     * OnClick event listner that triggers when user wants to logout and signup using 
     * different username/email-id 
     ************************************************************************************************/

    $("#myLogoutBtn").on("click", function () {

        // Clear sessionStorage
        sessionStorage.clear();

        // Set username into sessionStorage as empty string
        sessionStorage.setItem("username", "");

        window.location.href = "../../index.html";
    });


    /*************************************************************************************************
     * OnClick event listner that triggers when user selects Recommended Music based on current weather
     *************************************************************************************************/

    $("#getRecommendedWeatherSongs").on("click", function () {

        // recommendedMusicByWeather();
        addPlaylist();

    });



    //A custom script is used to activate tooltips:
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });



});
//End of document read
