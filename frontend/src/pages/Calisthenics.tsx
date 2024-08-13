import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createCalisthenicsPlan } from '../helpers/api-communicator';

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

const CalisthenicsPlanSurvey: React.FC = () => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    experienceLevel: '',
    gender: '',
    desiredMovement: '',
    repsGoal: '',
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
    const loadingToastId = toast.loading('Creating calisthenics plan...');
  
    try {
      const formattedData = {
        ...formData,
        height: Number(formData.height),
        weight: Number(formData.weight),
        repsGoal: Number(formData.repsGoal),
        numberOfWeeks: Number(formData.numberOfWeeks),
      };
  
       await createCalisthenicsPlan(formattedData); // Pass formatted data to the API communicator
      toast.dismiss(loadingToastId);
      toast.success('Calisthenics plan created successfully!');
      navigate('/calisthenics-plan-response');
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Failed to create calisthenics plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} md={6}>
        <Box display="flex" justifyContent="center">
          <img src="./CalisthenicsPlan.png" alt="Calisthenics Plan" style={{ width: '100%', maxWidth: '2000px' }} />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ width: '100%', maxWidth: 500, p: 2, border: '1px solid gold', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>Calisthenics Plan Form</Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={3}>
              <Typography>Input your height in Inches (e.g., 5'8" would be 68 inches)</Typography>
              <CustomTextField
                type="number"
                name="height"
                value={formData.height}
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
              <Typography>Input your experience level</Typography>
              <Box display="flex" justifyContent="space-between">
                {['Beginner', 'Intermediate', 'Advanced'].map((option) => (
                  <Button
                    key={option}
                    variant="outlined"
                    onClick={() => setFormData({ ...formData, experienceLevel: option })}
                    sx={{
                      backgroundColor: formData.experienceLevel === option ? 'gold' : 'white',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: formData.experienceLevel === option ? 'gold' : 'white',
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
              <Typography>Input the movement you want a plan for (e.g., Pull-up)</Typography>
              <CustomTextField
                type="text"
                name="desiredMovement"
                value={formData.desiredMovement}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box mb={3}>
              <Typography>Input your target repetitions or the number of seconds you would like to hold something for</Typography>
              <CustomTextField
                type="number"
                name="repsGoal"
                value={formData.repsGoal}
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

export default CalisthenicsPlanSurvey;
