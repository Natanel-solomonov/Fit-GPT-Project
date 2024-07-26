import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import useTypewriter from '../../hooks/useTypeWriter';

const ChatItem = ({
  content,
  role
}: {
  content: string;
  role: 'user' | 'assistant';
}) => {
  const auth = useAuth();
  const typewriterText = useTypewriter(content, 50); // Adjust speed as needed

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

  return role === 'assistant' ? (
    <Box sx={{ display: 'flex', p: 2, bgcolor: '#004d5612', my: 2, gap: 2, ml: -1, borderRadius: 2 }}>
      <Avatar sx={{ m1: '0' }}>
        <img src="Dumbell_Icon.png" alt="Dumbell_Icon" width={"30px"} />
      </Avatar>
      <Box>
        <Typography fontSize={"20px"}>{renderContent(typewriterText)}</Typography>
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
  );
};

export default ChatItem;