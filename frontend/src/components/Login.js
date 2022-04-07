import React, { useState } from 'react';

const app_name = 'nutrition-app-27'

function Login()
{
    var storage = require('../tokenStorage.js');

    var loginName;
    var loginPassword;
    const [message,setMessage] = useState('');
    
    const doLogin = async event => 
    {
        event.preventDefault();
        var obj = {Login:loginName.value, Password:loginPassword.value};
        var js = JSON.stringify(obj);
        try
        {    
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/login'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            
            if( res.userId <= 0 )
            {
                setMessage(res.error);
            }
            else
            {
                storage.storeToken(res.accessToken);

                let userId = res.userId;
                let fn = res.firstName;
                let ln = res.lastName;

                var user = {firstName:fn, lastName:ln, id:userId}

                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/Main';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };
    
    return(
      <div id="loginDiv">
        <form onSubmit={doLogin}>
        <span id="inner-title">PLEASE LOG IN</span><br />
        <input type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c} />
        <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />
        <input type="submit" id="loginButton" class="buttons" value = "Do It" onClick={doLogin} />
        </form>
        <span id="loginResult">{message}</span>
     </div>
    );
};
export default Login;