require('express');
require('mongodb');

//load user model
const User = require("./models/user.js");
//load meal model
//const meal = require("./models/meal.js");

exports.setApp = function ( app, client )
{
    var token = require('./createJWT.js');

    //endpoints
    app.post('/api/register', async (req, res, next) =>{
        const { FirstName, LastName, Login, Password, Email, Birthday, jwtToken  } = req.body;
    
        try{
          if( token.isExpired(jwtToken)){
            var r = {error:'The JWT is no longer valid', jwtToken: ''};
            res.status(200).json(r);
            return;
          }
        }
        catch(e){
          console.log(e.message);
        }

        const newUser = new User({FirstName:FirstName, LastName:LastName, Login:Login, Password:Password, Email:Email, Birthday:Birthday});
        var error = '';

        try{
            const db = client.db();
            const result = db.collection('Users').insertOne(newUser);
        }
        catch(e){
            error = e.toString();
        }

        var refreshedToken = null;
        
        try{
            refreshedToken = token.refresh(jwtToken);
        }
        catch(e){
            console.log(e.message);
        }
        var ret = { error: error, jwtToken: refreshedToken };
        res.status(200).json(ret);
    });

    app.post('/api/login', async (req, res, next) => {

        const { login, password } = req.body;
        const results = await db.collection('Users').find({Login:login,Password:password});

        var id = -1;
        var fn = '';
        var ln = '';
        var Email = '';
        var Birthday = '';

        var ret;

        if( results.length > 0 ){
            id = results[0].UserId;
            fn = results[0].FirstName;
            ln = results[0].LastName;
            Email = results[0].Email;
            Birthday = results[0].Birthday;
            
            try{
                const token = require("./createJWT.js");
                ret = token.createToken( fn, ln, id );
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