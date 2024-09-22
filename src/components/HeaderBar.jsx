import React from 'react';
import { AppBar, Toolbar, Container } from '@mui/material';

const HeaderBar = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src="/path/to/your/image.png" 
            alt="Logo" 
            style={{ maxHeight: '50px', maxWidth: '100%' }} 
          />
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;