import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { getcsrftoken } from './Util';

function Login(props) {
    // eslint-disable-next-line
    let [dataObj, setDataObj] = useState({username: "", password: ""});

    let element;

    let [hasError, setHasError] = useState(false);

    let error = hasError === true ? <div className="alert alert-danger">Invalid Credentials</div> : '';

    if(props.loggedIn === true) {
        element = <Redirect to='/admin' />;
    }
    else {
        element = 
            <div style={ { height: '100%' } } className="container-fluid d-flex align-items-center justify-content-center">
            <div className="row">
            <form method="GET" action="/api/auth/login">
            <div className="row">
                <div className="col-md-12">
                <div className="form-group">
                <input type="text" name="username" value={ dataObj.username } onChange={ handleChange } placeholder="Enter username" className="form-control" />
                </div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-12">
                <div className="form-group">
                <input type="password" name="password" value= { dataObj.password } onChange={ handleChange } placeholder="Enter password" className="form-control" />
                </div>
                </div>
            </div>

            <div className="row d-flex justify-content-center">
            <div className="form-group">
            <button type="submit" onClick = { handleSubmit } className="btn btn-primary">Login</button>
            </div>
            </div>
            { error }
            </form>
            </div>
            
            </div>;
    }

    function handleChange(e) {
        setDataObj({...dataObj,
            [e.target.name] : e.target.value});
    }

    function handleSubmit(e) {
        e.preventDefault();
        fetch('/api/auth/login', { 
            method: 'POST',
            body: JSON.stringify(dataObj),
            headers: {
                'Content-Type': 'application/json',
                'XSRF-TOKEN': getcsrftoken()
            }
        }).then((response) => {
            if(response.status === 200) {
                return response.text();
            }
            else {
                return new Promise((resolve) => {
                    resolve(false);
                });
            }
        }).then((result) => {
            if(result === false) {
                setHasError(true);
            }
            else {
                props.notifyLoginState(true, result);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return element;
}

export default Login;