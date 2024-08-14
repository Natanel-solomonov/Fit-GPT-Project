import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { IoIosLogIn } from 'react-icons/io';
import CustomizedInput from '../components/shared/CustomizedInput';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        console.log(email, password);
        try {
            toast.loading("Signing In", { id: "login" });
            await auth?.login(email, password);
            toast.success("Signed In Successfully", { id: "login" });
        } catch (error) {
            console.log(error);
            toast.error("Signing in Failed", { id: "login" });
        }
    };

    useEffect(() => {
        if (auth?.user) {
            return navigate("/chat");
        }
    }, [auth, navigate]);

    return (
        <Box
            width={'100%'}
            height={'100%'}
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="center"
            alignItems="flex-end"
            sx={{
                '@media (max-width: 600px)': {
                    alignItems: 'center',
                    padding: 2,
                }
            }}
        >
            <Box
                padding={8}
                display={{ md: "flex", sm: "none", xs: "none" }}
                sx={{
                    position: "relative",
                    left: "-300px",
                    bottom: "-150px",
                    '@media (max-width: 600px)': {
                        display: "none",
                    }
                }}
            >
                <img
                    src="FitGPTLogo.png"
                    alt="FitGPTLogo.png"
                    style={{
                        width: "620px",
                    }}
                />
            </Box>
            <Box
                display={'flex'}
                flex={{ xs: 1, md: 0.5 }}
                justifyContent={'center'}
                alignItems={'flex-end'}
                padding={2}
                mb={4}
                sx={{
                    position: "relative",
                    left: "-410px",
                    '@media (max-width: 600px)': {
                        position: "static",
                        width: "80%",
                        mb: 2,
                        height: "120%"
                    }
                }}
            >
                <form
    onSubmit={handleSubmit}
    style={{
        margin: 'auto',
        padding: '20px', // Adjusted padding if necessary to fit the inputs
        boxShadow: "0 0 20px rgba(255,255,255,1)",
        borderRadius: '10px',
        border: "none",
        maxWidth: "400px",
        width: "100%",
        height: "100%", // Ensure height is 100% of the container
    }}
>
    <Box sx={{
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%", // Ensure height is 100% of the container
    }}>
        <Typography
            variant='h4'
            textAlign="center"
            padding={2}
            fontWeight={600}
            sx={{
                fontSize: { xs: '1.5rem', md: '2.125rem' },
            }}
        >
            Login & Get Fit!
        </Typography>
        <CustomizedInput 
            type="email" 
            name="email" 
            label="Email"
            sx={{
                width: '100%', // Default width
                '@media (max-width: 600px)': {
                    width: '80%', // Reduce width by 20% on mobile devices
                }
            }}
        />
        <CustomizedInput 
            type="password" 
            name="password" 
            label="Password"
            sx={{
                width: '100%', // Default width
                '@media (max-width: 600px)': {
                    width: '80%', // Reduce width by 20% on mobile devices
                }
            }}
        />
        <Button
            type="submit"
            sx={{
                px: 2,
                py: 1,
                mt: 2,
                width: "100%",
                borderRadius: 2,
                bgcolor: "gold",
                color: "black",
                ":hover": {
                    bgcolor: 'white',
                    color: 'black',
                },
                maxWidth: "400px"
            }}
            endIcon={<IoIosLogIn />}
        >
            Login
        </Button>
    </Box>
</form>

            </Box>
            <Box
                padding={8}
                display={{ md: "flex", sm: "none", xs: "none" }}
                sx={{
                    position: "absolute",
                    right: "-115px",
                    bottom: "-150px",
                    '@media (max-width: 600px)': {
                        display: "none",
                    }
                }}
            >
                <img
                    src="FitGPTLogoFemale.png"
                    alt="FitGPTLogoFemale.png"
                    style={{
                        width: "600px",
                    }}
                />
            </Box>
        </Box>
    );
};

export default Login;