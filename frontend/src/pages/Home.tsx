import { Box} from '@mui/material';
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
            flexDirection: { md: 'row', xs: 'column', sm: 'column' },
            gap: 5,
            my: 10,
          }}
        >
          <img
            src="BrainLogo.png"
            alt="BrainLogo"
            style={{ width: '200px', margin: 'auto', marginTop: -35 }}
          />
          <img
            src="HeartLogo.png"
            alt="HeartLogo"
            style={{ width: '260px', margin: 'auto', marginTop: -35 }}
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