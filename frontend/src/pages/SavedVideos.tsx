import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardMedia, Typography } from '@mui/material';
import axios from 'axios';

// Define the type for a video
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

  return (
    <Box sx={{ bgcolor: 'black', minHeight: '100vh', p: 3 }}>
      <Typography variant="h4" color="white" gutterBottom>
        Saved Videos
      </Typography>
     
      <Grid container spacing={3}>
        {videos.map((video, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ bgcolor: 'gray' }}>
              <CardMedia
                component="iframe"
                src={`https://www.youtube.com/embed/${new URL(video.url).searchParams.get('v')}`}
                title={video.title}
                sx={{ height: 200 }}
                allowFullScreen
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" color="white">
                  {video.title}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SavedVideos;