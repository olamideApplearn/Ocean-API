const jwt = require ('jsonwebtoken');
const secret = 'secret12323hgda';
module.exports = {
    
   issue:(payload,expiresIn) => {
    //create issue method
       
       //sign the jwt with payload , secret and expirytime
       return jwt.sign({
           payload
       }, secret,
         { expiresIn });
       //return the token  
   },
    verify : token => {
        
        return jwt.verify(token, secret);
        
    }
    
    
};