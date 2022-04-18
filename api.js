require('express');
require('mongodb');
require('dotenv').config();

//gmail login
const GmailLogin = process.env.GMAILLOGIN;
const GmailPass = process.env.GMAILPASS;

//load user model
const User = require("./models/user.js");

//load meal model
const Meal = require("./models/meal.js");

//load goal model
const Goal = require("./models/goal.js");

//load secret code 
const secretCode = require("./models/secretCode.js");

// create reusable transporter object using the default SMTP transport
const nodemailer = require('nodemailer');
const meal = require('./models/meal.js');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GmailLogin,
        pass: GmailPass
    }   
});

exports.setApp = function ( app, client )
{
    app.post('/api/register', async (req, res, next) =>{
        //get registration data from frontend
        const { FirstName, LastName, Login, Password, Email, Birthday} = req.body; 
        
        //generate random code
        const crypto = require('crypto');
        const randomCode = crypto.randomBytes(8).toString('hex');

        var error = '';
        
        //create new user and verification code
        const newUser = await new User({FirstName:FirstName, LastName:LastName, Login:Login, Password:Password, Email:Email, Birthday:Birthday, Verified:false});
        const newCode = await new secretCode({Email:Email, Code: randomCode});
        var id = -1;

        try{
            //save new user in database
            await newUser.save(); 

            //save new verification code
            await newCode.save();
            
            const findUser = await User.find({FirstName:FirstName, LastName:LastName, Login:Login, Password:Password, Email:Email, Birthday:Birthday, Verified:false});
            
            //send verification email with url containing newUser:userId and newCode:randomCode
            const mailData = {
                from: 'nutritionapp315@gmail.com',  // sender address
                to: Email,   // list of receivers
                subject: 'Verification Email',
                text: 'Click the url to verify your account',
                html: "nutrition-app-27.herokuapp.com/api/verifyuser/" + findUser[0].UserId + "/" + randomCode
            };

            transporter.sendMail(mailData, function (err, info) {
                if(err)
                  console.log(err);
                else
                  console.log(info);
            });
        }
        catch(e){
            error = e.toString();
        }

        var ret = { error: error };  
        res.status(200).json(ret);
    });

    app.post('/api/login', async (req, res, next) => {

        const { Login, Password, jwtToken } = req.body;
        var token = require('./createJWT.js');
        var newToken = null;

        var id = -1;
        var FirstName = '';
        var LastName = '';
        var Email = '';
        var Birthday = '';
        var Verified = false;
        var error = '';

        var ret = {UserId:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday, Verified:Verified, error:error};
        
        const results = await User.find({Login:Login, Password:Password});

        //if user found
        if(results.length > 0 ){
            id = results[0].UserId;
            FirstName = results[0].FirstName;
            LastName = results[0].LastName;
            Email = results[0].Email;
            Birthday = results[0].Birthday;
            Verified = results[0].Verified; 
            
            ret = {UserId:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday, Verified:Verified, error:error };

            //if user hasnt been verified through email set the error and resend the email
            if(Verified === false)
            {
                error = "Account not verified, resending verification email";
                
                //generate random code
                const crypto = require('crypto');
                const randomCode = await crypto.randomBytes(8).toString('hex');

                //save code to database
                const newCode = await new secretCode({Email:Email, Code: randomCode});
                await newCode.save();

                //send email
                const mailData = {
                    from: 'nutritionapp315@gmail.com',  // sender address
                    to: Email,   // reciever
                    subject: 'Verification Email',
                    text: 'Click the url to verify your account',
                    html: "nutrition-app-27.herokuapp.com/api/verifyuser/" + id + "/" + randomCode
                };
                transporter.sendMail(mailData, function (err, info) {
                    if(err)
                      console.log(err);
                    else
                      console.log(info);
                });
            }
            //user is verified
            else{
                //create a new token for the registered account
                newToken = token.createToken( id, FirstName, LastName);

                // Unsucessful in creating token
                if (newToken === null)
                {
                    error = "Failed to start user session.";
                }
                
                //all good, send back ret with user's data
                ret = {UserId:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday, Verified:Verified, jwtToken: newToken, error:error };
            }

        }
        else{
            //login not found
            ret = {UserId:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday, Verified:Verified, error:"error: Login/Password incorrect"};
        }

        //send json to frontend
        res.status(200).json(ret);
    });

    app.get('/api/verifyuser/:UserId/:Code', async (req, res, next) => {
        //get the userId and verification code based on the url parameters (in the email)
        const { UserId, Code } = req.params;
        
        //search the database for the user based on their id
        const findUser = await User.find({UserId:UserId});
        
        error = '';
        Email = '';
        
        if(findUser.length > 0){
            //check the database if the code hasn't expired and matches the email
            Email = findUser[0].Email;
            const findCode = await secretCode.find({Email:Email, Code:Code});

            if(findCode.length > 0){
                //update database to verify user
                const updateUser = await User.findOneAndUpdate({UserId:UserId}, {Verified:true});
            }
            else{
                error = "likely expired authorization code";
            }

        }
        else{
            error = "Couldn't find user";
        }

        //set error status
        ret = {error: error};
        
        //send the user back to the login page
        //res.status(200).render("/index.html");
        
        //send error json data
        res.status(200).json(ret);
        
    });

    app.post('/api/passwordresetrequest', async (req, res, next) => {
        //get login from frontend
        const { Login } = req.body;

        //search the database for the user based on their id
        const findUser = await User.find({Login:Login});
        
        error = '';

        //if user found 
        if(findUser.length > 0){
            //send email to reset your password
            Email = findUser[0].Email;
            id = findUser[0].UserId;

            // Made this to test api on local
            linkPath = ""; //needs to be a link to a page in the frontend
            route = "api/passwordreset/" + id;
            if (process.env.NODE_ENV === 'production') 
            {
                linkPath = 'https://' + app_name +  '.herokuapp.com/' + route;
            }
            else
            {        
                linkPath = 'http://localhost:3000/' + route;
            }

            const mailData = {
                from: 'nutritionapp315@gmail.com',  // sender address
                to: Email,   // reciever
                subject: 'Verification Email',
                text: 'Click the url to reset your password',
                html: linkPath
            };
            transporter.sendMail(mailData, function (err, info) {
                if(err)
                  console.log(err);
                else
                  console.log(info);
            });
        }
        else{
            error = "Couldn't find user";
        }

        //set error status
        ret = {error: error};
        
        //send the user back to the login page
        //res.status(200).render("/index.html");
        
        //send error json data
        res.status(200).json(ret);

    });

    app.post('/api/passwordreset/:UserId', async (req, res, next) => {
        //get userId from url (will parse the link sent to their email which contains their userId)
        const { UserId } = req.params;

        //get the old and new password from the frontend
        //const { oldPassword, newPassword } = req.body;
        const { NewPassword } = req.body;

        //search database for user
        const findUser = await User.find({UserId:UserId});

        error = '';

        //if user found and old password matches, update the password
        if(findUser.length > 0){
            //if(findUser[0].Password == oldPassword)
            if(findUser[0].Password != NewPassword)
            {
                const updateUser = await User.findOneAndUpdate({UserId:UserId}, {Password:NewPassword});      
            }
            else{
                //error = "Incorrect password";
                error = "Need to Change to a New Password";
            }
            
        }
        else{
            error = "Couldn't find user";
        }

        //set error status
        ret = {error: error};
        
        //send the user back to the login page
        res.status(200).render("frontend/src/pages/LoginPage.js");
        
        //send error json data
        res.status(200).json(ret);

    });

    //add meal endpoint
    app.post('/api/addmeal', async (req, res, next) => {
        let token = require('./createJWT.js');

        //get user input from frontend
        const { UserId, Name, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol, jwtToken } = req.body;
        var refreshedToken = null;
        var error = '';
        
        //check token
        try{
            if( token.isExpired(jwtToken)){
                var r = {error:'The JWT is no longer valid', jwtToken: ''};
                res.status(200).json(r);
                return;
            }
            refreshedToken = token.refresh(jwtToken);
            
            // Failed to create new token when refreshing
            if (refreshedToken === null)
            {
                error = "Failed to renew your current session";
                var ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
            }
        }
        catch(e){
            console.log(e.message);
        }

        //create new meal
        const newMeal = await new Meal({UserId:UserId, Name:Name, Calories:Calories, Protein:Protein, Carbs:Carbs, Fat:Fat, Fiber:Fiber, Sugar:Sugar, Sodium:Sodium, Cholesterol:Cholesterol});
 
        try {
            //store new meal in db
            await newMeal.save();
        }

        catch(e) {
            error = e.toString();
        }

        //send error json data
        var ret = { error: error, jwtToken:refreshedToken };  
        res.status(200).json(ret);
    });
    
    //delete meal
    app.delete('/api/deletemeal/:id', async (req, res, next) => {
        let token = require('./createJWT.js');
        var refreshedToken = null;
        let meal;

        //check token
        try{
            if( token.isExpired(jwtToken)){
                var r = {error:'The JWT is no longer valid', jwtToken: ''};
                res.status(200).json(r);
                return;
            }
            refreshedToken = token.refresh(jwtToken);
            
            // Failed to create new token when refreshing
            if (refreshedToken === null)
            {
                error = "Failed to renew your current session";
                var ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
            }
        }
        catch(e){
            console.log(e.message);
        }

        try {
            Meal.findByIdAndRemove({_id: req.params.id}).then(function(meal){
                //res.send(meal);
                meal = meal
            });
        }
        catch(e) {
            error = e.toString();
        }

        //send error json data
        var ret = {meal:meal, error: error, jwtToken:refreshedToken};  
        res.status(200).json(ret);
    });

    //search by meal id
    app.get('/api/searchmeal/:id', async (req, res, next) => {
        let meal;
        
        try {
            meal = await Meal.findById(req.params.id);

            if(meal == null) {
                return res.status(404).json(ret);
            }
        }
        catch(e) {
            error = e.toString();
        }

        res.meal = meal;
        res.send(res.meal.Name);
    });

    // ? indicates an optional parameter
    app.get('/api/filtersearch/:UserId/:name?', async (req, res, next) => {

        // Empty string can not be passed so pick up empty string value in this case
        if (!req.params.name)
        {
            searchName = "";
        }
        else 
        {
            searchName = req.params.name;
        }

        let partialToMatchName = new RegExp(searchName,'i');
        
        Meal.find({Name: partialToMatchName, UserId: req.params.UserId}, function(err, foundMeal) {
            if (foundMeal != '') {
                res.send(foundMeal);
            } else {
                res.send("No meal matching that name was found.");
            }
        });

    });

    //add goal endpoint
    app.post('/api/addgoal', async (req, res, next) => {
        let token = require('./createJWT.js');
        var refreshedToken = null;

        //get user input from frontend
        const { UserId, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol } = req.body;

        //create new goal
        const newGoal = await new Goal({UserId:UserId, Calories:Calories, Protein:Protein, Carbs:Carbs, Fat:Fat, Fiber:Fiber, Sugar:Sugar, Sodium:Sodium, Cholesterol:Cholesterol});
        var error = '';

        //check token
        try{
            if( token.isExpired(jwtToken)){
                var r = {error:'The JWT is no longer valid', jwtToken: ''};
                res.status(200).json(r);
                return;
            }
            refreshedToken = token.refresh(jwtToken);
            
            // Failed to create new token when refreshing
            if (refreshedToken === null)
            {
                error = "Failed to renew your current session";
                var ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
            }
        }
        catch(e){
            console.log(e.message);
        }
        
        try {
            //store new goal in db
            await newGoal.save();
        }
        catch(e) {
            error = e.toString();
        }

        //set error status
        var ret = {error: error, jwtToken: refreshedToken};

        //send error json data
        res.status(200).json(ret);
    });

    //retrieve goals by UserId
    app.get('/api/retrievegoal/:UserId', async (req, res, next) => {

        Goal.find({UserId: req.params.UserId}, function(err, foundGoal) {
            if (foundGoal != '') {
                res.send(foundGoal);
            } else {
                res.send("No goals found.");
            }
        });
    });

    //edit goal endpoint
    app.put('/api/editGoal/:id', async (req, res, next) => {
        let token = require('./createJWT.js');
        var refreshedToken = null;

        const body = req.body;
        let goal = await Goal.findById(req.params.id);

        //check token
        try{
            if( token.isExpired(jwtToken)){
                var r = {error:'The JWT is no longer valid', jwtToken: ''};
                res.status(200).json(r);
                return;
            }
            refreshedToken = token.refresh(jwtToken);
            
            // Failed to create new token when refreshing
            if (refreshedToken === null)
            {
                error = "Failed to renew your current session";
                var ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
            }
        }
        catch(e){
            console.log(e.message);
        }

        if(body.Calories) {
            goal.Calories = body.Calories;
        }

        if(body.Protein) {
            goal.Protein = body.Protein;
        }

        if(body.Carbs) {
            goal.Carbs = body.Carbs;
        }

        if(body.Fat) {
            goal.Fat = body.Fat;
        }
        
        if(body.Fiber) {
            goal.Fiber = body.Fiber;
        }

        if(body.Sugar) {
            goal.Sugar = body.Sugar;
        }

        if(body.Sodium) {
            goal.Sodium = body.Sodium;
        }

        if(body.Cholesterol) {
            goal.Cholesterol = body.Cholesterol;
        }
        
        await goal.save();
        
        var ret = {goal: goal, jwtToken: refreshedToken}
        
        return res.status(200).json(ret);

    });
}