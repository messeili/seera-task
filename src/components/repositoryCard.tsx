import React from 'react';
import {Card, CardContent, Typography, Chip} from '@mui/material';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

interface RepositoryCardProps {
    name: string;
    language: string;
    description: string;
    forks_count: number;
    topics: string[];
}
const RepositoryCard: React.FC<RepositoryCardProps> = ({ name, language, description, forks_count, topics }) => {
    return (
        <Card className="shadow-md rounded-lg">
            <CardContent>
                <DriveFolderUploadIcon fontSize="large" />
                <Typography className="truncate" variant="h5">{name}</Typography>
                <Typography variant="body2">Language: {language}</Typography>
                <Typography className="line-clamp-3" variant="body2">{description}</Typography>
                <Typography variant="body2">Forks: {forks_count}</Typography>
                <div className="mt-3">
                    {topics.slice(0,4).map((topic, index) => (
                        <Chip className="m-1" key={index} label={topic} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RepositoryCard;
