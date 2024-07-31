import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardMedia, Typography, Button, IconButton } from '@mui/material';
import { FaTrashAlt } from "react-icons/fa";
import { CiSaveDown2 } from "react-icons/ci";
import { toast } from 'react-hot-toast';
import axios from 'axios';

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
        toast.success("All Saved Vidoes Cleared")
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
              <Card className="golden-border" sx={{ bgcolor: 'black' }}>
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
                  <IconButton onClick={() => deleteSavedVideo(new URL(video.url).searchParams.get('v') || '')}>
                    <FaTrashAlt color="white" />
                  </IconButton>
                </Box>
              </Card>
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