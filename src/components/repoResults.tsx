import {RepositoryModel} from "@/models/repository.model";
import React from "react";
import RepositoryCard from "@/components/repositoryCard";
import SkeletonCard from "@/components/skeletonCard";
import {repositoryStore} from "@/store/repositories";
import ErrorComponent from "@/components/error";
import {observer} from "mobx-react-lite";

const RepoResults: React.FC = observer(() => {

    return (
        <>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-3 md:gap-4 lg:gap-8">
                {repositoryStore.repositoriesList.map((repo: RepositoryModel.Repository, index) =>
                    <RepositoryCard
                        key={`${repo.id}-${index}`}
                        name={repo.name}
                        language={repo.language}
                        forks_count={repo.forks_count}
                        topics={repo.topics}
                        description={repo.description}/>)}
                {repositoryStore.loading && new Array(20).fill(0).map((_, index) => <SkeletonCard key={index}/>)}
            </div>
            {repositoryStore.repositoriesList.length === 0 && !repositoryStore.loading && !repositoryStore.error &&
                <div className="flex items-center justify-center mt-20">
                    <h2 className="text-3xl font-bold text-white">No results found</h2>
                </div>
            }
            {repositoryStore.error && <ErrorComponent message="Error in fetching data"/>}
        </>

    );
});

export default RepoResults;
