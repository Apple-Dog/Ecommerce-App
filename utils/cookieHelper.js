import cookieOptions from "../utils/cookieOptions";



const cookieHelper = (token) =>{

    //Cookie Options
    const CookieOptions = cookieOptions(3*24*60*60*1000);

    // Creating Cookies Along with Some Data
    res.cookie("token", token, CookieOptions);

    // Sending Bearer Token
    res.setHeader("Authorization", "Bearer "+ token);
};

export default cookieHelper;