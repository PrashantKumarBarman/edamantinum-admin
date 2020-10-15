import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faPlusCircle, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { getcsrftoken } from './Util';
import Loader from './Loader';
import Actions from './Actions';

function Add(props) {
    // eslint-disable-next-line
    let [dataObj, setDataObj] = useState({ title: "", link: "", topics: [],  });
    let [inProgress, setInProgress] = useState(false);
    let [isValid, setIsValid] = useState(true);
    let [validStates, setValidStates] = useState({title: true});
    let [notification, setNotification] = useState(false);

    let errorMsgs = {title: 'Title is Required'};

    let validators = { title: function(title) {
            if(title === "") {
                errorMsgs['title'] = 'Title is required';
                return false;
            }
            errorMsgs['title'] = '';
            return true;
        }
    };

    function validator() {
        let valid = true;
        let validStates = {};
        for(let element in validators) {
            let result = validators[element](dataObj[element]);
            validStates[element] = result;
            if(result === false) {
                valid = false;
            }
        }
        setValidStates(validStates);
        setIsValid(valid);
        return valid;
    }

    let Topics = (props) => {
        let Add = (props) => {
            let [topic, setTopic] = useState("");
            let [isEmpty, setIsEmpty] = useState(false);

            let handleChange = (e) => {
                setTopic(e.target.value);
            };

            let addTopic = () => {
                if(topic !== "") {
                    setIsEmpty(false);
                    props.addTopic(topic);
                }
                else {
                    setIsEmpty(true);
                }
            };

            return (
                <div className="row pl-1 pr-1">
                <div className="col-md">
                <label>Topics:</label>
                <div className="form-group form-inline">
                <input type="text" name="topics" value={ topic } onChange={ handleChange } placeholder="Enter topics" className="form-control"/>
                <FontAwesomeIcon onClick = { addTopic } icon={faPlusCircle} style = { { color: 'DodgerBlue' } } size='2x' className="default pointer"/>
                { isEmpty ? 
                <div className="alert alert-danger">Empty Topic</div> : ''
                }
                </div>
                </div>
                </div>
            );
        };

        let TopicList = (props) => {

            return (
                <div className = 'topic-container'>
                { props.topics.map((item, index) => 
                    <div className='topic' key={index}>
                        <span className="default">{item}</span>
                        <FontAwesomeIcon icon={ faTimesCircle } onClick={ () => { props.deleteTopic(index) } } className="default"/>
                    </div>
                ) }
                </div>
            );
        };

        return (
            <div style = { { width: '100%' }}>
                <Add addTopic = { props.addTopic } />
                <TopicList topics = { props.topics } deleteTopic = { props.deleteTopic } />
            </div>
        );
    };

    function handleChange(e) {
        setDataObj({...dataObj, [e.target.name]: e.target.value});
    }

    function addTopic(topic) {
        let topics = [...dataObj.topics];
        topics.push(topic);
        setDataObj({ ...dataObj, topics: topics });
    }

    function deleteTopic(delIndex) {
        let topics = [];
        dataObj.topics.forEach((topic, index) => {
            if(index !== delIndex) {
                topics.push(topic);
            }
        });
        setDataObj({ ...dataObj, topics: topics });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if(validator()) {
            setInProgress(true);
            fetch('/api/resource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'XSRF-TOKEN': getcsrftoken()
                },
                body: JSON.stringify(dataObj)
            }).then((response) => { 
                if(response.status === 200) {
                    setNotification(true);
                    setInProgress(false);
                    setTimeout(() => {
                        setNotification(false);
                    }, 5000);
                    props.notify(Actions.AddCompleted);
                } 
            });
        }
    }

    let element = props.active === true ? (
        <div className="add">
        { inProgress ? <Loader /> : '' }
        <form method="POST" action="/resource">
        <div className="row">

        <div className="col-md-6">
        <div className="form-group">
        <label>Title:</label>
        <input type="text" name="title" value={ dataObj.title } onChange={ handleChange } placeholder="Enter title" className="form-control"/>
        { !isValid && !validStates.title ? <div className="alert alert-danger default">{errorMsgs.title}</div> : '' }
        </div>
        </div>

        <div className="col-md-6">
        <div className="form-group">
        <label>Link:</label>
        <input type="text" name="link" value={ dataObj.link } onChange={ handleChange } placeholder="Enter link" className="form-control"/>
        </div>
        </div>

        </div>

        <Topics topics = { dataObj.topics } addTopic = { addTopic } deleteTopic = { deleteTopic } />
        
        <div className="row pl-1 pr-1">
        <div className="col-md-2">
            <div className="form-group">
            <button type="submit" onClick={ handleSubmit } className="btn btn-success" disabled = { inProgress }>Save</button>
            </div>
        </div>
        </div>

        { notification ? 
            <div className="row">
            <div className="alert alert-success alert-dismissible ml-3">
                <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>Resource Added Successfully
            </div>
            </div> : '' 
        }
        
        </form>
        </div>
        ) : '';
    
    return element;
}

export default Add;