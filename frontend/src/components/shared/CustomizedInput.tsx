import { TextField } from '@mui/material';
import React from 'react';

type Props = {
    name: string;
    type: string;
    label: string;
};

const CustomizedInput = (props: Props) => {
    return (
        <TextField
            margin="normal"
            name={props.name}
            label={props.label}
            type={props.type}
            InputProps={{style:{width: "400px", borderRadius: 10, fontSize:20, color:'white'}}}
            sx={{
                '& .MuiOutlinedInput-root': {
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
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'white', // Label color when focused
                },
            }}
           
        />
    );
};

export default CustomizedInput;