import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types';
import { Button, Modal, Typography, Box, Grid } from "@mui/material";
import './Stylesheet.css';
import ClipLoader from "react-spinners/ClipLoader";
import CloseIcon from '@mui/icons-material/Close';
import ButtonClose from "./BtnSuccess"
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

const ModalMd = ({ size, open, handleClose, title, modal_content, action_close, action_success }) => {
    const [screenWidth, setScreenWidth] = useState(400)
    const style = {
        maxHeight: '100vh', // Set a fixed height for the modal
        overflow: 'auto', 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: screenWidth,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };
    //   const [open, setOpen] = React.useState(false);
    //   const handleOpen = () => setOpen(true);
    //   const handleClose = () => setOpen(false);
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.innerWidth < 600) {
                setScreenWidth('100%')
            } else if (size === 'lg') {
                setScreenWidth(800)
            } else if (size === 'md') {
                setScreenWidth(600)
            } else if (size === 'sm') {
                setScreenWidth(500)
            } else {
                setScreenWidth(400)

            }
        }, 1000);

        return () => clearInterval(interval);

    }, []);
    return (
        <>

            {/* Large Screen  */}
            <Modal

                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} md={12} style={{ padding: '10px' }}>
                            {modal_content}
                        </Grid>

                        {action_success === null || action_success === undefined || action_success === '' ?
                            <>
                            </> :
                            <>x
                                <Grid item xs={12} md={12} style={{ borderBottom: '1px solid lightGrey' }}>
                                </Grid>
                                <Grid item xs={12} md={12} align='right'>
                                    <ButtonClose title="Close"
                                        onClickTerm={handleClose}
                                    />
                                    {action_success}
                                </Grid>
                            </>}

                    </Grid>
                </Box>

            </Modal>

        </>
    );
};
ModalMd.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    handleClose: PropTypes.func,
    action_success: PropTypes.func,
    action_close: PropTypes.func,
    modal_content: PropTypes.element,
    size: PropTypes.string,

};
export default ModalMd;
