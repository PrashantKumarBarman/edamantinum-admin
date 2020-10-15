import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlusCircle, faTimesCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';
import Actions from './Actions';
import { getcsrftoken } from './Util';

function ResourceList(props) {
    let [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        if(props.actionInProgress === Actions.FetchingData) {
            setInProgress(true);
        }
        else {
            setInProgress(false);
        }
    }, [props.actionInProgress]);

    function handleEvents(action) {
        switch(action) {
            case Actions.EditInProgress:
            case Actions.DeleteInProgress: 
                setInProgress(true);
                break;
            case Actions.EditCompleted:
            case Actions.DeleteCompleted:
                props.notify(action);
                break;
            default:
                setInProgress(false);
        }
    }

    function Resource(props) {
        let [mode, setMode] = useState('view');
        let [data, setData] = useState({});
        let [oldData, setOldData] = useState({});
        
        useEffect(() => {
            setData(props.data);
        }, [props.data]);

        function handleEdit(mode) {
            if(mode === 'edit') {
                setOldData(data);
                setMode('edit');
            }
            else if(mode === 'view') {
                setData(oldData);
                setMode('view');
            }
        }

        function handleChange(e) {
            setData({...data, [e.target.name]: e.target.value});
        }

        function ResourceView(props) {
            return (
                <li className="resource-container" key={props.data.id}>
                <FontAwesomeIcon onClick={ () => { props.handleEdit("edit") } } icon={ faEdit } className="default resource-edit" />
                <div className="row">
                <div className="col-md-1">
                <strong>Title:</strong>
                </div>
                <div className="col-md-10">
                <p>
                {props.data.title}
                </p>
                </div>
                </div>

                <div className="row">
                <div className="col-md-1">
                <strong>Link:</strong>
                </div>
                <div className="col-md-10">
                <p>
                {props.data.link}
                </p>
                </div>
                </div>
                
                <div className="row">
                <div className="col-md-1">
                <strong>Topics: </strong>
                </div>
                <div className="col-md-10">
                <div className = "topic-container">
                { props.data.topics ? props.data.topics.map((item, index) => 
                    <div className="topic" key={index}>
                        <span className="default">{item}</span>
                    </div>
                ) : '' }
                </div>
                </div>
                </div>

                </li> 
            );
        }
        
        function EditResourceView(props) {

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
                        <div className="row p-1">
                        <div className="col-md-1">
                        <strong>Topics:</strong>
                        </div>

                        <div className="col-md-10">
                        <div className="form-group form-inline">
                        <label></label>
                        <input type="text" name="topics" value={ topic } onChange={ handleChange } placeholder="Enter topics" className="form-control"/>
                        <FontAwesomeIcon onClick = { addTopic } icon={faPlusCircle} style = { { color: 'DodgerBlue' } } size='2x' className="default pointer"/>
                        { isEmpty ? 
                        <div className="alert alert-danger default">Empty Topic</div> : ''
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
                    <div>
                        <Add addTopic = { props.addTopic } />
                        <TopicList topics = { props.topics } deleteTopic = { props.deleteTopic } />
                    </div>
                );
            };

            let [data, setData] = useState({});

            useEffect(() => {
                setData(props.data);
            }, [props.data]);
            
            function handleChange(e) {
                setData({ ...data, [e.target.name]: e.target.value });
            }

            function addTopic(topic) {
                let topics = [...data.topics];
                topics.push(topic);
                setData({ ...data, topics: topics });
            }
        
            function deleteTopic(delIndex) {
                let topics = [];
                data.topics.forEach((topic, index) => {
                    if(index !== delIndex) {
                        topics.push(topic);
                    }
                });
                setData({ ...data, topics: topics });
            }

            function save() {
                props.notify(Actions.EditInProgress);
                fetch("/api/resource/" + data.id,
                    {   method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                            'XSRF-TOKEN': getcsrftoken()
                        },
                        body: JSON.stringify(data)
                    }
                )
                .then((response) => {
                    if(response.status === 200) {
                        props.notify(Actions.EditCompleted);
                    }
                });
            }

            function deleteResource() {
                console.log('t');
                props.notify(Actions.DeleteInProgress);
                fetch("/api/resource/" + data.id,
                    {   method: "DELETE",
                        headers: {
                            'XSRF-TOKEN': getcsrftoken()
                        }
                    }
                )
                .then((response) => {
                    if(response.status === 200) {
                        props.notify(Actions.DeleteCompleted);
                    }
                });
            }

            return (
                <li className="resource-container">
                <div className="row p-1">
                <div className="col-md-1">
                <strong>Title: </strong>
                </div>
                <div className="col-md-10">
                <input type="text" name='title' value={data.title} onChange = { handleChange } placeholder="Enter title" className="form-control" />
                </div>
                </div>

                <div className="row p-1">
                <div className="col-md-1">
                <strong>Link: </strong>
                </div>
                <div className="col-md-10">
                <input type="text" name='link' value={data.link} onChange = { handleChange } placeholder="Enter title" className="form-control" />
                </div>
                </div>

                { data.topics ? <Topics topics = { data.topics } addTopic = { addTopic } deleteTopic = { deleteTopic } /> : ''}

                <div className="row p-1">
                <div className="col-md-3 d-flex align-items-center">
                <button type="button" onClick={ save } className="btn btn-success m-1">Save</button>
                <button type="button" onClick = { () => props.handleEdit('view') } className="btn btn-danger m-1">Cancel</button>
                <FontAwesomeIcon icon={faTrashAlt} onClick={ deleteResource } className="default" size="2x" style={ { color: 'Crimson', cursor: 'pointer' } } />
                
                </div>
                </div>
                    
                </li> 
            );
        }

        return mode === 'view' ? <ResourceView data = { data } handleEdit = { handleEdit } /> :
            <EditResourceView data = { data} handleEdit = { handleEdit } handleChange = { handleChange } notify = { props.notify } />;
    }

    return (
        <div style = { { position: 'relative', height: '100%'} }>
        { inProgress ? <Loader /> : '' }
        <ul style={ { width: '100%', listStyleType: 'none' } } className="resourcelist">
        { props.resources.map((resource) => (<Resource key = { resource.id } data = { resource } notify = { handleEvents } />)) }
        </ul>
        </div>
    );
}

export default ResourceList;