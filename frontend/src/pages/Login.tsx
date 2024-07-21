import { Box } from '@mui/material';
import React from 'react';

const Login = () => {
    return (
        <Box width={"100%"} height={"100vh"} display="flex" flexDirection="column" justifyContent="space-between">
            <Box 
                display={{ md: "flex", sm: "none", xs: "none" }} 
                padding={2}
                alignSelf="flex-start"
                style={{ marginBottom: "16px" }}
            >
                <img src="/FitGPTLogo.png" alt="openai" style={{ width: "400px", marginLeft: "-90px", marginTop: "175px" }} />
            </Box>
            <Box 
                display={"flex"} 
                flex={{ xs: 1, md: 0.5 }} 
                justifyContent={"center"} 
                alignItems={"center"}
                padding={2}
                ml={'Auto'}
                mt={16}
            ></Box>
        </Box>
    );
}

export default Login;