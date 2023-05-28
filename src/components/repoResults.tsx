import {RepositoryModel} from "@/models/repository.model";
import React from "react";
import RepositoryCard from "@/components/repositoryCard";
import {repositoryStore} from "@/store/repositories";
import {observer} from "mobx-react-lite";

interface RepoResultsProps {
    children: React.ReactNode;
}

const RepoResults: React.FC<RepoResultsProps> = observer(({children}: { children: React.ReactNode }) => {

    return (
        <>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-3 md:gap-4 lg:gap-8">
                {repositoryStore.data.map((repo: RepositoryModel.Repository, index) =>
                    <RepositoryCard
                        key={`${repo.id}-${index}`}
                        name={repo.name}
                        language={repo.language}
                        forks_count={repo.forks_count}
                        topics={repo.topics}
                        description={repo.description}/>)}
                {children}
            </div>
        </>

    );
});

export default RepoResults;
