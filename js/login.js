$(document).ready(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user)
        {
            var user = firebase.auth().currentUser;
            var name,email, photoUrl, uid, emailVerified;

            if (user != null) {
                name = user.displayName;
                email = user.email;
                photoUrl = user.photoURL;
                emailVerified = user.emailVerified;
                uid = user.uid; 
            }
        } else {
            // window.location.href = ("login.html");
        }
    })
})

function login() {
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    .then((user) => {
       window.location.href= "index.html"
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error: " + errorMessage );
  });
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href= "login.html"
      }).catch((error) => {
        // An error happened.
      });
}