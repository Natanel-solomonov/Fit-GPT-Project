import { TextField, SxProps } from '@mui/material';
import { Theme } from '@mui/system';

type Props = {
    name: string;
    type: string;
    label: string;
    sx?: SxProps<Theme>; // Add the sx prop with the correct type
};

const CustomizedInput = (props: Props) => {
    return (
        <TextField
            margin="normal"
            name={props.name}
            label={props.label}
            type={props.type}
            InputProps={{
                style: {
                    fontSize: 20,
                    color: 'white',
                },
            }}
            sx={{
                width: "400px",
                borderRadius: 4, // Slightly rounded corners
                '& .MuiOutlinedInput-root': {
                    borderRadius: 4, // Slightly rounded corners for input field
                    '& fieldset': {
                        borderColor: 'yellow', // Default border color
                    },
                    '&:hover fieldset': {
                        borderColor: 'yellow', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'yellow', // Border color when focused
                    },
                },
                '& .MuiInputLabel-root': {
                    color: 'white', // Default label color
                    '&.Mui-focused': {
                        color: 'white', // Label color when focused (remains white)
                    },
                    '@media (max-width: 600px)': {
                        fontSize: 16, // Adjust label font size for mobile
                    },
                },
                '& .MuiInputBase-input': {
                    fontSize: 20, // Input text font size
                    '@media (max-width: 600px)': {
                        fontSize: 16, // Adjust input text font size for mobile
                        height: "45px", // Adjust input height on mobile
                    },
                },
                ...props.sx, // Apply any custom sx passed in from props
            }}
        />
    );
};

export default CustomizedInput;
