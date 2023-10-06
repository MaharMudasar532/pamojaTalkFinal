import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, OutlinedInput, InputAdornment, IconButton, FormHelperText } from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import COLORS from '../../utils/COLORS';

function PasswordField({ label, fieldName, formikProps, showPasswordProps }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Typography
        align='left'
        variant="paragraph"
        fontWeight="medium"
        pt={1}
        pl={1}
        pb={1}
        fontSize="12px"
        sx={{
          font: "normal normal normal 17px/26px Roboto",
          color: "#1F1F1F",
        }}
      >
        {label}
      </Typography>
      <OutlinedInput
        id={`outlined-adornment-${fieldName}`}
        sx={{
          borderRadius: '0px',
          color: COLORS.gray,
          "& fieldset": {
            borderColor: COLORS.buttonColor,
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
          },
        }}
        value={formikProps.values[fieldName]}
        onChange={(e) => formikProps.setFieldValue(fieldName, e.target.value)}
        error={formikProps.touched[fieldName] && Boolean(formikProps.errors[fieldName])}
        startAdornment={
          <InputAdornment position="start">
            <Lock sx={{ color: "#808080" }} />
          </InputAdornment>
        }
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? (
                <VisibilityOff sx={{ color: COLORS.buttonColor }} />
              ) : (
                <Visibility sx={{ color: COLORS.buttonColor }} />
              )}
            </IconButton>
          </InputAdornment>
        }
        {...formikProps.getFieldProps(fieldName)} // Pass formik field props
        {...showPasswordProps} // Additional props for showPassword
      />
      <FormHelperText style={{ color: 'red' }}>
        {formikProps.touched[fieldName] && formikProps.errors[fieldName]}
      </FormHelperText>
    </>
  );
}

PasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired, // Field name for Formik
  formikProps: PropTypes.object.isRequired,
  showPasswordProps: PropTypes.object,
};

export default PasswordField;
