const emailValidation = (email) =>{
    //Checks Wether email is Valid or Not on the Bases Of Pattern
    
    const validEmailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
    return (validEmailPattern.test(email));
};

export default emailValidation;