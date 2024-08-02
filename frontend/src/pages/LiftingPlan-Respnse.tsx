import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getLiftingPlan } from '../helpers/api-communicator';

type Message = {
  role: "user" | "assistant";
  content: string;
  videoId?: string;
};

const LiftingPlanResponse = () => {
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth?.user) {
      toast.loading("Retrieving Lifting Plan", { id: "retrievePlan" });

      getLiftingPlan()
        .then(response => {
          const liftingPlanContent = response.liftingPlan.liftingPlan.map((weekPlan: any) => 
            `Week ${weekPlan.week}: Lift ${weekPlan.weight.toFixed(2)} lbs for ${weekPlan.sets} sets of ${weekPlan.reps} reps.`
          ).join('\n');
          setChatMessages([{ role: "assistant", content: liftingPlanContent }]);
          toast.success("Lifting plan retrieved successfully", { id: "retrievePlan" });
        })
        .catch(err => {
          console.log(err);
          toast.error("Failed to retrieve lifting plan", { id: "retrievePlan" });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [auth]);

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
        flexDirection: { xs: 'column', md: 'row' },
        transform: 'scale(0.95)'
      }}
    >
      <Box
        sx={{
          display: { md: 'flex', xs: 'none', sm: 'none' },
          flex: 0.2,
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: '60vh',
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
              mt: 2
            }}
          >
            Custom Fitness Plan
          </Typography>
          <Typography
            sx={{
              mx: 'auto',
              fontFamily: 'Work Sans',
              my: 4,
              p: 3,
              textAlign: 'center',
              color: 'white'
            }}
          >
            In this tab, your personal AI Fitness Assistant will help you devise a plan to get stronger with an exercise you specified 
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
          ml: 5,
          mt: 0,
          pl: 3,
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
          Custom Lifting Plans
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: 'auto',
            display: 'flex',
            flexDirection: "column",
            overflow: 'auto',
            scrollBehavior: "smooth",
            backgroundColor: '#2E2E2E',
            padding: 2,
            border: '2px solid white',
          }}
        >
          {chatMessages.map((chat, index) => (
            <Box key={index} sx={{ display: 'flex', p: 2, bgcolor: '#004d5612', my: 2, gap: 2, ml: -1, borderRadius: 2 }}>
              <Avatar sx={{ m1: '0' }}>
                <img src="Dumbell_Icon.png" alt="Dumbell_Icon" width={"30px"} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography fontSize={"20px"}>{chat.content}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LiftingPlanResponse;