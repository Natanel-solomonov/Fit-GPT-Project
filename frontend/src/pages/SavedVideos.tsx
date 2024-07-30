import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardMedia, Typography } from '@mui/material';
import axios from 'axios';
import { IoIosDownload } from "react-icons/io";

// Define the type for a video
interface Video {
  title: string;
  url: string;
}

const SavedVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]); // Use the Video type for the state

  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const response = await axios.get('/chat/saved-videos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setVideos(response.data.videos);
      } catch (error) {
        console.error('Error fetching saved videos:', error);
      }
    };

    fetchSavedVideos();
  }, []);

  return (
    <Box sx={{ bgcolor: 'black', minHeight: '100vh', p: 3 }}>
      <Typography variant="h4" color="white" gutterBottom>
        Saved Videos
      </Typography>
      <IoIosDownload/>
      <Grid container spacing={3}>
        {videos.map((video, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ bgcolor: 'gray' }}>
              <CardMedia
                component="iframe"
                src={video.url}
                title={video.title}
                sx={{ height: 200 }}
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