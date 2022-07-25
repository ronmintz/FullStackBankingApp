function AllData() {
    const [data, setData] = React.useState('');

    React.useEffect(() => {
        fetch('/account/all')
            .then (response => response.json())
            .then (json_data =>               
                {
                    let str_data = ["Name", "Email", "Password", "Balance",
                                    "------", "------", "----------", "---------"];

                    for (let index = 0; index < json_data.length; index++ ) {
                        let json_doc = json_data[index];
                        str_data.push(json_doc.name);
                        str_data.push(json_doc.email);
                        str_data.push(json_doc.password);
                        str_data.push(json_doc.balance);                    
                    }
                    
                    setData(str_data.map((field,i)=><div key={i}>{field}</div>));
               
                });
    }, []);

    return (
        <CardU
          bgcolor="primary"
          txtcolor="white"
          header="All Data"
          body={data}
        />
      )
    
}