import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { getSavedLiftingPlans } from '../helpers/api-communicator'; // Adjust the import path as needed
import toast from 'react-hot-toast';

interface SavedPlan {
  title?: string;
  description?: string;
  liftingPlan: string;
}

const SavedPlans = () => {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

  useEffect(() => {
    const fetchSavedPlans = async () => {
      try {
        toast.loading("Retrieving saved lifting plans", { id: "retrieveSavedPlans" });
        const response = await getSavedLiftingPlans();
        setSavedPlans(response.liftingPlans);
        toast.success("Saved lifting plans retrieved successfully", { id: "retrieveSavedPlans" });
      } catch (err) {
        toast.error("Failed to retrieve saved lifting plans", { id: "retrieveSavedPlans" });
      }
    };

    fetchSavedPlans();
  }, []);

  return (
    <Container style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px' }}>
      <Typography variant="h4" style={{ color: '#fff', marginBottom: '20px' }}>
        Saved Lifting Plans
      </Typography>
      <Grid container spacing={3}>
        {savedPlans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card style={{ backgroundColor: '#333', color: '#fff' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {plan.title || `Plan ${index + 1}`}
                </Typography>
                <Typography variant="body2">
                  {plan.description || plan.liftingPlan}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" style={{ color: '#1976d2' }}>View</Button>
                <Button size="small" style={{ color: '#d32f2f' }}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SavedPlans;