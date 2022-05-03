require('dotenv').config();
require('express');
require('mongodb');

//gmail login
const GmailLogin = process.env.GMAILLOGIN;
const GmailPass = process.env.GMAILPASS;

//load user model
const User = require("./models/user.js");
//load meal model
const Meal = require("./models/meal.js");
//load TrackedFood model
const trackedFood = require("./models/trackedFood.js");
//load goal model
const Goal = require("./models/goal.js");
//load secret code 
const secretCode = require("./models/secretCode.js");
//load weight
const Weight = require("./models/weight.js"); 

// create reusable transporter object using the default SMTP transport
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GmailLogin,
        pass: GmailPass
    }   
});

exports.setApp = function ( app, client )
{
    //API for users ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Register user
    app.post('/api/register', async (req, res, next) =>{
        //input: FirstName, LastName, Login, Password, Email, Birthday
        //output: error
        
        //get registration data from frontend
        const { FirstName, LastName, Login, Password, Email, Birthday} = req.body; 
        let error = '';
        let ret = {};

        //generate random code
        const crypto = require('crypto');
        const randomCode = crypto.randomBytes(8).toString('hex');

        //create new user and verification code
        const newUser = await new User({FirstName:FirstName, LastName:LastName, Login:Login, Password:Password, Email:Email, Birthday:Birthday, Verified:false});
        const newCode = await new secretCode({Email:Email, Code: randomCode});

        try{
            //save new user in database
            await newUser.save(); 

            //save new verification code
            await newCode.save();
            
            const findUser = await User.find({FirstName:FirstName, LastName:LastName, Login:Login, Password:Password, Email:Email, Birthday:Birthday, Verified:false});
            
            //create goal upon registering 
            const newGoal = await new Goal({UserId:findUser[0].UserId, Weight:154, Calories:2000, Protein:50, Carbs:300, Fat:78, Fiber:28, Sugar:50, Sodium: 2.3, Cholesterol:.3});
            await newGoal.save();

            //send verification email with url containing newUser:userId and newCode:randomCode
            const mailData = {
                from: 'nutritionapp315@gmail.com',  // sender address
                to: Email,   // list of receivers
                subject: 'Verification Email',
                text: 'Click the url to verify your account',
                html: "nutrition-app-27.herokuapp.com/api/verifyuser/" + findUser[0].UserId + "/" + randomCode
            };

            transporter.sendMail(mailData, function (err, info) {
                if(err){
                  error = err;
                  ret = { error: error };
                }  
                else{
                  console.log(info);
                  
                  //success
                  error = '';
                  ret = { error: error };  
                }
            });
        }
        catch(e){
            error = e.toString();
            ret = { error: error };  
        }

        ret = { error: error }; 
        res.status(200).json(ret);
    });

    //login user
    app.post('/api/login', async (req, res, next) => {
        //input: Login, Password
        //output: UserId, FirstName, LastName, Email, Birthday, Verified, newToken, error

        let token = require('./createJWT.js');

        const { Login, Password} = req.body;

        let error = '';
        let ret = {};

        let id = -1;
        let FirstName = '';
        let LastName = '';
        let Email = '';
        let Birthday = '';
        let Verified = false;
        let newToken = null;

        const results = await User.find({Login:Login, Password:Password});

        //if user found
        if(results.length > 0 ){
            id = results[0].UserId;
            FirstName = results[0].FirstName;
            LastName = results[0].LastName;
            Email = results[0].Email;
            Birthday = results[0].Birthday;
            Verified = results[0].Verified; 

            //if user hasnt been verified through email set the error and resend the email
            if(Verified === false){
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
                    if(err){
                        console.log(err);
                        ret = {error:err};
                    }
                    else{
                        console.log(info);

                        //send back userdata, was found but wasnt verified
                        error = "Account not verified, resending verification email";
                        ret = {error:error};
                    }
                });
            }
            //user is verified
            else{
                //create a new token for the registered account
                newToken = token.createToken( id, FirstName, LastName);

                // Unsucessful in creating token
                if (newToken === null){
                    error = "Failed to start user session";
                    ret = {error: error};
                }
                else{
                    //all good, send back ret with user's data
                    error = '';
                    ret = {UserId:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday, Verified:Verified, jwtToken: newToken, error:error };
                }
            }
        }
        //login not found
        else{
            error = "Login/Password incorrect";
            ret = {error: error};
        }

        //send json to frontend
        res.status(200).json(ret);
    });

    //API for verification and password reset /////////////////////////////////////////////////////////////////////////////////////////////////////
    //email link leads to this endpoint to verify user
    app.get('/api/verifyuser/:UserId/:Code', async (req, res, next) => {
        //input: UserId, verification code
        //output: error

        //get the userId and verification code based on the url parameters (in the email)
        const { UserId, Code } = req.params;

        let error = '';
        let ret = {};
        
        //search the database for the user based on their id
        const findUser = await User.find({UserId:UserId});
        
        if(findUser.length > 0){

            //check the database if the code hasn't expired and matches the email
            let Email = findUser[0].Email;
            const findCode = await secretCode.find({Email:Email, Code:Code});

            if(findCode.length > 0){
                //update database to verify user
                const updateUser = await User.findOneAndUpdate({UserId:UserId}, {Verified:true});
                
                //success
                error = "";
                ret = {error: error};
            }
            else{
                error = "expired authorization code";
                ret = {error: error};
            }

        }
        else{
            error = "Couldn't find user";
            ret = {error: error};
        }

        //send error json data
        res.status(200).json(ret); 
    });

    //request for an email to reset password
    app.post('/api/passwordresetrequest', async (req, res, next) => {
        //input: Login
        //output: error
        
        //get login from frontend
        const { Login } = req.body;
        
        let error = '';
        let ret = {};
        
        //search the database for the user based on their id
        const findUser = await User.find({Login:Login});
        
        //if user found 
        if(findUser.length > 0){
            //send email to reset your password
            let Email = findUser[0].Email;
            let id = findUser[0].UserId;

            const mailData = {
                from: 'nutritionapp315@gmail.com',  // sender address
                to: Email,   // reciever
                subject: 'Reset Password',
                text: 'Click the url to reset your password',
                html: "nutrition-app-27.herokuapp.com/api/passwordreset/" + id
            };
            transporter.sendMail(mailData, function (err, info) {
                if(err){
                    error = err;
                    ret = {error: error};
                }
                else{
                    console.log(info);
                    
                    //success
                    error = '';
                    ret = {error: error};
                }
            });
        }
        else{
            error = "Couldn't find user";
            ret = {error: error};
        }
        
        //send error json data
        ret = {error: error};
        res.status(200).json(ret);
    });

    //reset password
    app.post('/api/passwordreset/:UserId', async (req, res, next) => {
        //input: UserId, OldPassword
        //output: error
        
        //get userId from url (will parse the link sent to their email which contains their userId)
        const { UserId } = req.params;

        //get the old and new password from the frontend
        //const { oldPassword, newPassword } = req.body;
        const { NewPassword } = req.body;

        let error = '';
        let ret = {};

        //search database for user
        const findUser = await User.find({UserId:UserId});

        //if user found and old password matches, update the password
        if(findUser.length > 0){

            //if(findUser[0].Password == oldPassword)
            if(findUser[0].Password != NewPassword){
                const updateUser = await User.findOneAndUpdate({UserId:UserId}, {Password:NewPassword});  
                
                //success
                error = '';
                ret = {error: error};    
            }
            else{
                //error = "Incorrect password";
                error = "Need to Change to a New Password";
                ret = {error: error};
            }
            
        }
        else{
            error = "Couldn't find user";
            ret = {error: error};
        }

        //send error json data
        ret = {error: error};
        res.status(200).json(ret);
    });

    //API for meals //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //add meal endpoint
    app.post('/api/addmeal', async (req, res, next) => {
        //input UserId, Name, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol, jwtToken
        //output error, refreshedToken
        
        let token = require('./createJWT.js');

        //get user input from frontend
        const { UserId, Name, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol, jwtToken } = req.body;
        
        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }

        //create new meal
        const newMeal = await new Meal({UserId:UserId, Name:Name, Calories:Calories, Protein:Protein, Carbs:Carbs, Fat:Fat, Fiber:Fiber, Sugar:Sugar, Sodium:Sodium, Cholesterol:Cholesterol});
 
        try {
            //store new meal in db
            await newMeal.save();

            //success
            error = '';
            ret = { error: error, jwtToken:refreshedToken };  
        }
        catch(e) {
            error = e.toString();
            ret = { error: error, jwtToken:refreshedToken };  
        }

        res.status(200).json(ret);
    });
    
    //delete meal
    app.delete('/api/deletemeal/:id', async (req, res, next) => {
        //input meal._id, jwtToken
        //output error, refreshedToken

        let token = require('./createJWT.js');
        
        const {jwtToken} = req.body;
        const id = req.params.id;

        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }

        try {
            Meal.findByIdAndRemove({_id: id}).then(function(meal){
                meal = this.meal;
            });

            //success
            error = "";
            ret = {error: error, jwtToken:refreshedToken};
        }
        catch(e) {
            error = e.toString();
            ret = { error:error, jwtToken:refreshedToken };  
        }

        res.status(200).json(ret);
    });

    //search by meal id and return meal name
    app.get('/api/searchmeal/:id', async (req, res, next) => {
        //input meal._id
        //output mealName, error

        const id = req.params.id;

        let error = '';
        let ret = {};

        let mealName = '';

        try {
            const findMeal = await Meal.findById(id);

            if(findMeal.length > 0) {
                mealName = meal[0].name;

                //success
                error = "";
                ret = {error: error, mealName: mealName};
            }
            else{
                error = "meal not found";
                ret = {error: error};          
            }
        }
        catch(e) {
            error = e.toString();
            ret = {error: error};
        }

        res.status(200).json(ret);
    });

    app.put('/api/editmeal/:id', async (req, res, next) => {
        //input: meal._id, Name, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol, jwtToken
        //output: error, jwtToken

        let token = require('./createJWT.js');
        
        const {Name, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol, jwtToken} = req.body;
        const {id} = req.params.id;

        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }

        //search for meal
        const meal = await Meal.findById(id);

        // Check if anything will actually be updated
        if (!Name && !Calories && !Protein
            && !Carbs && !Fat && !Fiber
            && !Sugar && !Sodium && !Cholesterol)
        {
            error = "No fields were edited.";
            ret = {meal: meal, error: error, jwtToken: refreshedToken};
        }
        else
        {
            if(meal){
                if(Name) meal.Name = Name;
                if(Calories) meal.Calories = Calories;
                if(Protein) meal.Protein = Protein;
                if(Carbs) meal.Carbs = Carbs;
                if(Fat) meal.Fat = Fat;
                if(Fiber) meal.Fiber = Fiber;
                if(Sugar) meal.Sugar = Sugar;
                if(Sodium) meal.Sodium = Sodium;
                if(Cholesterol) meal.Cholesterol = Cholesterol;

                await meal.save();

                //success
                error = "";
                ret = {meal: meal, error: error, jwtToken: refreshedToken};
            }
            else{
                error = "meal not found";
                ret = {error: error, jwtToken: refreshedToken};
            }
        }
        
        res.status(200).json(ret);
    });

    // ? indicates an optional parameter
    app.get('/api/filtersearch/:UserId/:name?', async (req, res, next) => {
        //input: UserId, Name
        //output: meal, error
        const {UserId, name} = req.params;

        var searchName;

        // Empty string can not be passed so pick up empty string value in this case
        if (!name){
            searchName = "";
        }
        else {
            searchName = name;
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

    //API for goals /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //retrieve goals by UserId
    app.get('/api/retrievegoal/:UserId', async (req, res, next) => {
        //input: UserId, 
        //output: goal, error

        const {UserId} = req.params;
        let error = '';
        let ret = {};

        Goal.find({UserId: UserId}, function(err, foundGoal) {
            if (foundGoal != '') {
                //success
                error = "";
            } 
            else {
                error = "No goals found";
            }
            ret = {goal: foundGoal[0], error: error};
            res.status(200).json(ret);
        });
    });

    //edit goal endpoint
    app.put('/api/editGoal', async (req, res, next) => {
        //input: userId, Weight, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol, jwtToken
        //output: error, jwtToken

        let token = require('./createJWT.js');
        
        const {UserId, Weight, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol, jwtToken} = req.body;

        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }

        //search for goal
        try{    
            const goal = await Goal.find({UserId:UserId});
            const updatedGoal = await Goal.findOneAndUpdate({UserId:UserId}, {Weight:Weight, Calories:Calories, Protein:Protein, Carbs:Carbs, Fat:Fat,
                                                        Fiber:Fiber, Sugar:Sugar, Sodium:Sodium, Cholesterol:Cholesterol});
            //success
            error = "";
            ret = {goal: updatedGoal, error: error, jwtToken: refreshedToken};
        }
        catch(e){
            error = e.message;
            ret = {error: error, jwtToken: refreshedToken};
        }
        
        res.status(200).json(ret);
    });

    //API for tracking meals ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //track a meal
    app.post('/api/trackmeal', async (req, res, next) => {
        //input: UserId, Name, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol, Category, Quantity, Date, jwtToken
        //output: error, refreshedToken

        let token = require('./createJWT.js');

        //get user input from frontend
        const { UserId, MealId, Name, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol, Category, Quantity, Date, jwtToken } = req.body;
        
        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }
        
        //track new meal
        try {
            //if meal already exists then increase quantity
            const findUser = await trackedFood.find({UserId:UserId, MealId:MealId, Category:Category, Date:Date});
            if(findUser.length > 0){
                const NewQuantity = findUser[0].Quantity + Quantity; 
                let updatedTracked = await trackedFood.findOneAndUpdate({UserId:UserId, MealId:MealId, Category:Category, Date:Date}, {Quantity:NewQuantity});
            }
            //create new food to track
            else{
                const newtrackedFood = await new trackedFood({UserId:UserId, MealId:MealId, Name:Name, Calories:Calories, Protein:Protein, 
                    Carbs:Carbs, Fat:Fat, Fiber:Fiber, Sugar:Sugar, Sodium:Sodium, Cholesterol:Cholesterol, Category:Category, Quantity:Quantity, 
                    Date:Date});
                await newtrackedFood.save();
            }
            //success
            error = '';
            ret = { error: error, jwtToken:refreshedToken };  
        }
        catch(e) {
            error = e.toString();
            ret = {error: error, jwtToken:refreshedToken};
            res.status(200).json(ret);
            return;
        }

        res.status(200).json(ret);
    });

    //API for editing tracked meal quanitity ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //track a meal
    app.post('/api/editTrackMealQty', async (req, res, next) => {
        //input: trackedMealId, Quantity, jwtToken
        //output: error, refreshedToken

        let token = require('./createJWT.js');

        //get user input from frontend
        const { trackedMealId, Quantity, jwtToken } = req.body;
        
        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }
        
        //edit the tracked meal quantity
        try {
            //Check to make sure tracked meal already exists then increase quantity
            const findUser = await trackedFood.find({_id:trackedMealId});
            if(findUser.length > 0){
                const NewQuantity = Quantity; 
                let updatedTracked = await trackedFood.findOneAndUpdate({_id:trackedMealId}, {Quantity:NewQuantity});
                error='';
            }
            //create new food to track
            else{
                error='Failed to find food to update quantity.';
            }
            //success
            ret = { error: error, jwtToken:refreshedToken };  
        }
        catch(e) {
            error = e.toString();
            ret = {error: error, jwtToken:refreshedToken};
            res.status(200).json(ret);
            return;
        }

        res.status(200).json(ret);
    });

    //retrieve all tracked foods
    app.post('/api/retrievetracked', async (req, res, next) => {
        //input: UserId, jwtToken, Date
        //output: array of all trackedmeals, error, refreshedToken

        let token = require('./createJWT.js');

        //get user input from frontend
        const { UserId, jwtToken, Date } = req.body;
        
        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }

        try {
            //find all tracked meals associated with user
            const trackedFoods = await trackedFood.find({UserId:UserId, Date:Date});

            if(trackedFoods.length > 0){
                //success
                error = '';
                ret = { trackedFoods: trackedFoods, error: error, jwtToken:refreshedToken };  
            }
            else{
                error = 'No foods found';
                ret = { error: error, jwtToken:refreshedToken };
            }
        }
        catch(e) {
            error = e.toString();
            ret = {error: error, jwtToken:refreshedToken};
            res.status(200).json(ret);
            return;
        }

        res.status(200).json(ret);
    });

    //delete trackedFood
    app.delete('/api/deletetracked/:id', async (req, res, next) => {
        //input trackedmeal._id, jwtToken
        //output error, refreshedToken

        let token = require('./createJWT.js');
        
        const {jwtToken} = req.body;
        const id = req.params.id;

        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }
        
        //find and delete tracked meal
        try {
            trackedFood.findByIdAndRemove({_id: id}).then(function(food){
                food = this.food;
            });

            //success
            error = "";
            ret = {error: error, jwtToken:refreshedToken};
        }
        catch(e) {
            error = e.toString();
            ret = { error:error, jwtToken:refreshedToken };  
        }

        res.status(200).json(ret);
    });

    //add weight endpoint
    app.post('/api/addweight', async (req, res, next) => {
        //input UserId, newWeight, Date, jwtToken
        //output error, refreshedToken
        
        let token = require('./createJWT.js');

        //get user input from frontend
        const { UserId, newWeight, Date, jwtToken } = req.body;

        if (!newWeight || newWeight <= 0)
            return;
        
        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }

        //create new weight
        const weight = await Weight.find({UserId:UserId});
        const updatedWeight = await Weight.findOneAndUpdate({UserId:UserId, Date:Date}, {Weight:newWeight});
        if (updatedWeight)
            return;

        const addWeight = await new Weight({UserId:UserId, Weight:newWeight, Date:Date});
 
        try {
            //store new weight in db
            await addWeight.save();

            //success
            error = '';
            ret = { error: error, jwtToken:refreshedToken };  
        }
        catch(e) {
            error = e.toString();
            ret = { error: error, jwtToken:refreshedToken };
            res.status(200).json(ret);
            return;
        }

        res.status(200).json(ret);
    });

    //retrieve all weights of user
    app.post('/api/retrieveWeights', async (req, res, next) => {
        //input: UserId, jwtToken
        //output: array of all weights, error, refreshedToken

        let token = require('./createJWT.js');

        //get user input from frontend
        const { UserId, jwtToken} = req.body;
        
        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }

        try {
            //find all weights associated with user
            const weight = await Weight.find({UserId:UserId});

            if(weight.length > 0){
                //success
                error = '';
                ret = { weights: weight, error: error, jwtToken:refreshedToken };
            }
            else{
                error = 'No weight found';
                ret = { weights: [], error: error, jwtToken:refreshedToken };
            }
        }
        catch(e) {
            error = e.toString();
            ret = {error: error, jwtToken:refreshedToken};
            res.status(200).json(ret);
            return;
        }

        res.status(200).json(ret);
    });

    //delete weight
    app.delete('/api/deleteweight/:id', async (req, res, next) => {
        //input weight._id, jwtToken
        //output error, refreshedToken

        let token = require('./createJWT.js');
        
        const {jwtToken} = req.body;
        const id = req.params.id;

        let refreshedToken = null;
        let error = '';
        let ret = {};

        //check token
        try{
            if( token.isExpired(jwtToken)){
                error = 'The JWT is no longer valid';
                ret = {error: error, jwtToken: ''};
                res.status(200).json(ret);
                return;
            }

            refreshedToken = token.refresh(jwtToken);

            // Failed to create new token when refreshing
            if (refreshedToken === null){
                error = "Failed to renew your current session";
                ret = { error:error, jwtToken:refreshedToken };  
                res.status(200).json(ret);
                return;
            }
        }
        catch(e){
            error = e.message;
            ret = { error:error}; 
            res.status(200).json(ret); 
            return;
        }
        
        //find and delete weight
        try {
            trackedFood.findByIdAndRemove({_id: id}).then(function(weight){
                weight = this.weight;
            });

            //success
            error = "";
            ret = {error: error, jwtToken:refreshedToken};
        }
        catch(e) {
            error = e.toString();
            ret = { error:error, jwtToken:refreshedToken };  
        }

        res.status(200).json(ret);
    });

}