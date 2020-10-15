import React from 'react';

function Logout(props) {

    function logout() {
        fetch('/api/auth/logout')
        .then((response) => {
            if(response.status) {
                props.logout();
            }
        });
    }

    return (
        <div className='col-md-11'>
            <div className='float-right'>
            <button className="btn btn-primary default" onClick= { logout }>Logout</button>
            </div>
        </div>
    );
}

export default Logout;
