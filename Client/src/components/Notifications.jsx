import React, { useContext } from 'react';
// import { Button } from '@mui/material';

import { SocketContext } from '../SocketContext';
import './styles.css';

const Notifications = () => {

    const { answerCall, call, callAccepted } = useContext(SocketContext);

    return (
        <>
            {call.isReceivedCall && !callAccepted && (
                <div className="incoming-call">
                    <h2>{call.name} is Calling:</h2>
                    <button onClick={answerCall}>Answer</button>
                </div>
            )}

        </>
    )
}

export default Notifications
