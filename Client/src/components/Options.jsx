import React, { useContext, useState } from 'react';
// import { Button, TextField, Paper, Grid, Typography, Container, Box } from '@mui/material';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
// import PhoneIcon from '@mui/icons-material/Phone';

import { SocketContext } from './../SocketContext';
import './styles.css';

const Options = ({ children }) => {

    const { me, callAccepted, name, setName, leaveCall, callUser, callEnded } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');

    return (
        // <Container sx={{ margin: "35px 0", padding: 0, width: { xs: "80%", sm: "600px" } }}>
        //     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        //         <Paper elevation={10} sx={{ padding: "10px 20px", border: "2px solid black", mt: 2 }}>
        //             <form sx={{ display: "flex", flexDirection: "column" }} noValidate autoComplete='off'>
        //                 {/* <Grid container sx={{ display: "flex", width: "100%", flexDirection: { xs: "column", sm: "row" } }}> */}
        //                 <Grid
        //                     container
        //                     spacing={2}
        //                     sx={{ display: "flex", flexDirection: "row", width: "100%" }}
        //                 >
        //                     <Grid item xs={12} md={6} sx={{ padding: '20px', bgcolor: "rgba(196, 196, 196, 1)" }}>
        //                         <Typography gutterBottom variant='h6'>Account Info</Typography>
        //                         <TextField label='Name' value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        //                         {console.log(me)}
        //                         <CopyToClipboard text={me} sx={{ mt: 2 }}>
        //                             <Button variant='contained' color='primary' fullWidth startIcon={<AssignmentIcon fontSize="large" />}>
        //                                 Copy Your ID
        //                             </Button>
        //                         </CopyToClipboard>
        //                     </Grid>
        //                     <Grid item xs={12} md={6} sx={{ padding: '20px', bgcolor: "rgba(196, 196, 196, 1)" }}>
        //                         <Typography gutterBottom variant='h6'>Make a Call</Typography>
        //                         <TextField label='ID to Call' value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
        //                         {callAccepted && !callEnded ? (
        //                             <Button variant='contained' sx={{ mt: 2 }} color='secondary' startIcon={<PhoneDisabledIcon fontSize="large" />} fullWidth onClick={leaveCall}>Hang Up</Button>
        //                         ) : (
        //                             <Button variant='contained' sx={{ mt: 2 }} color='primary' startIcon={<PhoneIcon fontSize="large" />} fullWidth onClick={() => callUser(idToCall)}>Call</Button>
        //                         )}
        //                     </Grid>
        //                 </Grid>
        //             </form>
        //             {children}
        //         </Paper>
        //     </Box>

        // </Container >
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
                    <button onClick={() => navigator.clipboard.writeText(me)}>
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
                        <button onClick={leaveCall} style={{ background: "red", color: "white" }}>
                            Hang Up
                        </button>
                    ) : (
                        <button onClick={() => callUser(idToCall)}>Call</button>
                    )}
                </div>

            </div>
        </div>

    )
}

export default Options
