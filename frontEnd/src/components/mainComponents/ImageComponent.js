import React from 'react';
import { Grid } from '@mui/material';

function ImageComponent({ sx, src, alt }) {
  return (
    <Grid
      sx={sx}
      display='flex'
      justifyContent='center'
      alignItems='center'
      item
      xs={24} md={12} lg={12} xl={12}
      align="center"
      p={2}
    >
      <img
        alt={alt}
        style={{
          width: 240,
          height: 'auto',
          display: 'flex',
          alignContent: "center",
          alignItems: 'center',
          justifyContent: 'center',
        }}
        src={src}
      />
    </Grid>
  );
}

export default ImageComponent;
