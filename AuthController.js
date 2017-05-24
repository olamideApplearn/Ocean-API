/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `AuthController.login()`
   */
  login: function (req, res) {
        //Extract email & password
      let email = req.param('email'),
          password = req.param('password');
      
        //validate email
      if(!email){
          return res.badRequest({err: 'invalid email'});
      }
      
        //validate password
      if(!password){
          return res.badRequest({err: 'invalid password'});
      }
      
        //create loginRequest method
      const loginReq = async () => {
          
          //find user by email
          const user = await User.findOne({
              email
          });
          
          //check is password matched with current password
          const isMatched = await User.checkPassword(password,user.password)
          
          //if password is not matched
          if(!isMatched){
              throw new Error ('Your Password is not matched');
          }
          
          //create a resp object
          let resp = {
              user
          };
          
          //generate token object
          let token=JwtService.issue({
              user,
              expiresIn:'1d'
          })
          //get the encrypted password for this user
          resp.token = token;
          return resp;
          
          //compare the encrypted password with current password
          
      };
      
      //call login request 
      loginReq()
      .then(user => res.ok(user))
      //replace serverError to forbidden
      .catch(err => res.forbidden(err));
  },


  /**
   * `AuthController.signup()`
   */
  signup: function (req, res) {
        //Extract firstName of the user
      let firstName = req.param('first_name'),
          lastName = req.param('last_name'),
          email =req.param('email'),
          password = req.param('password');
      
        //validate firstName
      if(!firstName){
          return res.badRequest({err: 'invalid first_name'});
      }
      
        //validate lastName
      if(!lastName){
          return res.badRequest({err: 'invalid last_name'});
      }
      
        //validate email
      if(!email){
          return res.badRequest({err: 'invalid email'});
      }
      
        //validate password
      if(!password){
          return res.badRequest({err: 'invalid password'});
      }
      
        //create async method signupRequest 
      const signupRequest = async () => {
        //add code into try catch
          try{
              
              //call the UtilService encryptpassword
              const encPassword = await UtilService.encryptPassword(password);
              //create User
              const user = await User.create({
                  first_name:firstName,
                  last_name:lastName,
                  email,
                  password:encPassword
              });
              //send response to server
              return res.ok(user);
          }
          catch(e){
              throw e;
          }
      };
      
      signupRequest()
      .then(user => res.ok(user))
      .catch(err => res.serverError(err));
   }
};

