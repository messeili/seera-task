import React from 'react';
import {Card, Skeleton} from '@mui/material';

const SkeletonCard: React.FC = () => {
    return (
        <Card className="p-10">
            <Skeleton variant="circular" width={50} height={50}/>
            <Skeleton variant="text" sx={{fontSize: '2rem'}}/>
            <Skeleton variant="text" sx={{fontSize: '2rem'}}/>
        </Card>
    );
};

export default SkeletonCard;
