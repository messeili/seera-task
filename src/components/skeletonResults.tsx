import React from 'react';
import SkeletonCard from "@/components/skeletonCard";

interface SkeletonResultsProps {
    size: number;
}

const SkeletonResults: React.FC<SkeletonResultsProps> = ({size}) => {
    return (
        <>
            {new Array(size).fill(0).map((_, index) => <SkeletonCard key={index}/>)}
        </>
    );
};

export default SkeletonResults;
