import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, IconButton, Collapse, Box } from '@mui/material';
import { getSavedLiftingPlans, clearAllSavedLiftingPlans, deleteSavedLiftingPlan } from '../helpers/api-communicator'; // Adjust the import path as needed
import toast from 'react-hot-toast';
import { FaArrowRight, FaArrowUp, FaTrash, FaShare, FaSms } from "react-icons/fa";
import { 
  FacebookShareButton, FacebookIcon, 
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon,
  EmailShareButton, EmailIcon
} from 'react-share';

interface SavedPlan {
  _id: string;
  title?: string;
  description?: string;
  liftingPlan: string;
  desiredExercise?: string; // Add this field if it's not already present in the SavedPlan interface
}

const SavedPlans: React.FC = () => {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const [showShareButtons, setShowShareButtons] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchSavedPlans = async () => {
      try {
        toast.loading("Retrieving saved lifting plans", { id: "retrieveSavedPlans" });
        const response = await getSavedLiftingPlans();
        setSavedPlans(response.liftingPlans || []);
        toast.success("Saved lifting plans retrieved successfully", { id: "retrieveSavedPlans" });
      } catch (err) {
        toast.error("Failed to retrieve saved lifting plans", { id: "retrieveSavedPlans" });
      }
    };

    fetchSavedPlans();
  }, []);

  const handleExpandClick = (index: number) => {
    setExpandedPlan(expandedPlan === index ? null : index);
  };

  const handleClearAll = async () => {
    try {
      await clearAllSavedLiftingPlans();
      setSavedPlans([]);
      toast.success("All saved lifting plans cleared");
    } catch (err) {
      toast.error("Failed to clear saved lifting plans");
    }
  };

  const handleDeletePlan = async (liftingPlanId: string) => {
    try {
      const response = await deleteSavedLiftingPlan(liftingPlanId);
      setSavedPlans(response.liftingPlans || []);
      toast.success("Lifting plan deleted successfully");
    } catch (err) {
      toast.error("Failed to delete lifting plan");
    }
  };

  const toggleShareButtons = (index: number) => {
    setShowShareButtons(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const shareToIMessage = (url: string, message: string) => {
    window.open(`sms:&body=${encodeURIComponent(message + " " + url)}`, '_blank');
  };

  return (
    <Container style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px' }}>
      <Typography variant="h4" style={{ color: '#fff', marginBottom: '20px' }}>
        Saved Lifting Plans
      </Typography>
      <Button 
        variant="contained" 
        sx={{ backgroundColor: 'gold', color: 'black', '&:hover': { backgroundColor: 'goldenrod' }, marginBottom: '20px' }}
        onClick={handleClearAll}
      >
        Clear All Saved Plans
      </Button>
      <Grid container spacing={3}>
        {Array.isArray(savedPlans) && savedPlans.map((plan, index) => (
          <Grid item xs={12} key={plan._id}>
            <Card style={{ backgroundColor: '#333', color: '#fff', marginBottom: '10px' }}>
              <CardContent>
                <Typography variant="h5" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                  {plan.title || `Plan for increased strength on ${plan.desiredExercise}`}
                  <IconButton onClick={() => handleExpandClick(index)} style={{ color: '#fff', marginLeft: 'auto' }}>
                    {expandedPlan === index ? <FaArrowUp /> : <FaArrowRight />}
                  </IconButton>
                </Typography>
                <Collapse in={expandedPlan === index} timeout="auto" unmountOnExit>
                  <Typography variant="body2" style={{ marginTop: '10px' }}>
                    {plan.description || plan.liftingPlan}
                  </Typography>
                </Collapse>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <IconButton onClick={() => handleDeletePlan(plan._id)} style={{ color: '#fff' }}>
                    <FaTrash />
                  </IconButton>
                  <IconButton onClick={() => toggleShareButtons(index)} style={{ color: '#fff' }}>
                    <FaShare />
                  </IconButton>
                </Box>
                {showShareButtons[index] && (
                  <Box
                    sx={{
                      bgcolor: 'white',
                      p: 2,
                      borderRadius: 1,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 1,
                      mt: 2, // Add margin-top to separate from the content
                    }}
                  >
                    <FacebookShareButton url={window.location.href} title={`Hey! Check out this plan Fit GPT recommended me to increase my strength on ${plan.desiredExercise}`}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={window.location.href} title={`Hey! Check out this plan Fit GPT recommended me to increase my strength on ${plan.desiredExercise}`}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={window.location.href} title={`Hey! Check out this plan Fit GPT recommended me to increase my strength on ${plan.desiredExercise}`}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <EmailShareButton url={window.location.href} subject="Lifting Plan Recommendation" body={`Hey! Check out this plan Fit GPT recommended me to increase my strength on ${plan.desiredExercise}`}>
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                    <IconButton onClick={() => shareToIMessage(window.location.href, `Hey! Check out this plan Fit GPT recommended me to increase my strength on ${plan.desiredExercise}`)}>
                      <FaSms color="green" size={32} />
                    </IconButton>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SavedPlans;