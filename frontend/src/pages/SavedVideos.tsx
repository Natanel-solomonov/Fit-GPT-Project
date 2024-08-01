import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardMedia, Typography, Button, IconButton } from '@mui/material';
import { FaTrashAlt, FaShare } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  FacebookShareButton, FacebookIcon, 
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon,
  EmailShareButton, EmailIcon
} from 'react-share';
import { FaFacebookMessenger, FaSms } from 'react-icons/fa'; // Updated to use FaSms for iMessage icon

interface Video {
  title: string;
  url: string;
}

export const fetchSavedVideos = async () => {
  try {
    console.log('Fetching saved videos from /chat/saved-videos endpoint');
    const response = await axios.get('/chat/saved-videos');
    console.log('Received response from /chat/saved-videos:', response);

    if (response.data && Array.isArray(response.data.videos)) {
      console.log('Response data is in the expected format:', response.data.videos);
      return response.data.videos;
    } else {
      console.error('Invalid response format:', response.data);
      return [];
    }
  } catch (error) {
    //@ts-ignore
    console.error('Error fetching saved videos:', error.response || error.message || error);
    return [];
  }
};

const SavedVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [showShareButtons, setShowShareButtons] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const loadVideos = async () => {
      const videos = await fetchSavedVideos();
      setVideos(videos);
    };

    loadVideos();
  }, []);

  const clearSavedVideos = async () => {
    try {
      const response = await axios.delete('/chat/clear-saved-videos');
      if (response.status === 200) {
        setVideos([]); // Clear the videos from state
        toast.success("All Saved Videos Cleared")
      } else {
        toast.error("Error Clearing Videos");
      }
    } catch (error) {
      //@ts-ignore
      console.error('Error clearing saved videos:', error.response || error.message || error);
    }
  };

  const deleteSavedVideo = async (videoId: string) => {
    try {
      const response = await axios.delete(`/chat/saved-videos/${videoId}`);
      if (response.status === 200) {
        setVideos(prevVideos => prevVideos.filter(video => !video.url.includes(videoId)));
        toast.success('Video deleted successfully');
      } else {
        toast.error('Failed to delete video');
      }
    } catch (error) {
      //@ts-ignore
      console.error('Error deleting video:', error.response || error.message || error);
    }
  };

  const toggleShareButtons = (index: number) => {
    setShowShareButtons(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  

  const shareToIMessage = (url: string, message: string) => {
    window.open(`sms:&body=${encodeURIComponent(message + " " + url)}`, '_blank');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'black' }}>
      <Box sx={{ flex: 1, maxWidth: '55%', height: '100vh', overflowY: 'scroll' }}>
        <Box sx={{ position: 'sticky', top: 0, bgcolor: 'black', zIndex: 1, p: 3 }}>
          <Typography variant="h4" color="white" gutterBottom>
            Saved Videos
            <CiSaveDown2 color="gold" size={30} style={{ marginTop: '-20px', marginLeft: '10px' }} />
          </Typography>
          <Button 
            variant="contained" 
            sx={{
              backgroundColor: 'gold',
              color: 'black',
              '&:hover': {
                backgroundColor: 'goldenrod',
              }
            }} 
            onClick={clearSavedVideos}
          >
            Clear All Saved Videos
          </Button>
        </Box>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {videos.map((video, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', bgcolor: 'black' }}>
                <Card className="golden-border" sx={{ bgcolor: 'black', flex: 1 }}>
                  <CardMedia
                    component="iframe"
                    src={`https://www.youtube.com/embed/${new URL(video.url).searchParams.get('v')}`}
                    title={video.title}
                    sx={{ height: 200 }}
                    allowFullScreen
                  />
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="white">
                      {video.title}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => deleteSavedVideo(new URL(video.url).searchParams.get('v') || '')}>
                        <FaTrashAlt color="white" />
                      </IconButton>
                      <IconButton onClick={() => toggleShareButtons(index)}>
                        <FaShare color="white" />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
                {showShareButtons[index] && (
                  <Box
                    sx={{
                      bgcolor: 'white',
                      p: 2,
                      borderRadius: 1,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 1,
                      ml: 2, // Add margin-left to separate from the video card
                    }}
                  >
                    <FacebookShareButton url={video.url} title="Hey! Check out this fitness Video that Fit GPT recommended me">
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={video.url} title="Hey! Check out this fitness Video that Fit GPT recommended me">
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={video.url} title="Hey! Check out this fitness Video that Fit GPT recommended me">
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <EmailShareButton url={video.url} subject="Fitness Video Recommendation" body="Hey! Check out this fitness Video that Fit GPT recommended me">
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                   
                    <IconButton onClick={() => shareToIMessage(video.url, "Hey! Check out this fitness Video that Fit GPT recommended me")}>
                      <FaSms color="green" size={32} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'top', alignItems: 'top', height: '100vh' }}>
        <img src="deadlift.png" alt="deadlift" style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>
    </Box>
  );
};

export default SavedVideos;