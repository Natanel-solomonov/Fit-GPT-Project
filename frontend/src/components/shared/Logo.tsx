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
          width={"75px"}
          height={"75px"}
          className="image-inverted"
        />
      </Link>
      <Typography
        sx={{
          display: { md: "block", sm: "none", xs: "none" },
          ml: "55px", // Adjust this value to move the text more to the right
          fontWeight: "800",
          textShadow: "2px 2px 20px #000",
          mt: "5px"
        }}
      >
        <span style={{ fontSize: "30px" }}>FIT- GPT</span>
      </Typography>
    </div>
  );
};

export default Logo;