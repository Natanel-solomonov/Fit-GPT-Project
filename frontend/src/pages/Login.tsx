import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { IoIosLogIn } from 'react-icons/io';
import CustomizedInput from '../components/shared/CustomizedInput';

const Login = () => {
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
                <form style={{
                    margin: 'auto',
                    padding: '30px',
                    boxShadow: "0 0 20px rgba(255,255,255,1)",
                    borderRadius: '10px',
                    border: "none",
                }}>
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
                            Login & Get Fit!
                        </Typography>
                        <CustomizedInput type="Email" name="Email" label="Email" />
                        <CustomizedInput type="Password" name="Password" label="Password" />
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

export default Login;