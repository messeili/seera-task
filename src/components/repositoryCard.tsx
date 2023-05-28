import React from 'react';
import {Card, CardContent, Typography, Chip, Avatar} from '@mui/material';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import {RepositoryModel} from "@/models/repository.model";

interface RepositoryCardProps {
    name: string;
    language: string;
    description: string;
    forks_count: number;
    forks: Pick<RepositoryModel.RepoOwner, 'login' | 'avatar_url'>[];
    fileTypes: string[];
}
const RepositoryCard: React.FC<RepositoryCardProps> = ({ name, language, description, forks_count, forks, fileTypes }) => {
    return (
        <Card className="shadow-md rounded-lg">
            <CardContent>
                <DriveFolderUploadIcon fontSize="large" />
                <Typography data-testid="repo-name" className="truncate" variant="h5">{name}</Typography>
                <Typography data-testid="repo-lang" variant="body2">Language: {language}</Typography>
                <Typography data-testid="repo-dec" className="line-clamp-3" variant="body2">{description}</Typography>
                <Typography data-testid="repo-forks-count" variant="body2">Forks: {forks_count}</Typography>
                <div data-testid="repo-fileTypes" className="mt-3">
                    {fileTypes && fileTypes.map((file, index) => (
                        <Chip className="m-1" key={index} label={file} />
                    ))}
                </div>
                <div data-testid="repo-forks" className="mt-3">
                    {forks && forks?.map((fork, index) => (
                        <Chip className="m-1" key={index} label={fork.login}
                            avatar={<Avatar alt="Natacha" src={fork.avatar_url} />}
                            variant="outlined"
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RepositoryCard;
