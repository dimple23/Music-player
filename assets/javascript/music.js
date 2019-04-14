// Initialize Firebase
var config = {
  apiKey: "AIzaSyCT-KDNFkVJo9gk993FOk6qkb3Tp7wgNBw",
  authDomain: "j-a-m-d-music-player.firebaseapp.com",
  databaseURL: "https://j-a-m-d-music-player.firebaseio.com",
  projectId: "j-a-m-d-music-player",
  storageBucket: "j-a-m-d-music-player.appspot.com",
  messagingSenderId: "992825107716"
};
firebase.initializeApp(config);

var database=firebase.database();

var songName="";
var artistName="";


var playlist = [
 {
     name: "jamd", //playlist[0]
     songsObj: [
         {   //songsObj[0]
             songName: "My Heart Will Go On",
             artist: "Céline Dion"
         },
         {   //songsObj[1]
             songName: "Paradise",
             artist: "Coldplay"
         },
         {   //songsObj[2]
             songName: "Waka Waka",
             artist: "Shakira"
         }]
 }, {
     name: "John Doe", //playlist[1]
     songsObj: [
         {   //songsObj[0]
             songName: "Elevation",
             artist: "U2"
         },
         {   //songsObj[1]
             songName: "Everything I Do",
             artist: "Bryan Adams"
         }]
 }];

 console.log("your play list is:"+ playlist);
 for(var i=0 ; i<playlist.length ; i++) {
     console.log("Playlist: " + playlist[i].name);

     console.log("Songs :: Artist");
     for(var j=0 ; j<playlist[i].songsObj.length ; j++) {
         console.log(playlist[i].songsObj[j].songName + " :: " + playlist[i].songsObj[j].artist);
     }
 }

  console.log(playlist);
 database.ref().push(playlist);

database.ref().on("child_added",function(childSnapshot){


 console.log(childSnapshot.val());

 var searchList =childSnapshot.val();
 console.log(searchList);

 var $tr=$("<tr>");

 var $tdsongName=$("<td>").text(searchList.songName);

 var $tdartistName=$("<td>").text(searchList.artistName);



 $tr.append($tdsongName,$tdartistName);

 $("tbody").append($tr);
} ,function(errorObject){
 console.log("This is not working :"+ errorObject.code);
});