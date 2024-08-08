import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { IoIosLogIn } from 'react-icons/io';
import CustomizedInput from '../components/shared/CustomizedInput';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

const Signup = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const name = formData.get("name") as string;
        const password = formData.get("password") as string;
        console.log(email, password);
        try {
            toast.loading("Signing Up", { id: "signup" });
            await auth?.signup(name, email, password);
            toast.success("Signed In Successfully", { id: "signup" });
        } catch (error) {
            console.log(error);
            toast.error("Signing Up Failed", { id: "signup" });
        }
    };

    useEffect(() => {
        if (auth?.user) {
            return navigate("/chat");
        }
    }, [auth, navigate]);

    return (
        <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding={isSmallScreen ? 2 : 8}
        >
            {!isSmallScreen && (
                <Box display="flex" justifyContent="center" marginBottom={4}>
                    <img
                        src="FitGPTLogo.png"
                        alt="FitGPTLogo.png"
                        style={{ width: "200px" }}
                    />
                </Box>
            )}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width={isSmallScreen ? '100%' : '50%'}
                padding={2}
                boxShadow="0 0 20px rgba(255,255,255,1)"
                borderRadius="10px"
                bgcolor="background.paper"
            >
                <Typography
                    variant="h4"
                    textAlign="center"
                    padding={2}
                    fontWeight={600}
                >
                    Signup - Your Fitness Journey Starts Here
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CustomizedInput type="text" name="name" label="Name" />
                        <CustomizedInput type="email" name="email" label="Email" />
                        <CustomizedInput type="password" name="password" label="Password" />
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
                                }
                            }}
                            endIcon={<IoIosLogIn />}
                        >
                            Signup
                        </Button>
                    </Box>
                </form>
            </Box>
            {!isSmallScreen && (
                <Box display="flex" justifyContent="center" marginTop={4}>
                    <img
                        src="FitGPTLogoFemale.png"
                        alt="FitGPTLogoFemale.png"
                        style={{ width: "200px" }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default Signup;