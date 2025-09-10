// import React, { createContext, useRef, useState, useEffect } from "react";
// import { io } from 'socket.io-client';
// import Peer from "simple-peer";

// const SocketContext = createContext();

// const socket = io('http://localhost:3500');

// const ContextProvider = ({ children }) => {

//     const [stream, setStream] = useState(null);
//     const [me, setMe] = useState("");
//     const [call, setCall] = useState({});
//     const [callAccepted, setCallAccepted] = useState(false);
//     const [callEnded, setCallEnded] = useState(false);
//     const [name, setName] = useState("");

//     const myVideo = useRef();
//     const userVideo = useRef();
//     const connectionRef = useRef();

//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then((currentStream) => {
//                 setStream(currentStream);
//                 // myVideo.current.srcObject = currentStream;
//                 if (myVideo.current) {
//                     myVideo.current.srcObject = currentStream; // ✅ safe
//                 }
//             })
//             .catch((err) => {
//                 console.error("❌ Failed to get media stream:", err);
//             });
//         socket.on("connect", () => {
//             console.log("🔑 New socket connected:", socket.id);
//             setMe(socket.id);
//         });
//         socket.on('me', (id) => setMe(id));
//         socket.on('calluser', ({ from, name: callerName, signal }) => {
//             setCall({ isReceivedCall: true, from, name: callerName, signal })
//         });
//     }, []);

//     const answerCall = () => {
//         setCallAccepted(true);

//         const peer = new Peer({ initiator: false, trickle: false, stream });

//         peer.on('signal', (data) => {
//             socket.emit('answercall', { signal: data, to: call.from });
//         })
//         peer.on('stream', (currentStream) => {
//             // userVideo.current.srcObject = currentStream;
//             if (userVideo.current) {
//                 userVideo.current.srcObject = currentStream; // ✅ safe
//             }
//         });

//         peer.signal(call.signal);

//         connectionRef.current = peer;
//     }
//     const callUser = (id) => {

//         const peer = new Peer({ initiator: true, trickle: false, stream });

//         peer.on('signal', (data) => {
//             socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
//         })
//         peer.on('stream', (currentStream) => {
//             // userVideo.current.srcObject = currentStream;
//             if (userVideo.current) {
//                 userVideo.current.srcObject = currentStream; // ✅ safe
//             }
//         });

//         socket.on('callaccepted', (signal) => {
//             setCallAccepted(true);

//             peer.signal(signal);
//         })
//         connectionRef.current = peer;
//     }
//     const leaveCall = () => {
//         // setCallEnded(true);
//         // connectionRef.current.destroy();
//         // window.location.reload();
//         setCallEnded(true);

//         if (connectionRef.current) {
//             connectionRef.current.destroy();
//         }

//         socket.disconnect();  // ✅ Force disconnect from server
//         socket.connect();     // ✅ Force reconnect → new ID generated

//         // window.location.reload();

//     }

//     return (
//         // <SocketContext.Provider value={{ callAccepted, call, myVideo, userVideo, stream, name, setName, callEnded, me, callUser, leaveCall, answerCall }}>
//         <SocketContext.Provider
//             value={{
//                 callAccepted,
//                 call,
//                 myVideo,
//                 userVideo,
//                 stream,
//                 name,
//                 setName,
//                 callEnded,
//                 me,
//                 callUser,
//                 leaveCall,
//                 answerCall,
//             }}
//         >
//             {children}
//         </SocketContext.Provider >
//     )
// }
// export { ContextProvider, SocketContext }

// SocketContext.js (debug)
import React, { createContext, useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer/simplepeer.min.js";

const SocketContext = createContext();

// Create socket (point to backend)
const socket = io("https://webmeet-server.onrender.com/", {
    autoConnect: true,
    // force new connection each time (useful for dev)
    transports: ["websocket", "polling"],
});

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    // Expose socket for debugging in console: window.socket
    useEffect(() => {
        window.socket = socket;
        return () => {
            // cleanup in case of HMR/dev
            try { delete window.socket; } catch (e) { }
        };
    }, []);

    useEffect(() => {
        console.log("SocketContext mounting — attempting getUserMedia & socket listeners");

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                console.log("✅ got media stream:", currentStream);
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            })
            .catch((err) => {
                console.error("❌ getUserMedia error:", err);
            });

        // connection lifecycle logs
        socket.on("connect", () => {
            console.log("🔌 socket connected, id=", socket.id);
            setMe(socket.id);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ socket connect_error:", err);
        });

        socket.on("reconnect_attempt", (attempt) => {
            console.log("🔄 socket reconnect attempt:", attempt);
        });

        socket.on("disconnect", (reason) => {
            console.log("⚠️ socket disconnected, reason:", reason, "connected?", socket.connected);
        });

        socket.on("me", (id) => {
            console.log("📩 got 'me' from server:", id);
            setMe(id);
        });

        socket.on("calluser", ({ from, name: callerName, signal }) => {
            console.log("📞 incoming call from:", from);
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        });

        // cleanup on unmount
        return () => {
            console.log("SocketContext unmount cleanup: removing listeners");
            socket.off("connect");
            socket.off("connect_error");
            socket.off("reconnect_attempt");
            socket.off("disconnect");
            socket.off("me");
            socket.off("calluser");
        };
    }, []);

    // Answer/call/leave functions (unchanged except for safety)
    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on("signal", (data) => socket.emit("answercall", { signal: data, to: call.from }));
        peer.on("stream", (currentStream) => { if (userVideo.current) userVideo.current.srcObject = currentStream; });
        peer.signal(call.signal);
        connectionRef.current = peer;
    };

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on("signal", (data) => {
            socket.emit("calluser", { userToCall: id, signalData: data, from: me, name });
        });
        peer.on("stream", (currentStream) => { if (userVideo.current) userVideo.current.srcObject = currentStream; });
        socket.on("callaccepted", (signal) => {
            if (!connectionRef.current.destroyed) {
                setCallAccepted(true);
                peer.signal(signal);
            }
        });
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);

        if (connectionRef.current) {
            connectionRef.current.destroy();
        }

        // ✅ Remove old listeners to avoid signaling after leave
        socket.off("calluser");
        socket.off("callaccepted");

        window.location.reload(); // refresh UI if you still want
    };


    return (
        <SocketContext.Provider value={{
            callAccepted, call, myVideo, userVideo, stream, name, setName,
            callEnded, me, callUser, leaveCall, answerCall
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
