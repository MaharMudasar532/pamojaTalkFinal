import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types';
import {  Button } from "@mui/material";
import '../Stylesheet.css';
const BtnClose = ({  title, onClickTerm }) => {
    return (
        <>
                <Button mb="30px"
                    onClick={onClickTerm}
                    className="btnclose"

                >{title}</Button>


        </>
    );
};
BtnClose.propTypes = {
    title: PropTypes.string.isRequired,
    onClickTerm: PropTypes.func.isRequired,
};
export default BtnClose;
