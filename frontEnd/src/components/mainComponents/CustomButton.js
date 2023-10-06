import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { ClipLoader } from 'react-spinners'; // Import your loader component and styles
import COLORS from '../../utils/COLORS';
const btn = {
  letterSpacing: "1px",
  width: '99%',
  // marginBottom: '20px',
  color: 'white',
  background: COLORS.buttonColor,
  borderColor: COLORS.buttonColor,
  height: '50px',
  padding: '0px',
  font: 'normal normal normal 17px/26px Roboto',
  fontWeight: "normal",
  borderRadius: "50px",
  boxShadow: "none",
  textTransform: "capitalize"
}

function CustomButton({ sx ,isLoading, onClick, buttonText, loaderColor }) {
  return (
    <Button
      sx={sx}
      variant="contained"
      background={isLoading ? COLORS.backgroundColor : '#B5030B'}
      style={btn}
      onClick={isLoading ? null : onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <ClipLoader color='white' loading={isLoading} size={10} />
      ) : (
        buttonText
      )}
    </Button>
  );
}

CustomButton.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  buttonText: PropTypes.string.isRequired,
  buttonStyle: PropTypes.object,
  loaderColor: PropTypes.string,
};

export default CustomButton;
