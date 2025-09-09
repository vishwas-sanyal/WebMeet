import React from 'react';
// import { Typography, AppBar, Toolbar } from '@mui/material';

import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';
import './styles.css';


const App = () => {
    return (
        <div id='root'>
            <header className="appbar">
                <div className="toolbar">
                    <h1 className="logo">WebMeet</h1>
                </div>
            </header>

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
