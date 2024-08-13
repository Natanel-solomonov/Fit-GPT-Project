import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, IconButton, Collapse, Box } from '@mui/material';
import { getSavedLiftingPlans, getSavedCalisthenicsPlans, getSavedEndurancePlans, getSavedBalancePlans, getSavedFlexibilityPlans, clearAllSavedLiftingPlans, clearAllSavedCalisthenicsPlans, clearAllSavedEndurancePlans, clearAllSavedBalancePlans, clearAllSavedFlexibilityPlans } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { FaArrowRight, FaArrowUp, FaShare, FaSms } from "react-icons/fa";
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
  planDetails: string; // This will hold the plan content (liftingPlan, calisthenicsPlan, etc.)
  planType: 'Lifting' | 'Calisthenics' | 'Endurance' | 'Balance' | 'Flexibility';
  desiredExercise?: string;
  targetMovement?: string;
  preferredActivity?: string;
  targetArea?: string;
}

const SavedPlans: React.FC = () => {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const [showShareButtons, setShowShareButtons] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchSavedPlans = async () => {
      try {
        toast.loading("Retrieving saved plans", { id: "retrieveSavedPlans" });

        // Initialize empty arrays to handle cases where the API calls return undefined or null
        let liftingPlans = [];
        let calisthenicsPlans = [];
        let endurancePlans = [];
        let balancePlans = [];
        let flexibilityPlans = [];

        const liftingResponse = await getSavedLiftingPlans();
        const calisthenicsResponse = await getSavedCalisthenicsPlans();
        const enduranceResponse = await getSavedEndurancePlans();
        const balanceResponse = await getSavedBalancePlans();
        const flexibilityResponse = await getSavedFlexibilityPlans();

        if (liftingResponse && Array.isArray(liftingResponse.liftingPlans)) {
          liftingPlans = liftingResponse.liftingPlans.map((plan: any) => ({
            ...plan,
            planDetails: plan.liftingPlan.join('\n'),
            planType: 'Lifting',
          }));
        }

        if (calisthenicsResponse && Array.isArray(calisthenicsResponse.calisthenicsPlans)) {
          calisthenicsPlans = calisthenicsResponse.calisthenicsPlans.map((plan: any) => ({
            ...plan,
            planDetails: plan.calisthenicsPlan.join('\n'),
            planType: 'Calisthenics',
          }));
        }

        if (enduranceResponse && Array.isArray(enduranceResponse.endurancePlans)) {
          endurancePlans = enduranceResponse.endurancePlans.map((plan: any) => ({
            ...plan,
            planDetails: plan.endurancePlan.join('\n'),
            planType: 'Endurance',
          }));
        }

        if (balanceResponse && Array.isArray(balanceResponse.balancePlans)) {
          balancePlans = balanceResponse.balancePlans.map((plan: any) => ({
            ...plan,
            planDetails: plan.balancePlan.join('\n'),
            planType: 'Balance',
          }));
        }

        if (flexibilityResponse && Array.isArray(flexibilityResponse.flexibilityPlans)) {
          flexibilityPlans = flexibilityResponse.flexibilityPlans.map((plan: any) => ({
            ...plan,
            planDetails: plan.flexibilityPlan.join('\n'),
            planType: 'Flexibility',
          }));
        }

        const allPlans = [
          ...liftingPlans,
          ...calisthenicsPlans,
          ...endurancePlans,
          ...balancePlans,
          ...flexibilityPlans,
        ];

        setSavedPlans(allPlans);
        toast.success("Saved plans retrieved successfully", { id: "retrieveSavedPlans" });
      } catch (err) {
        console.error("Error fetching saved plans:", err);
        toast.error("Failed to retrieve saved plans", { id: "retrieveSavedPlans" });
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
      await clearAllSavedCalisthenicsPlans();
      await clearAllSavedEndurancePlans();
      await clearAllSavedBalancePlans();
      await clearAllSavedFlexibilityPlans();
      setSavedPlans([]);
      toast.success("All saved plans cleared");
    } catch (err) {
      toast.error("Failed to clear saved plans");
    }
  };

  const toggleShareButtons = (index: number) => {
    setShowShareButtons(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const generateContent = (plan: SavedPlan) => {
    return `Check out this ${plan.planType.toLowerCase()} plan Fit GPT recommended to improve my ${plan.desiredExercise || plan.targetMovement || plan.preferredActivity || plan.targetArea}\n\n${plan.title || `Plan for increased ${plan.planType.toLowerCase()} on ${plan.desiredExercise || plan.targetMovement || plan.preferredActivity || plan.targetArea}`}\n\n${plan.description || plan.planDetails}`;
  };

  const shareToIMessage = (plan: SavedPlan) => {
    const messageContent = generateContent(plan);
    window.open(`sms:&body=${encodeURIComponent(messageContent)}`, '_blank');
  };

  const handleShare = (plan: SavedPlan) => {
    const content = generateContent(plan);
    return content;
  };

  return (
    <Container style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px' }}>
      <Typography variant="h4" style={{ color: '#fff', marginBottom: '20px' }}>
        Saved Plans
      </Typography>
      <Button 
        variant="contained" 
        sx={{ backgroundColor: 'gold', color: 'black', '&:hover': { backgroundColor: 'goldenrod' }, marginBottom: '20px' }}
        onClick={handleClearAll}
      >
        Clear All Saved Plans
      </Button>
      <Grid container spacing={3}>
        {Array.isArray(savedPlans) && savedPlans.length > 0 && savedPlans.map((plan, index) => (
          <Grid item xs={12} key={plan._id}>
            <Card style={{ backgroundColor: '#333', color: '#fff', marginBottom: '10px' }}>
              <CardContent>
                <Typography variant="h5" component="div" style={{ display: 'flex', alignItems: 'center' }}>
                  {plan.title || `${plan.planType} Plan for ${plan.desiredExercise || plan.targetMovement || plan.preferredActivity || plan.targetArea}`}
                  <IconButton onClick={() => handleExpandClick(index)} style={{ color: '#fff', marginLeft: 'auto' }}>
                    {expandedPlan === index ? <FaArrowUp /> : <FaArrowRight />}
                  </IconButton>
                </Typography>
                <Collapse in={expandedPlan === index} timeout="auto" unmountOnExit>
                  <Typography variant="body2" style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                    {plan.description || plan.planDetails}
                  </Typography>
                </Collapse>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                      mt: 2,
                    }}
                  >
                    <FacebookShareButton url={window.location.href}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={window.location.href} title={handleShare(plan)}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={`https://wa.me/?text=${encodeURIComponent(handleShare(plan))}`}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <EmailShareButton 
                      subject="Fitness Plan Recommendation" 
                      body={handleShare(plan)}
                      url={window.location.href}
                    >
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                    <IconButton onClick={() => shareToIMessage(plan)}>
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
