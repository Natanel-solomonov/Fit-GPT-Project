import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Logo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      {!isMobile && (
        <Link
          to={"/"}
          style={{ position: "absolute", top: -10, left: -20 }}
        >
          <img
            src="Dumbell_Icon.png"
            alt="openai"
            width={"75px"}
            height={"75px"}
            className="image-inverted"
          />
        </Link>
      )}
      <Typography
        sx={{
          display: { xs: "none", sm: "block" }, // Hides the text on mobile and shows it on sm and larger screens
          ml: "55px",
          fontWeight: "800",
          textShadow: "2px 2px 20px #000",
          mt: "5px",
          fontSize: "30px",
        }}
      >
        <span>FIT-GPT</span>
      </Typography>
    </div>
  );
};

export default Logo;
