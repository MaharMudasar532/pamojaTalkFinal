import React from 'react';
import PropTypes from 'prop-types';
import { Typography, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material';
import { Email } from '@mui/icons-material';
import COLORS from '../../utils/COLORS';

function TextField({sx, label, formikProps }) {
  return (
    <>
      <Typography
        align='left'
        variant="paragraph"
        fontWeight="medium"
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
        id="input-with-icon-adornment"
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
        value={formikProps.values.email}
        onChange={(e) => formikProps.setFieldValue("email", e.target.value)}
        error={formikProps.touched.email && Boolean(formikProps.errors.email)}
        startAdornment={
          <InputAdornment position="start">
            <Email sx={{ color: "#808080" }} />
          </InputAdornment>
        }
        {...formikProps.getFieldProps('email')} // Pass formik field props
      />
      <FormHelperText style={{ color: 'red' }}>
        {formikProps.touched.email && formikProps.errors.email}
      </FormHelperText>
    </>
  );
}

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  formikProps: PropTypes.object.isRequired,
};

export default TextField;
