import { Avatar, Box, Typography, Button, IconButton } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io';
import { sendChatRequest } from '../helpers/api-communicator';
type Message = {
    role:"user"|"assistant";
    content:string;
};


const Chat = () => {
    const inputRef = useRef<HTMLInputElement|null>(null);
    const auth = useAuth();
    const[chatMessages,setChatMessages] = useState<Message[]>([])
    const handleSubmit = async()=>{
        const content = inputRef.current?.value as string;
        if(inputRef && inputRef.current){
            inputRef.current.value=="";
        }
        const newMessage: Message = {role:"user",content};
        setChatMessages((prev)=>[...prev,newMessage]);
        const chatData = await sendChatRequest(content);
        setChatMessages((prev)=>[...chatData.chats]);
        //
    };
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
                        You are talking to a Fitness ChatBOT
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
                        You can ask any questions related to Nutrition, Fitness, Health and Wellness
                        <br />
                        <div style={{ textAlign: 'center' }}>
                            Example: How do I do a proper push-up?
                        </div>
                    </Typography>
                    <Button
                        sx={{
                            width: '200px',
                            my: 'auto',
                            color: 'black',
                            fontWeight: '700',
                            borderRadius: 3,
                            mx: 'auto',
                            bgcolor: 'darkgrey',
                            ':hover': {
                                bgcolor: '#FFFFFF',
                            },
                        }}
                    >
                        Clear Conversation
                    </Button>
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
                    Model - FIT- GPT- 4.0 Turbo
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
                        border: '2px solid white',  // Add white border radius around the entire box
                    }}
                >
                    {chatMessages.map((chat, index) => (
                        //@ts-ignore
                        <ChatItem content={chat.content} role={chat.role} key={index} />
                    ))}
                </Box>
                <Box 
                    sx={{
                        width: "100%",
                        padding: "20px",
                        borderRadius: 8,
                        backgroundColor: "#2C2C2C",
                        display: "flex",
                        margin: "auto",
                        mt: 2,  // Add margin top to move the input box slightly down
                        border: '2px solid gold',  // Add golden border radius
                    }}
                >
                    <input 
                        ref={inputRef}
                        type="text" 
                        style={{
                            width: "100%", 
                            backgroundColor: "transparent", 
                            padding: '10px', 
                            border: "none",
                            outline: "none",
                            color: "white",
                            fontSize: "20px"
                        }}
                    />
                    <IconButton onClick ={handleSubmit} sx={{ ml: "auto", color: "white" }}>
                        <IoMdSend />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default Chat