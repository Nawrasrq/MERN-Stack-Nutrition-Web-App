const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function ( id, FirstName, LastName)
{
    return _createToken( id, FirstName, LastName);
}

_createToken = function ( id, FirstName, LastName)
{
    try
    {
      const expiration = new Date();
      const user = {id:id, FirstName:FirstName, LastName:LastName};
      const accessToken =  jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);
      // In order to exoire with a value other than the default, use the 
       // following
      /*
      const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: '30m'} );
                       '24h'
                      '365d'
      */
      var ret = accessToken;
    }
    catch(e)
    {
      console.log(e.message);
      var ret = null;
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
  var ud = jwt.decode(token,{complete:true});
  var id = ud.payload.id;
  var FirstName = ud.payload.FirstName;
  var LastName = ud.payload.LastName;

  return _createToken( id, FirstName, LastName );
}