// Transfer from the account that is currently logged in to the account referenced
// by the transferee email.

function Transfer() {
  const [status, setStatus] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [transferee, setTransferee] = React.useState(''); // email of account to which
                                                          // money will be transferred.
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


  function validateAmount(field){
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

  function handleTransfer() {
    if (!validateAmount(amount))    return;
    fetch(`/account/transfer/${transferee}/${amount}`)
      .then (response => response.json())
      .then (json_data => {
        if (json_data.msg) {
            setStatus(json_data.msg) // Transfer failed: transferee email not found
            setTimeout(() => setStatus(''),9000);
        }
        else {
            clearForm();
            setBalance(json_data.balance);
            if (json_data.balance < 0)
                setStatus('Account is Overdrawn');
            else
                setStatus('Transfer is successful');
            setTimeout(() => setStatus(''),9000);
        }
      })    
  }

  return (
    <Card
      bgcolor="primary"
      header="Transfer"
      status={status}
      body={(balance === null) ? 
            (
              null // no user is logged in
            ) :
            (  
              <>
              Balance      {balance}<br/><br/>
              Transfer Amount<br/>
              <input type="input" className="form-control" id="wdl_amount" placeholder="Transfer Amount"
               value={amount} onChange={e => setAmount(e.currentTarget.value)}/><br/>
               
              Transfer to email<br/>
              <input type="input" className="form-control" id="transferee" placeholder="Transfer to email"
               value={transferee} onChange={e => setTransferee(e.currentTarget.value)}/><br/>

              {(!amount.trim || !transferee.trim) ?
              <button type="submit" className="btn btn-light" disabled>Transfer</button> :
              <button type="submit" className="btn btn-light" onClick={handleTransfer}>Transfer</button>}
              </>
            )}
    />
  )
}
