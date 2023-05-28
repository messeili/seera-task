import React from 'react';
import {Box, Typography} from '@mui/material';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

const ErrorComponent: React.FC<{ message: string }> = ({message}) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100%"
        >
            <ReportGmailerrorredIcon className="text-9xl" fontSize="large" color="error"/>
            <Typography className="font-bold mt-5" variant="h3" color="error">
                {message || 'Something went wrong'}
            </Typography>
        </Box>
    );
};

export default ErrorComponent;
