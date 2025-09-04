import React from 'react';
import { Typography, AppBar, Toolbar } from '@mui/material';

import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';


const App = () => {
    return (
        <div id='root'>
            <AppBar position='static' color='inherit' sx={{ backgroundColor: "#353535", borderRadius: "15px", boxShadow: "0px 15px 15px 3px rgba(196, 196, 196, 1)" }}>
                <Toolbar sx={{ justifyContent: "center" }}>
                    <Typography variant="h3" align="center" sx={{ fontFamily: "'Aclonica', sans-serif" }}>
                        WebMeet
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className='main'>
                <VideoPlayer />
                <Options>
                    <Notifications />
                </Options>
            </div>
        </div>
    )
}

export default App
