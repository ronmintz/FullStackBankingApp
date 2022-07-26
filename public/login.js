import { initializeApp } from "firebase/app";


function Login(){
    // user matching email & password is logged in for deposits, withdrawals, & balances
    // If Email or Password incorrect, no one will be logged in.
  const [status, setStatus]     = React.useState('');
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');

 
  
  const firebaseConfig = {
    apiKey: "AIzaSyDs4Te4FYm4On9ypQEkCcea_Y9b4_ggDjI",
    authDomain: "auth-using.firebaseapp.com",
    projectId: "auth-using",
    storageBucket: "auth-using.appspot.com",
    messagingSenderId: "899393193226",
    appId: "1:899393193226:web:f5c862980cc1781dd666f3"
  };

  
  // Initialize Firebase
  if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  }
  


  function validate(field, label){
      if (!field) {
        setStatus('Error: ' + label);
        setTimeout(() => setStatus(''), 9000);
        return false;
      }
      return true;
  }

  function handleLogin() {
    console.log(email, password, "is entered");
    if (!validate(email,    'email'))    return;
    if (!validate(password, 'password')) return;

    const url = `/account/login/${email}/${password}`;
    (async () => {
      var res = await fetch(url);
      var acct_doc = await res.json(); // user doc for new login
      const logged_in_email = document.getElementById("logged_in_email");

      if (acct_doc.msg) { // account for this email does not exist or password is incorrect
        logged_in_email.innerHTML = "no one logged in";
        setStatus(acct_doc.msg);
        setTimeout(() => setStatus(''),9000);       
      }
      else {
        logged_in_email.innerHTML = acct_doc.email + " is logged in";
        setStatus('Login Successful for ' + acct_doc.name);        
      }
    })();

    clearForm();
  }    

  function handleGoogleLogin() {
    console.log("Google Login selected");
    const logged_in_email = document.getElementById("logged_in_email");

    var provider =  new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) { // Google login authorized, but check that account been created for this email.
        const url = `/account/preauthorizedlogin/${result.user.email}`;
        (async () => {
          var res = await fetch(url);
          var acct_doc = await res.json(); // user doc for email entered into google
          
          if (acct_doc.msg) { // account for this email does not exist
            logged_in_email.innerHTML = "no one logged in";
            setStatus(acct_doc.msg);
            setTimeout(() => setStatus(''),9000);       
          }
          else {
            logged_in_email.innerHTML = acct_doc.email + " is logged in";
            setStatus('Login Successful for ' + acct_doc.name);        
          }
        })();

        clearForm();
      })
      .catch (function (error) {
        setStatus("Google login failed: entered incorrect or no Google password");
        console.log(error.code);
        console.log(error.message);

        // log out any existing user on attempted login
        const url = '/account/logout';
        (async () => {
          await fetch(url);
          logged_in_email.innerHTML = "no one logged in";
        })();
      });
  
  }

  function clearForm(){
    setEmail('');
    setPassword('');
  }

  function handleLogout() {
    const url = '/account/logout';
    (async () => {
      await fetch(url);
      const logged_in_email = document.getElementById("logged_in_email");
      logged_in_email.innerHTML = "no one logged in";
      setStatus('Logout Successful');
      setTimeout(() => setStatus(''),9000);       
    })();
  }

  return (
    <Card
      bgcolor="primary"
      header="Login / Logout"
      status={status}
      body={(  
              <>
              Email address<br/>
              <input type="input" className="form-control" id="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.currentTarget.value)}/><br/>
              Password<br/>
              <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.currentTarget.value)}/><br/>
              <button type="submit" className="btn btn-light" onClick={handleLogin}>Login</button><span> </span>
              <button type="submit" className="btn btn-light" onClick={handleGoogleLogin}>Login with Google</button><br/><br/>
              <button type="submit" className="btn btn-light" onClick={handleLogout}>Logout</button>
              </>
            )}
    />
  )
}
