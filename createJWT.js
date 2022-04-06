const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function ( id, FirstName, LastName, Email, Birthday )
{
    return _createToken( id, FirstName, LastName, Email, Birthday );
}

_createToken = function ( id, FirstName, LastName, Email, Birthday )
{
    try
    {
      const expiration = new Date();
      const user = {id:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday};
      const accessToken =  jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);
      // In order to exoire with a value other than the default, use the 
       // following
      /*
      const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: '30m'} );
                       '24h'
                      '365d'
      */
      var ret = {accessToken:accessToken, firstName:FirstName, lastName:LastName, userId:id};
    }
    catch(e)
    {
      var ret = {error:e.message};
    }
    return ret;
}

exports.isExpired = function( token )
{
   var isError = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, 
     (err, verifiedJwt) =>
   {
     if( err )
     {
       return true;
     }
     else
     {
       return false;
     }
   });
   return isError;
}

exports.refresh = function( token )
{
  let ud = jwt.decode(token,{complete:true});
  let id = ud.payload.id;
  let FirstName = ud.payload.FirstName;
  let LastName = ud.payload.LastName;
  let Email = ud.payload.Email;
  let Birthday = ud.payload.Birthday;

  return _createToken( id, FirstName, LastName, Email, Birthday );
}