import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getAboutDeveloper } from '../helpers/api-communicator';

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
    <Box
      width={'100%'}
      height={'100%'}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        padding: 2,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <img
          src="Headshot.png"
          alt="Headshot"
          style={{
            width: '260px',
            borderRadius: '50%',
            maxWidth: '80%', // Responsive width for mobile
          }}
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
            maxWidth: '90%', // Responsive width for mobile
            '& a': {
              color: 'lightblue',
            },
          }}
        >
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
              fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
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
              fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
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
              fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
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
              fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
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
              fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
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
              fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
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
              fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
            }}
          >
            LinkedIn: <a href="https://www.linkedin.com/in/natanel-solomonov-13a606239/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/natanel-solomonov-13a606239/</a>
          </Typography>
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
              fontSize: { xs: '14px', sm: '16px', md: '18px' }, // Responsive font size
            }}
          >
            GitHub: <a href="https://github.com/Natanel-solomonov" target="_blank" rel="noopener noreferrer">https://github.com/Natanel-solomonov</a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutDeveloper;
