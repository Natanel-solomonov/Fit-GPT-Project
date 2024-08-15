import  { useEffect, useState } from 'react';
import { Avatar, Box, Typography, IconButton } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import useTypewriter from '../../hooks/useTypeWriter';
import { IoIosDownload } from "react-icons/io";
import { saveVideo as saveVideoAPI } from '../../helpers/api-communicator';
import { toast } from 'react-hot-toast';

const ChatItem = ({
  content,
  role,
  videoId,
  refreshSavedVideos, // Add this prop
  saved // Add this prop to indicate if the chat is saved
}: {
  content: string;
  role: 'user' | 'assistant';
  videoId?: string;
  refreshSavedVideos?: () => void; // Add this prop type
  saved?: boolean; // Add this prop type
}) => {
  const auth = useAuth();
  const typewriterText = useTypewriter(content, 2); // Adjust speed as needed
  const [isTextComplete, setIsTextComplete] = useState(false);

  useEffect(() => {
    if (saved) {
      setIsTextComplete(true);
    } else {
      const textCompleteCheck = setInterval(() => {
        if (typewriterText === content) {
          setIsTextComplete(true);
          clearInterval(textCompleteCheck);
        }
      }, 100);

      return () => clearInterval(textCompleteCheck);
    }
  }, [typewriterText, content, saved]);

  useEffect(() => {
    console.log('isTextComplete:', isTextComplete);
    console.log('videoId:', videoId);
  }, [isTextComplete, videoId]);

  const saveVideo = async (videoId: string) => {
    if (!videoId) {
      console.error('No videoId provided to save');
      return;
    }
    try {
      await saveVideoAPI(videoId);
      toast.success('Video saved successfully!');
      if (refreshSavedVideos) {
        refreshSavedVideos(); // Call the refresh function after saving a video
      }
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
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
        <Box
          sx={{
            display: 'flex',
            p: 2,
            bgcolor: '#004d5612',
            my: 2,
            gap: 2,
            ml: -1,
            borderRadius: 2,
            flexDirection: { xs: 'column', md: 'row' }, // Ensure proper layout on mobile and desktop
          }}
        >
          <Avatar sx={{ m1: '0' }}>
            <img src="Dumbell_Icon.png" alt="Dumbell_Icon" width={"30px"} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography fontSize={"20px"}>{renderContent(saved ? content : typewriterText)}</Typography>
            {isTextComplete && videoId && (
              <Box
                sx={{
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexDirection: { xs: 'column', md: 'row' }, // Adjust direction on mobile
                  width: { xs: '100%', md: 'auto' }, // Adjust width based on screen size
                }}
              >
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ maxWidth: '600px' }} // Prevent stretching on larger screens
                ></iframe>
                <IconButton
                  sx={{
                    bgcolor: 'gold',
                    color: 'black',
                    p: 1,
                    '&:hover': {
                      bgcolor: 'gold',
                      color: 'white'
                    },
                  }}
                  onClick={() => saveVideo(videoId)}
                >
                  <IoIosDownload />
                </IconButton>
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
