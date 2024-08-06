
import { TypeAnimation } from 'react-type-animation';
const TypingAnimation =() =>{
    return(
        <TypeAnimation
        sequence={[
          // Same substring at the start will only be typed out once, initially
          'Chat With Your Own AI Personal Fitness Assistant',
          1000, // wait 1s before replacing "Mice" with "Hamsters"
          '',
          1000,
          'Get Personal Video Suggesitons and Personalized Fitness Plans',
          2000,
          'Your Fitness Journey Starts Here',
          1500,
        ]}
       
        speed={50}
        style={{ 
            fontSize: "60px",
             color:"white",
             display:"inline-block",
              textShadow:"1px 1px 20px #000",
            }}
        repeat={Infinity}
      />
    );
}

export default TypingAnimation;