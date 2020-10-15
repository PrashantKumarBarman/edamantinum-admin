import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Logout from './Logout';

let Add = (props) => { 
    function handleClick() {
        props.notify(!props.addViewState);
    }

    return (
        <div className='col-md-1'>
        <FontAwesomeIcon onClick={ handleClick } icon={faPlusCircle} style = { { color: 'MediumSeaGreen' } } className="default pointer" size="2x" />
        </div>
    )
};

function TopMenu(props) {

    return (
        <div className='row d-flex align-items-center pt-1'>
            <Add notify = { props.notify } addViewState = { props.addViewState } />
            <Logout logout = { props.logout } />
        </div>
    );
}

export default TopMenu;