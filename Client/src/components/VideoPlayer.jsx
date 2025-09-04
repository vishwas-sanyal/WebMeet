import React, { useContext } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { SocketContext } from '../SocketContext';

// import { SocketContext } from '../SocketContext';?

const VideoPlayer = () => {

    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

    return (
        <Grid container justifyContent="center" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
            {/* Our Own Video */}
            {stream && (
                <Paper sx={{ p: "10px", border: "2px solid black", m: "10px", bgcolor: "red" }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h5' gutterBottom>{name || 'Name'}</Typography>
                        <video playsInline muted ref={myVideo} autoPlay style={{ width: "550px" }}
                            sx={{ width: { xs: "300px", sm: "550px" } }} />
                    </Grid>
                </Paper>
            )}
            {/* User's Video */}
            {callAccepted && !callEnded && (
                <Paper sx={{ p: "10px", border: "2px solid black", m: "10px" }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h5' gutterBottom>{call.name || 'Name'}</Typography>
                        <video playsInline ref={userVideo} autoPlay style={{ width: "550px" }}
                            sx={{ width: { xs: "300px", sm: "550px" } }} />
                    </Grid>
                </Paper>
            )}
        </Grid >
    )
}

export default VideoPlayer
