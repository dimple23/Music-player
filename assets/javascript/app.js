$(document).ready(function () {

  // set up event listener for form submit to capture username/email-id
  $("#username-form").on("submit", function(event) {
      event.preventDefault();

      console.log("Playlist requested");

      var username = $("#name-input").val().trim();

      console.log("username: " + username);

      //If username entered by the user is an empty string
      if(username === "") {
          $("#alertLabel")
              .text("Please enter your Username / Email-Id !!!")
              .css("color"="red");
      }

  });

});