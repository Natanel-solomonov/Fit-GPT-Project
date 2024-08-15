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
import {  FaSms } from 'react-icons/fa';

interface Video {
  title: string;
  url: string;
}

export const fetchSavedVideos = async () => {
  try {
    const response = await axios.get('/chat/saved-videos');
    if (response.data && Array.isArray(response.data.videos)) {
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
        setVideos([]); 
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'black', flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '55%' }, height: { xs: 'auto', md: '100vh' }, overflowY: 'scroll' }}>
        <Box sx={{ position: 'sticky', top: 0, bgcolor: 'black', zIndex: 1, p: 2 }}>
          <Typography variant="h5" color="white" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Saved Videos
            <CiSaveDown2 color="gold" size={25} style={{ marginTop: '-15px', marginLeft: '10px' }} />
          </Typography>
          <Button 
            variant="contained" 
            sx={{
              backgroundColor: 'gold',
              color: 'black',
              fontSize: { xs: '0.8rem', md: '1rem' },
              '&:hover': {
                backgroundColor: 'goldenrod',
              }
            }} 
            onClick={clearSavedVideos}
          >
            Clear All Saved Videos
          </Button>
        </Box>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {videos.map((video, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', bgcolor: 'black', flexDirection: 'column' }}>
                <Card className="golden-border" sx={{ bgcolor: 'black', flex: 1 }}>
                  <CardMedia
                    component="iframe"
                    src={`https://www.youtube.com/embed/${new URL(video.url).searchParams.get('v')}`}
                    title={video.title}
                    sx={{ height: { xs: 150, sm: 200 } }}
                    allowFullScreen
                  />
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" color="white" sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                      {video.title}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => deleteSavedVideo(new URL(video.url).searchParams.get('v') || '')}>
                        <FaTrashAlt color="white" size={20} />
                      </IconButton>
                      <IconButton onClick={() => toggleShareButtons(index)}>
                        <FaShare color="white" size={20} />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
                {showShareButtons[index] && (
                  <Box
                    sx={{
                      bgcolor: 'white',
                      p: 1,
                      borderRadius: 1,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <FacebookShareButton url={video.url} title="Check out this fitness video">
                      <FacebookIcon size={28} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={video.url} title="Check out this fitness video">
                      <TwitterIcon size={28} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={video.url} title="Check out this fitness video">
                      <WhatsappIcon size={28} round />
                    </WhatsappShareButton>
                    <EmailShareButton url={video.url} subject="Fitness Video Recommendation" body="Check out this fitness video">
                      <EmailIcon size={28} round />
                    </EmailShareButton>
                    <IconButton onClick={() => shareToIMessage(video.url, "Check out this fitness video")}>
                      <FaSms color="green" size={28} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img src="deadlift.png" alt="deadlift" style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>
    </Box>
  );
};

export default SavedVideos;
