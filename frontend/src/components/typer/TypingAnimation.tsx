import { TypeAnimation } from 'react-type-animation';

const TypingAnimation = () => {
  const textStyle = {
    fontSize: "4.6rem", // Default for large screens
    color: "white",
    display: "inline-block",
    textShadow: "1px 1px 20px #000",
    width: '100%',
  };

  // Inline media query for mobile devices
  const mobileStyle = window.matchMedia("(max-width: 600px)").matches
    ? { fontSize: "1.8rem" } // Smaller font size for mobile
    : {};

  return (
    <TypeAnimation
      sequence={[
        'Chat With Your Own AI Personal Fitness Assistant',
        1000,
        '',
        1000,
        'Get Personal Video Suggestions and Personalized Fitness Plans',
        2000,
        'Your Fitness Journey Starts Here',
        1500,
      ]}
      speed={50}
      style={{ ...textStyle, ...mobileStyle }}
      repeat={Infinity}
    />
  );
};

export default TypingAnimation;
