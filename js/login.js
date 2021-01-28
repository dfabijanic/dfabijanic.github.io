function Login()
{
    const email = email_field.value;
    const pass = password_field.value;

    firebase.auth().signInWithEmailAndPassword(email, pass).then( (succesful) =>
    {
      var user = succesful.user;
      console.log(user);
        window.open('index.html', '_self');
    }).catch((ex) =>
    {
        alert(ex);
    });
}