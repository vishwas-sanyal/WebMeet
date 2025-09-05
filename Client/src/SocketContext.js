import React, { createContext, useRef, useState, useEffect } from "react";
import { io } from 'socket.io-client';
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io('http://localhost:3000');

const ContextProvider = ({ children }) => {

    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                // myVideo.current.srcObject = currentStream;
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream; // ✅ safe
                }
            })
            .catch((err) => {
                console.error("❌ Failed to get media stream:", err);
            });
        socket.on('me', (id) => setMe(id));
        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal })
        });
    }, []);

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from });
        })
        peer.on('stream', (currentStream) => {
            // userVideo.current.srcObject = currentStream;
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream; // ✅ safe
            }
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }
    const callUser = (id) => {

        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
        })
        peer.on('stream', (currentStream) => {
            // userVideo.current.srcObject = currentStream;
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream; // ✅ safe
            }
        });

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        })
        connectionRef.current = peer;
    }
    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }

    return (
        <SocketContext.Provider value={{ callAccepted, call, myVideo, userVideo, stream, name, setName, callEnded, me, callUser, leaveCall, answerCall }}>
            {children}
        </SocketContext.Provider>
    )
}
export { ContextProvider, SocketContext }