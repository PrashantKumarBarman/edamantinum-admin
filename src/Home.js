import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import TopMenu from './TopMenu';
import Add from './Add';
import ResourceList from './ResourceList';
import Actions from './Actions';

function Home(props) {

    let element;
    let [resources, setResources] = useState([]);
    let [addViewState, setAddViewState] = useState(false);
    let [actionInProgress, setActionInProgress] = useState(null);

    function logout() {
        localStorage.removeItem('loggedIn');
        props.notifyLoginState(false, 0);
    }

    function receiveAddViewState(state) {
        setAddViewState(state);
    }

    function receiveNotifications(action) {
        switch(action) {
            case Actions.AddCompleted:
            case Actions.EditCompleted:
            case Actions.DeleteCompleted:
                getResources();
                break;
            default:
        }
    }

    let getResources = () => {
        setActionInProgress(Actions.FetchingData);
        fetch('/api/resources',
            { method: 'GET' }
        ).then((response) => {
            if(response.status === 200) 
                return response.json();
        }).then((response) => {
            setResources(response);
            setActionInProgress(null);
        });
    };

    useEffect(() => {
        if(props.loggedIn) {
            getResources();
        }
    }, [props.loggedIn]);

    if(props.loggedIn === true) {
        element =  
        <div className="container-fluid" style={ { height: '100%' }}> 
        <TopMenu logout = { logout } notify = { receiveAddViewState }  addViewState = { addViewState } />
        <Add notify = { receiveNotifications } active = { addViewState } />
        <ResourceList resources = { resources } notify = { receiveNotifications } actionInProgress = { actionInProgress } />
        </div>
        ;
    }
    else {
        element =  <Redirect to="/admin/login" />;
    }

    return element;
}

export default Home;