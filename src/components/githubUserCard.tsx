import React from 'react';
import {Card, CardContent, Tooltip, Avatar, Typography, Button} from '@mui/material';

interface GithubUserCardProps {
    name: string;
    avatar: string;
    url: string;
}

const GithubUserCard: React.FC<GithubUserCardProps> = ({name, avatar, url}) => {
    return (
        <Card className="shadow-md rounded-lg">
            <CardContent>
                <div className="flex gap-3 mb-10 items-center">
                    <Avatar src={avatar} alt={name} sx={{width: 60, height: 60}}/>
                    <Tooltip className="cursor-pointer" title={name} placement="top-start">
                        <Typography className="truncate" variant="h5">{name}</Typography>
                    </Tooltip>
                </div>
                <Typography variant="body2" color="textSecondary" component="p">
                    Visit the GitHub profile:
                </Typography>
                <Button className="mt-3" variant="contained" color="primary" href={url} target="_blank" rel="noopener noreferrer">
                    Go to Profile
                </Button>
            </CardContent>
        </Card>
    );
};

export default GithubUserCard;
