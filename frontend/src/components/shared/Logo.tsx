import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

const Logo = () => {
  return (
    <div
      style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "15px",
        position: "relative",
      }}
    >
      <Link to={"/"} style={{ position: "absolute", top: -10, left: -20 }}>
        <img
          src="Dumbell_Icon.png"
          alt="openai"
          width={"50px"}
          height={"50px"}
          className="image-inverted"
        />
      </Link>
      <Typography
        sx={{
          display: { md: "block", sm: "none", xs: "none" },
          ml: "40px", // Adjust this value to move the text more to the right
          fontWeight: "800",
          textShadow: "2px 2px 20px #000",
        }}
      >
        <span style={{ fontSize: "20px" }}>FIT</span>-GPT
      </Typography>
    </div>
  );
};

export default Logo;