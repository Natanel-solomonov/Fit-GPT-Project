import React, { useEffect, useState } from 'react';
import { Avatar, Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getBalancePlan, saveBalancePlan } from '../helpers/api-communicator';
import { CiSaveDown2 } from "react-icons/ci";

const BalancePlanResponse: React.FC = () => {
  const auth = useAuth();
  const [balancePlan, setBalancePlan] = useState<string>('');
  const [balancePlanId, setBalancePlanId] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalancePlan = async () => {
      try {
        toast.loading("Retrieving Balance Plan", { id: "retrievePlan" });
        const response = await getBalancePlan();

        // Accessing the nested balancePlan array
        const planArray = response.balancePlan?.balancePlan || [];
        const formattedPlan = planArray.join('\n'); // Join the array into a single string
          
        setBalancePlan(formattedPlan);
        setBalancePlanId(response.balancePlan?.balanceId); // Store the balancePlanId
        toast.success("Balance plan retrieved successfully", { id: "retrievePlan" });
      } catch (err) {
        toast.error("Failed to retrieve balance plan", { id: "retrievePlan" });
      } finally {
        setLoading(false);
      }
    };

    if (auth?.isLoggedIn && auth?.user) {
      fetchBalancePlan();
    } else {
      setLoading(false);
    }

    return () => {
      setBalancePlan(''); 
    };
  }, [auth]);

  const handleSaveBalancePlan = async () => {
    try {
      const response = await saveBalancePlan(balancePlanId); 
      toast.success("Balance plan saved successfully");
      console.log("Saved Balance Plan ID:", response.balancePlanId); 
    } catch (error) {
      toast.error("Failed to save balance plan");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        mt: 3,
        gap: 3,
        flexDirection: { xs: 'column-reverse', md: 'row' }, // Reverse column order on mobile
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'scale(0.95)',
      }}
    >
      <Box
        sx={{
          display: { md: 'flex', xs: 'flex', sm: 'flex' }, // Display on all screen sizes
          flex: 0.2,
          flexDirection: 'column',
          order: { xs: 2, md: 1 }, // Order change on mobile
          mb: { xs: 2, md: 0 }, // Add margin below on mobile
          alignItems: 'center', // Center align the text box
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: 'auto',
            bgcolor: '#1C1C1C',
            borderRadius: 5,
            border: '2px solid gold',
            flexDirection: 'column',
            mx: 3,
            p: 3,
          }}
        >
          <Avatar
            sx={{
              mx: 'auto',
              my: 2,
              bgcolor: 'white',
              color: 'black',
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {auth?.user?.name.split(' ')[1][0]}
          </Avatar>
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              textAlign: 'center',
              color: 'white',
              mt: 2,
            }}
          >
            Custom Balance Plan
          </Typography>
          <Typography
            component="div" // Use "div" or "p" to ensure block-level rendering
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              my: 4,
              p: 3,
              textAlign: 'center',
              color: 'white',
            }}
          >
            In this tab, your personal AI Fitness Assistant will help you devise a plan to improve your balance in a targeted movement.<br />
            Scroll to the bottom of the plan in order to have the option to save it.<br />
            If you are on mobile, scroll down to see your balance plan.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: { md: 0.8, xs: 1, sm: 1 },
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          mt: 0,
          pl: { md: 3, xs: 0 }, // Add padding only on larger screens
          ml: { xs: 'auto', md: '0' }, // Ensure proper alignment on all screen sizes
          mr: { xs: 'auto', md: '0' }, // Ensure proper alignment on all screen sizes
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          🤸🏻‍♂️Custom Balance Plan🤸🏻‍♂️
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh", // Maintain the scrollable area on larger screens
            maxHeight: { xs: "60vh", md: "60vh" }, // Ensure content doesn't exceed this height
            borderRadius: 3,
            mx: 'auto',
            display: 'flex',
            flexDirection: "column",
            overflowY: 'auto', // Enable vertical scrolling
            overflowX: 'hidden', // Prevent horizontal scrolling
            scrollBehavior: "smooth",
            backgroundColor: '#2E2E2E',
            padding: 2,
            border: '2px solid white',
            boxSizing: 'border-box', // Ensure padding and border don't cut off content
          }}
        >
          <Box sx={{ display: 'flex', p: 2, bgcolor: '#004d5612', my: 2, gap: 2, ml: -1, borderRadius: 2 }}>
            <Avatar sx={{ m1: '0' }}>
              <img src="Dumbell_Icon.png" alt="Balance_Icon" width={"30px"} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                fontSize={"20px"}
                component="pre"
                style={{ whiteSpace: 'pre-wrap', color: 'white' }}
              >
                {balancePlan ? balancePlan : 'No valid balance plan found'}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CiSaveDown2 />}
            onClick={handleSaveBalancePlan}
            sx={{
              mt: 3,
              bgcolor: 'gold',
              color: 'black',
              fontWeight: 700,
              '&:hover': {
                bgcolor: 'darkgoldenrod',
              },
              alignSelf: 'center', // Center the button within the box
            }}
          >
            Save Balance Plan
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BalancePlanResponse;
