import React, { useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { getAboutDeveloper } from '../helpers/api-communicator';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const AboutDeveloper = () => {
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        await getAboutDeveloper();
      } catch (error) {
        console.error('Error fetching About the Developer data:', error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <Box width={'100%'} height={'100%'} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <img
          src="Headshot.png"
          alt="Headshot"
          style={{ width: '260px', borderRadius: '50%' }} // Increased by 30%
        />
        <Box
          sx={{
            mt: 3,
            px: 3,
            py: 2,
            border: '2px solid gold',
            borderRadius: 4,
            textAlign: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            width: '130%', // Increased by 30%
          }}
        >
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
            }}
          >
            Name: Natanel Solomonov
          </Typography> 
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
            }}
          >
            Email: natanelsolomonov76@gmail.com
          </Typography>
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
            }}
          >
            Phone Number: (215) 913-6110
          </Typography>
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
            }}
          >
            School: University Of Maryland College Park
          </Typography>
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
            }}
          >
            Year: Sophomore
          </Typography>
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
            }}
          >
            Major: Computer Science
          </Typography>
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
            }}
          >
            LinkedIn: <a href="https://www.linkedin.com/in/natanel-solomonov-13a606239/" style={{ color: 'lightblue' }} target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/natanel-solomonov-13a606239/</a>
          </Typography>
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
            }}
          >
            GitHub: <a href="https://github.com/Natanel-solomonov" style={{ color: 'lightblue' }} target="_blank" rel="noopener noreferrer">https://github.com/Natanel-solomonov</a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutDeveloper;