import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createBalancePlan } from '../helpers/api-communicator'; // Import the createBalancePlan API communicator

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'gold',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'gold',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'gold',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '8px',
      borderColor: 'gold',
    },
    '&:hover fieldset': {
      borderColor: 'gold',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'gold',
    },
  },
});

const BalancePlanSurvey: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '',
    fitnessLevel: '',
    gender: '',
    targetMovement: '',
    stabilityGoal: '',
    numberOfWeeks: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const loadingToastId = toast.loading('Creating balance plan...');

    try {
      // Format formData correctly before sending it to the API
      const formattedData = {
        ...formData,
        age: Number(formData.age),
        numberOfWeeks: Number(formData.numberOfWeeks),
      };

      await createBalancePlan(formattedData); // Pass formatted data to the API communicator
      toast.dismiss(loadingToastId);
      toast.success('Balance plan created successfully!');
      navigate('/balance-plan-response');
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Failed to create balance plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} md={6}>
        <Box display="flex" justifyContent="center">
          <img src="./BalancePlan.png" alt="Balance Plan" style={{ width: '100%', maxWidth: '2000px' }} />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ width: '100%', maxWidth: 500, p: 2, border: '1px solid gold', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>Balance Plan Form</Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={3}>
              <Typography>Input your age in years</Typography>
              <CustomTextField
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box mb={3}>
              <Typography>Input your fitness level</Typography>
              <Box display="flex" justifyContent="space-between">
                {['Beginner', 'Intermediate', 'Advanced'].map((option) => (
                  <Button
                    key={option}
                    variant="outlined"
                    onClick={() => setFormData({ ...formData, fitnessLevel: option })}
                    sx={{
                      backgroundColor: formData.fitnessLevel === option ? 'gold' : 'white',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: formData.fitnessLevel === option ? 'gold' : 'white',
                      },
                    }}
                    disabled={loading}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box mb={3}>
              <Typography>Input your gender</Typography>
              <Box display="flex" justifyContent="space-between">
                {['Male', 'Female'].map((option) => (
                  <Button
                    key={option}
                    variant="outlined"
                    onClick={() => setFormData({ ...formData, gender: option })}
                    sx={{
                      backgroundColor: formData.gender === option ? 'gold' : 'white',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: formData.gender === option ? 'gold' : 'white',
                      },
                    }}
                    disabled={loading}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box mb={3}>
              <Typography>Input the movement you want to improve balance for (e.g., Single-leg Stand)</Typography>
              <CustomTextField
                type="text"
                name="targetMovement"
                value={formData.targetMovement}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box mb={3}>
              <Typography>Input your stability goal (e.g., Hold for 30 seconds)</Typography>
              <CustomTextField
                type="text"
                name="stabilityGoal"
                value={formData.stabilityGoal}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box mb={3}>
              <Typography>Input the number of weeks you would like to achieve this goal in</Typography>
              <CustomTextField
                type="number"
                name="numberOfWeeks"
                value={formData.numberOfWeeks}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: 'gold',
                color: 'black',
                borderRadius: '8px',
                border: '2px solid white',
                '&:hover': {
                  backgroundColor: 'darkgoldenrod',
                },
              }}
              disabled={loading}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Grid>
      <Toaster position="top-right" reverseOrder={false} />
    </Grid>
  );
};

export default BalancePlanSurvey;
