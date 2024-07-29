import React, { useEffect, useState } from 'react';
import { Avatar, Box, Typography, IconButton } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import useTypewriter from '../../hooks/useTypeWriter';
import { IoIosDownload } from "react-icons/io";
import axios from 'axios';

const ChatItem = ({
  content,
  role,
  videoIds
}: {
  content: string;
  role: 'user' | 'assistant';
  videoIds?: string[];
}) => {
  const auth = useAuth();
  const typewriterText = useTypewriter(content, 2); // Adjust speed as needed
  const [isTextComplete, setIsTextComplete] = useState(false);

  useEffect(() => {
    const textCompleteCheck = setInterval(() => {
      if (typewriterText === content) {
        setIsTextComplete(true);
        clearInterval(textCompleteCheck);
      }
    }, 100);

    return () => clearInterval(textCompleteCheck);
  }, [typewriterText, content]);

  const saveVideo = async (videoId: string) => {
    try {
      await axios.post('/saved-videos', { videoId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Video saved successfully!');
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video');
    }
  };

  const renderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) =>
      urlRegex.test(part) ? (
        <a href={part} key={index} target="_blank" rel="noopener noreferrer" style={{ color: 'skyblue', textDecoration: 'underline' }}>
          {part}
        </a>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <>
      {role === 'assistant' ? (
        <Box sx={{ display: 'flex', p: 2, bgcolor: '#004d5612', my: 2, gap: 2, ml: -1, borderRadius: 2 }}>
          <Avatar sx={{ m1: '0' }}>
            <img src="Dumbell_Icon.png" alt="Dumbell_Icon" width={"30px"} />
          </Avatar>
          <Box>
            <Typography fontSize={"20px"}>{renderContent(typewriterText)}</Typography>
            {isTextComplete && videoIds && (
              <Box
                sx={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-around'
                }}
              >
                {videoIds.map((videoId, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <iframe
                      width="300"
                      height="200"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <IconButton
                      sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'white' }}
                      onClick={() => saveVideo(videoId[index])}
                    >
                      <IoIosDownload />
                    </IconButton>
                  </Box>
                  
                ))}
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', p: 2, bgcolor: '#839192', gap: 2, ml: -1, borderRadius: 2, border: '2px solid gold' }}>
          <Avatar sx={{ m1: '0', bgcolor: 'black', color: 'white' }}>
            {auth?.user?.name[0]}
            {auth?.user?.name.split(' ')[1][0]}
          </Avatar>
          <Box>
            <Typography fontSize={"20px"} sx={{ color: 'black' }}>{renderContent(content)}</Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatItem;