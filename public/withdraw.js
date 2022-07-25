function Withdraw() {
  const [status, setStatus] = React.useState('');
  const [amount, setAmount] = React.useState('');
  var [balance, setBalance] = React.useState('');  

  React.useEffect(() => {
    fetch('/account/balance')
      .then (response => response.json())
      .then (json_data => {
          console.log(json_data);
          if (json_data.balance === null) { // no user is logged in
            setStatus('Please Log In');
          }
           
          setBalance(json_data.balance);
      });
  }, []);


  function validate(field){
      if (isNaN(field) || field.trim() == '') { // white space is not a number
        console.log('Error: Amount is not a number');
        setStatus('Error: Amount is not a number');
        setTimeout(() => setStatus(''),9000);
        return false;
      }
      else if (Number(field) <= 0) {
        setStatus('Error: Amount is not a positive number');
        setTimeout(() => setStatus(''),9000);
        return false;
      }
      return true;
  }

  function clearForm(){
    setAmount('');
  }

  function handleWithdraw() {
    if (!validate(amount))    return;
    fetch(`/account/withdraw/${amount}`)
      .then (response => response.json())
      .then (json_data => { // json_data is the document for logged in acct with new balance
        clearForm();
        setBalance(json_data.balance);
        if (json_data.balance < 0)
          setStatus('Account is Overdrawn');
        else
          setStatus('Withdrawal is successful');
        setTimeout(() => setStatus(''),9000);
      })    
  }

  return (
    <Card
      bgcolor="primary"
      header="Withdraw"
      status={status}
      body={(balance === null) ? 
            (
              null
            ) :
            (  
              <>
              Balance      {balance}<br/><br/>
              Withdraw Amount<br/>
              <input type="input" className="form-control" id="wdl_amount" placeholder="Withdraw Amount"
               value={amount} onChange={e => setAmount(e.currentTarget.value)}/><br/>

              {(!amount.trim()) ?
              <button type="submit" className="btn btn-light" disabled>Withdraw</button> :
              <button type="submit" className="btn btn-light" onClick={handleWithdraw}>Withdraw</button>}
              </>
            )}
    />
  )
}
