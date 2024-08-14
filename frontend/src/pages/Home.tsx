import { Box } from '@mui/material';
import TypingAnimation from '../components/typer/TypingAnimation';

const Home = () => {
  return (
    <Box width={'100%'} height={'100%'}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          mx: 'auto',
          mt: 3,
        }}
      >
        <Box>
          <TypingAnimation />
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'row', md: 'row' },
            gap: 5,
            my: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="BrainLogo.png"
            alt="BrainLogo"
            style={{ width: '150px', margin: 'auto' }} // Adjusted width for mobile
          />
          <img
            src="HeartLogo.png"
            alt="HeartLogo"
            style={{ width: '195px', margin: 'auto' }} // Adjusted width for mobile
          />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', mx: 'auto' }}>
          <img
            src="chats.png"
            alt="chats.png"
            style={{
              display: 'flex',
              margin: 'auto',
              width: '60%',
              borderRadius: 20,
              boxShadow: '-5px -5px 105px #ffffff',
              marginTop: -55,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
