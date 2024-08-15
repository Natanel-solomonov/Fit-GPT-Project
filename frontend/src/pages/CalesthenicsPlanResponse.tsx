import { useEffect, useState } from 'react';
import { Avatar, Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getCalisthenicsPlan, saveCalisthenicsPlan } from '../helpers/api-communicator';
import { CiSaveDown2 } from "react-icons/ci";

const CalisthenicsPlanResponse = () => {
  const auth = useAuth();
  const [calisthenicsPlan, setCalisthenicsPlan] = useState<string>('');
  const [calisthenicsPlanId, setCalisthenicsPlanId] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCalisthenicsPlan = async () => {
      try {
        toast.loading("Retrieving Calisthenics Plan", { id: "retrievePlan" });
        const response = await getCalisthenicsPlan();

        // Accessing the nested calisthenicsPlan array
        const planArray = response.calisthenicsPlan?.calisthenicsPlan || [];
        const formattedPlan = planArray.join('\n'); // Join the array into a single string
          
        setCalisthenicsPlan(formattedPlan);
        setCalisthenicsPlanId(response.calisthenicsPlan?.calisthenicsId); // Store the calisthenicsPlanId
        toast.success("Calisthenics plan retrieved successfully", { id: "retrievePlan" });
      } catch (err) {
        toast.error("Failed to retrieve calisthenics plan", { id: "retrievePlan" });
      } finally {
        setLoading(false);
      }
    };

    if (auth?.isLoggedIn && auth?.user) {
      fetchCalisthenicsPlan();
    } else {
      setLoading(false);
    }

    return () => {
      setCalisthenicsPlan(''); 
    };
  }, [auth]);

  const handleSaveCalisthenicsPlan = async () => {
    try {
      const response = await saveCalisthenicsPlan(calisthenicsPlanId); 
      toast.success("Calisthenics plan saved successfully");
      console.log("Saved Calisthenics Plan ID:", response.calisthenicsPlanId); 
    } catch (error) {
      toast.error("Failed to save calisthenics plan");
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
            Custom Calisthenics Plan
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
            In this tab, your personal AI Fitness Assistant will help you devise a plan to get stronger with a calisthenics movement you specified.<br />
            Scroll to the bottom of the plan in order to have the option to save it.<br />
            If you are on mobile, scroll down to see your calisthenics plan.
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
          🤸🏻‍♂️Custom Calisthenics Plan🤸🏻‍♂️
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
              <img src="Dumbell_Icon.png" alt="Dumbell_Icon" width={"30px"} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                fontSize={"20px"}
                component="pre"
                style={{ whiteSpace: 'pre-wrap', color: 'white' }}
              >
                {calisthenicsPlan}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CiSaveDown2 />}
            onClick={handleSaveCalisthenicsPlan}
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
            Save Calisthenics Plan
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CalisthenicsPlanResponse;
