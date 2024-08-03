import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Box, Typography, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createLiftingPlan } from '../helpers/api-communicator';

const weightliftingTerms = [
  "bench press", "incline bench press", "decline bench press", "dumbbell bench press",
  "squat", "front squat", "Bulgarian split squat", "overhead squat",
  "deadlift", "romanian deadlift", "sumo deadlift", "single-leg deadlift",
  "overhead press", "seated shoulder press", "dumbbell shoulder press", "Arnold press",
  "barbell curl", "dumbbell curl", "hammer curl", "concentration curl",
  "tricep extension", "skull crusher", "tricep dip", "overhead tricep extension",
  "lat pulldown", "pull-up", "chin-up", "wide-grip pulldown",
  "seated row", "bent-over row", "cable row", "one-arm dumbbell row",
  "leg press", "single-leg press", "hack squat", "smith machine squat",
  "leg extension", "leg curl", "lying leg curl", "seated leg curl",
  "calf raise", "seated calf raise", "donkey calf raise", "leg press calf raise",
  "shoulder press", "dumbbell shoulder press", "military press", "Arnold press",
  "chest fly", "incline chest fly", "decline chest fly", "cable chest fly",
  "hammer curl", "preacher curl", "reverse curl", "spider curl",
  "skull crusher", "overhead tricep extension", "tricep dip", "close-grip bench press",
  "pull-up", "chin-up", "neutral-grip pull-up", "wide-grip pull-up",
  "face pull", "upright row", "shrug", "trap raise",
  "front raise", "lateral raise", "rear delt fly", "dumbbell lateral raise",
  "rear delt fly", "reverse pec deck", "bent-over rear delt fly", "cable rear delt fly",
  "hyperextension", "reverse hyperextension", "glute bridge", "hip thrust",
  "romanian deadlift", "sumo deadlift", "stiff-leg deadlift", "trap bar deadlift",
  "clean and press", "snatch", "power clean", "hang clean",
  "power snatch", "high pull", "snatch-grip high pull", "clean pull",
  "good morning", "seated good morning", "cable good morning", "banded good morning",
  "single-leg deadlift", "single-leg Romanian deadlift", "pistol squat", "Bulgarian split squat",
  "cable fly", "low cable fly", "high cable fly", "cable crossover"
];


interface FormData {
  height: string;
  weight: string;
  experienceLevel: string;
  gender: string;
  desiredExercise: string;
  targetWeight: string;
  numberOfWeeks: string;
}

interface LiftingPlanData {
  height: number;
  weight: number;
  experienceLevel: string;
  gender: string;
  desiredExercise: string;
  targetWeight: number;
  numberOfWeeks: number;
}

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

const LiftingPlanSurvey: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    height: '',
    weight: '',
    experienceLevel: '',
    gender: '',
    desiredExercise: '',
    targetWeight: '',
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

    const isValidExercise = weightliftingTerms.some(keyword =>
      keyword.toLowerCase() === formData.desiredExercise.toLowerCase()
    );

    if (!isValidExercise) {
      toast.error('Invalid exercise entered. Please enter a valid exercise.');
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading('Creating lifting plan...');

    try {
      const liftingPlanData: LiftingPlanData = {
        height: Number(formData.height),
        weight: Number(formData.weight),
        experienceLevel: formData.experienceLevel,
        gender: formData.gender,
        desiredExercise: formData.desiredExercise,
        targetWeight: Number(formData.targetWeight),
        numberOfWeeks: Number(formData.numberOfWeeks),
      };

      console.log('Form Data:', liftingPlanData); // Log form data before sending
      //@ts-ignore
      const response = await createLiftingPlan(liftingPlanData);

      console.log('Lifting plan created successfully:', response);
      toast.dismiss(loadingToastId);
      toast.success('Lifting plan created successfully!');
      navigate('/lifting-plan-response');
    } catch (error: any) {
      console.error('Error creating lifting plan:', error);
      toast.dismiss(loadingToastId);
      toast.error('Failed to create lifting plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} md={6}>
        <Box display="flex" justifyContent="center">
          <img src="./LiftingPlan.png" alt="Lifting Plan" style={{ width: '100%', maxWidth: '2000px' }} />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ width: '100%', maxWidth: 500, p: 2, border: '1px solid gold', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>Lifting Plan Form</Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={3}>
              <Typography>Input your height in Centimeters (1 foot = 30.48 Centimeters, 1 Inch = 2.54 Centimeters)</Typography>
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
              <Typography>Input your weight in Kilograms (1 Kilogram = 2.2 Pounds)</Typography>
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
              <Typography>Input the exercise you want a plan for (e.g., Barbell Squat)</Typography>
              <CustomTextField
                type="text"
                name="desiredExercise"
                value={formData.desiredExercise}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box mb={3}>
              <Typography>Input your target weight for the exercise in Kilograms (1 Kilogram = 2.2 Pounds)</Typography>
              <CustomTextField
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
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

export default LiftingPlanSurvey;