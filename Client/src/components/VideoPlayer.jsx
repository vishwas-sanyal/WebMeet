import React, { useContext, useEffect } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { SocketContext } from '../SocketContext';

const VideoPlayer = () => {

    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

    // ✅ Attach stream when it's available
    useEffect(() => {
        if (stream && myVideo.current) {
            myVideo.current.srcObject = stream;
            console.log("🎥 Stream attached in VideoPlayer:", stream);
        }
    }, [stream, myVideo]);

    return (
        <Grid container justifyContent="center" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
            {/* Our Own Video */}
            {stream && (
                <Paper sx={{ p: "7px", m: "5px", bgcolor: "#454545", borderRadius: "15px" }}>
                    <Grid item xs={12} md={6} borderRadius={7} sx={{ bgcolor: "#454545" }}>
                        <Typography variant='h5' sx={{ bgcolor: "#454545", fontFamily: "'Aclonica', sans-serif" }}>{name || 'Name'}</Typography>
                        <video playsInline muted ref={myVideo} autoPlay style={{ width: "550px", borderRadius: "15px", border: "2px solid black" }}
                            sx={{ width: { xs: "300px", sm: "550px" } }} />
                    </Grid>
                </Paper>
            )}
            {/* User's Video */}
            {callAccepted && !callEnded && (
                <Paper sx={{ p: "7px", m: "5px", bgcolor: "#454545", borderRadius: "15px" }}>
                    <Grid item xs={12} md={6} borderRadius={7} sx={{ bgcolor: "#454545" }}>
                        <Typography variant='h5' sx={{ bgcolor: "#454545", fontFamily: "'Aclonica', sans-serif" }}>{call.name || 'Name'}</Typography>
                        <video playsInline ref={userVideo} autoPlay style={{ width: "550px", borderRadius: "15px", border: "2px solid black" }}
                            sx={{ width: { xs: "300px", sm: "550px" } }} />
                    </Grid>
                </Paper>
            )}
        </Grid >
    )
}

export default VideoPlayer
