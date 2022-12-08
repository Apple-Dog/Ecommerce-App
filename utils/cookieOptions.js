// Expiration Time : ( Number of Days ) * ( Number of Hours / Default Value 24) * 
                                                         // ( Number of Minutes / Default Value 60 ) * 
                                                        // ( Number of Seconds / Default Value 60 ) * 
                                                       // ( Number of Milli-Seconds / Default Value 1000 )

const cookieOptions = (expirationTime) => {

    return( {   expires: new Date(Date.now() + expirationTime),
                httpOnly:true,
    });
}

export default cookieOptions;

//Cookie Options