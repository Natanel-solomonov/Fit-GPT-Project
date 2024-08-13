import React, { useEffect, useState } from 'react';
import { Grid,  Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getPlanOptions } from '../helpers/api-communicator'; // Adjust the path based on your structure

const PlanOptions: React.FC = () => {
  const [options, setOptions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const options = await getPlanOptions();
        setOptions(options);
      } catch (error) {
        console.error('Failed to fetch plan options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleOptionClick = (option: string) => {
    switch (option) {
      case 'Lifting':
        navigate('/lifting-plans');
        break;
      case 'Calisthenics':
        navigate('/calisthenics-plans');
        break;
      case 'Endurance':
        navigate('/endurance-plans');
        break;
      case 'Balance':
        navigate('/balance-plans');
        break;
      case 'Flexibility':
        navigate('/flexibility-plans');
        break;
      default:
   }
  };

  return (
    <Grid container direction="column" spacing={2} alignItems="center" sx={{ mt: 4 }}>
      <Grid item xs={12} sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom> 🏋️‍♀️Select a Category of Fitness You Would Like A Plan For🏋️‍♀️</Typography>
      </Grid>
      {options.map(option => (
        <Grid item xs={12} key={option} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleOptionClick(option)}
            sx={{
              maxWidth: '50%', // Ensure buttons are at least 50% of the screen width
              minHeight: '60px',
              backgroundColor: 'gold',
              color: 'black',
              fontWeight: 700,
              border: '2px solid white', // Add white border
              borderRadius: '8px', // Add border radius
              '&:hover': {
                bgcolor: 'darkgoldenrod',
              },
            }}
          >
            {option}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlanOptions;