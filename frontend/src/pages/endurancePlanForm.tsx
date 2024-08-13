import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createEndurancePlan } from '../helpers/api-communicator';

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

const EndurancePlanSurvey: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    fitnessLevel: '',
    gender: '',
    preferredActivity: '',
    distanceGoal: '',
    timeGoal: '',
    numberOfWeeks: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const loadingToastId = toast.loading('Creating endurance plan...');

    try {
      const formattedData = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        distanceGoal: Number(formData.distanceGoal),
        numberOfWeeks: Number(formData.numberOfWeeks),
      };

      await createEndurancePlan(formattedData); // Pass formatted data to the API communicator
      toast.dismiss(loadingToastId);
      toast.success('Endurance plan created successfully!');
      navigate('/endurance-plan-response');
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Failed to create endurance plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} md={6}>
        <Box display="flex" justifyContent="center">
          <img src="./EndurancePlan.png" alt="Endurance Plan" style={{ width: '100%', maxWidth: '2000px' }} />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ width: '100%', maxWidth: 500, p: 2, border: '1px solid gold', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>Endurance Plan Form</Typography>
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
              <Typography>Input your weight in Pounds</Typography>
              <CustomTextField
                type="number"
                name="weight"
                value={formData.weight}
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
              <Typography>Input your preferred activity (e.g., Running)</Typography>
              <CustomTextField
                type="text"
                name="preferredActivity"
                value={formData.preferredActivity}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box mb={3}>
              <Typography>Input your distance goal in miles/kilometers</Typography>
              <CustomTextField
                type="number"
                name="distanceGoal"
                value={formData.distanceGoal}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box mb={3}>
              <Typography>Input your time goal (e.g., 60 minutes)</Typography>
              <CustomTextField
                type="text"
                name="timeGoal"
                value={formData.timeGoal}
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

export default EndurancePlanSurvey;
