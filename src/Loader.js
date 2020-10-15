import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

function Loader() {
    let loaderStyle = { position: 'absolute', 
                        backgroundColor: 'rgb(255, 255, 255, 0.5)', 
                        width: '100%', 
                        height: '100%', 
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                     };
    return (
        <div style={ loaderStyle }>
            <FontAwesomeIcon icon={ faCircleNotch } style={ { color: 'DodgerBlue' } } className="default fa-spin" size="2x" />
        </div>
    );
}

export default Loader;