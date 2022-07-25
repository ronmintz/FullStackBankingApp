function CreateAccount(){
  const [show, setShow]         = React.useState(true);
  const [status, setStatus]     = React.useState('');
  const [name, setName]         = React.useState('');
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');

  function validate(field, label){
      if (!field) {
        setStatus('Error: ' + label + ' is blank');
        setTimeout(() => setStatus(''),9000);
        return false;
      }
      return true;
  }

  function validatePasswordLength(field){
    if (field.length < 8) {
      setStatus('Error: Password must be at least 8 characters');
      setTimeout(() => setStatus(''),9000);
      return false;
    }
    return true;
}

  function handleCreate(){
    console.log(name,email,password);
    if (!validate(name.trim(),  'name'))  return; // reject fields of only white space
    if (!validate(email.trim(), 'email')) return; // reject fields of only white space
    if (!validate(password, 'password')) return; // checks for empty password
    if (!validatePasswordLength(password)) return; // checks for password len < 8 chars

    const url = `/account/create/${name}/${email}/${password}`;
    (async () => {
        var res = await fetch(url);
        var acct_doc = await res.json(); // doc for newly created user
        const logged_in_email = document.getElementById("logged_in_email");

        if (acct_doc.msg === 'User already exists') {
          logged_in_email.innerHTML = "no one logged in";
          setStatus(acct_doc.msg);
          setTimeout(() => setStatus(''),9000);
        }
        else { // automatically log in user that is created
          logged_in_email.innerHTML = acct_doc.email + " is logged in";
          setStatus('');
          setShow(false);
        }
    })();
                                        

  }    

  function clearForm(){
    setName('');
    setEmail('');
    setPassword('');
    setShow(true);
  }

  return (
    <Card
      bgcolor="primary"
      header="Create Account"
      status={status}
      body={show ? (  
              <>
              Name<br/>
              <input type="input" className="form-control" id="name" placeholder="Enter name"
               value={name} onChange={e => setName(e.currentTarget.value)} /><br/>
              Email address<br/>
              <input type="input" className="form-control" id="email" placeholder="Enter email"
               value={email} onChange={e => setEmail(e.currentTarget.value)}/><br/>
              Password<br/>
              <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.currentTarget.value)} /><br/>

              {(name.trim() == '') && (email.trim() == '') && (password == '') ?
                (<button type="submit" className="btn btn-light" disabled>Create Account</button>) :
                (<button type="submit" className="btn btn-light" onClick={handleCreate}>Create Account</button>)}
              </>
            ):(
              <>
              <h5>Success</h5>
              <button type="submit" className="btn btn-light" onClick={clearForm}>Add another account</button>
              </>
            )}
    />
  )
}