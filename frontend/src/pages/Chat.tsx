import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Avatar, Box, Typography, Button, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { fetchSavedVideos } from './SavedVideos'; // Import the fetchSavedVideos function

type Message = {
  role: "user" | "assistant";
  content: string;
  videoId?: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      const chatData = await sendChatRequest(content);
      const updatedChatMessages = chatData.chats.map((chat: any) => ({
        role: chat.role,
        content: chat.content,
        videoId: chat.videoId
      }));
      setChatMessages(updatedChatMessages);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleted Chats failed", { id: "deletechats" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth?.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        }).catch(err => {
          console.log(err);
          toast.error("Loading failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  }, [auth]);

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        mt: 3,
        gap: 3,
        flexDirection: { xs: 'column-reverse', md: 'row' }, // Column-reverse on mobile to bring the clear conversation box above the chat section
        alignItems: 'center', // Center align the items
        justifyContent: 'center',
        transform: 'scale(0.95)',
      }}
    >
      <Box
        sx={{
          display: { md: 'flex', xs: 'flex', sm: 'flex' }, // Ensure it displays on mobile too
          flex: 0.2,
          flexDirection: 'column',
          order: { xs: 2, md: 1 }, // Change order on mobile
          mb: { xs: 2, md: 0 }, // Add margin below on mobile
          alignItems: 'center', // Center align the button box
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: 'auto', // Auto height on mobile to prevent overflow
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
            You can ask any questions related to Nutrition, Fitness, Health, Wellness, Sports etc
            <br />
            <div style={{ textAlign: 'center' }}>
              Example: How do I do a proper Push Up?
            </div>
            <div style={{ textAlign: 'center' }}>
             If you are on mobile, scroll down to see the chat window
            </div>
          </Typography>
          <Button
            onClick={handleDeleteChats}
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
          mt: 0,
          pl: { md: 3, xs: 0 }, // Add padding only on larger screens
          marginLeft: 'auto', // Ensure proper alignment on mobile
          marginRight: 'auto',
        }}
        id="chatBox" // Add an ID for scrolling into view
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
            border: '2px solid white',
            paddingBottom: '60px'
          }}
        >
          {chatMessages.map((chat, index) => (
            <React.Fragment key={index}>
              <ChatItem content={chat.content} role={chat.role} videoId={chat.videoId} refreshSavedVideos={fetchSavedVideos} />
            </React.Fragment>
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
            mt: 2,
            border: '2px solid gold',
            position: 'fixed',
            bottom: 0, // Keep the input box above the keyboard
            left: 0,
            right: 0,
            zIndex: 10,
            paddingBottom: { xs: 'env(safe-area-inset-bottom)', sm: '-20px' }, // For iOS safe area
          }}
        >
          <input
            ref={inputRef}
            type="text"
            onKeyDown={handleKeyDown}
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
          <IconButton onClick={handleSubmit} sx={{ ml: "auto", color: "white" }}>
            <IoMdSend />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
