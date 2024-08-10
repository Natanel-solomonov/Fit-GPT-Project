import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { IoIosLogIn } from 'react-icons/io';
import CustomizedInput from '../components/shared/CustomizedInput';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        console.log(name, email, password);
        try {
            toast.loading("Signing Up", { id: "signup" });
            await auth?.signup(name, email, password);
            toast.success("Signed Up Successfully", { id: "signup" });
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
        <Box width={'100%'} height={'100%'} display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="center" alignItems="flex-end">
            <Box
                padding={8}
                display={{ md: "flex", sm: "none", xs: "none" }}
                sx={{
                    position: "relative",
                    left: "-300px",
                    bottom: "-150px"
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
                    left: "-410px"
                }}
            >
                <form
                    onSubmit={handleSubmit}
                    style={{
                        margin: 'auto',
                        padding: '30px',
                        boxShadow: "0 0 20px rgba(255,255,255,1)",
                        borderRadius: '10px',
                        border: "none",
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: "column",
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Typography
                            variant='h4'
                            textAlign="center"
                            padding={2}
                            fontWeight={600}
                        >
                            Signup & Get Fit!
                        </Typography>
                        <CustomizedInput type="text" name="name" label="Name" />
                        <CustomizedInput type="email" name="email" label="Email" />
                        <CustomizedInput type="password" name="password" label="Password" />
                        <Button
                            type="submit"
                            sx={{
                                px: 2,
                                py: 1,
                                mt: 2,
                                width: "400px",
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
            <Box
                padding={8}
                display={{ md: "flex", sm: "none", xs: "none" }}
                sx={{
                    position: "absolute",
                    right: "-115px",
                    bottom: "-150px"
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

export default Signup;