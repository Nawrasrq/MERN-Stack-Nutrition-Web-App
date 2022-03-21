require('express');
require('mongodb');

//load user model
const User = require("./models/user.js");
//load meal model
//const meal = require("./models/meal.js");

exports.setApp = function ( app, client )
{
    //var token = require('./createJWT.js');

    //endpoints
    app.post('/api/register', async (req, res, next) =>{
        const { FirstName, LastName, Login, Password, Email, Birthday} = req.body; //, jwtToken  
    
        /*try{
          if( token.isExpired(jwtToken)){
            var r = {error:'The JWT is no longer valid', jwtToken: ''};
            res.status(200).json(r);
            return;
          }
        }
        catch(e){
          console.log(e.message);
        }
        */
        const newUser = new User({FirstName:FirstName, LastName:LastName, Login:Login, Password:Password, Email:Email, Birthday:Birthday});
        var error = '';

        try{
            newUser.save();
        }
        catch(e){
            error = e.toString();
        }
        //var refreshedToken = null;
        /*
        try{
            refreshedToken = token.refresh(jwtToken);
        }
        catch(e){
            console.log(e.message);
        }*/
        var ret = { error: error }; //, jwtToken: refreshedToken  
        res.status(200).json(ret);
    });

    app.post('/api/login', async (req, res, next) => {

        const { Login, Password } = req.body;
        error = '';

        try{
            const results = await User.find({Login:Login, Password:Password});
        }
        catch(e){
            error = e.toString();
        }
        
        var id = -1;
        var FirstName = '';
        var LastName = '';
        var Email = '';
        var Birthday = '';

        var ret;

        if( results.length > 0 ){
            id = results[0].UserId;
            FirstName = results[0].FirstName;
            LastName = results[0].LastName;
            Email = results[0].Email;
            Birthday = results[0].Birthday;
            

            try{
                //const token = require("./createJWT.js");
                //ret = token.createToken( id, fn, ln, Email, Birthday );
                ret = { UserId:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday};
            }

            catch(e){
                ret = {error:e.message};
            }

        }
        else{
            ret = {error:"Login/Password incorrect"};
        }

        res.status(200).json(ret);
    });
}