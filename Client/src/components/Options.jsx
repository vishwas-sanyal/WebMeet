import React, { useContext, useState } from 'react';

import { SocketContext } from './../SocketContext';
import './styles.css';

const Options = ({ children }) => {

    const { me, callAccepted, name, setName, leaveCall, callUser, callEnded } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');

    return (
        <div>
            {children}
            <div className="container">
                <div className="box">
                    <h2>Account Info</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={() => navigator.clipboard.writeText(me)} style={{ background: "#3265bcff" }}>
                        Copy to clipboard
                    </button>
                </div>

                <div className="box">
                    <h2>Make a Call</h2>
                    <input
                        type="text"
                        placeholder="ID to Call"
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                    />
                    {callAccepted && !callEnded ? (
                        <button onClick={leaveCall} style={{ background: "#d93535ff", color: "white" }}>
                            Hang Up
                        </button>
                    ) : (
                        <button onClick={() => callUser(idToCall)} style={{ background: "#3da737" }}>Call</button>
                    )}
                </div>

            </div>
        </div>

    )
}

export default Options
