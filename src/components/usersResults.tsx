import {UserModel} from "@/models/user.model";
import React from "react";
import GithubUserCard from "@/components/githubUserCard";
import SkeletonCard from "@/components/skeletonCard";
import {userStore} from "@/store/users";
import ErrorComponent from "@/components/error";
import {observer} from "mobx-react-lite";

const usersResults: React.FC = observer(() => {
    return (
        <>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-3 md:gap-4 lg:gap-8">
                {userStore.usersList.map((user: UserModel.GithubUser, index) =>
                    <GithubUserCard
                        key={`${user.id}-${index}`}
                        name={user.login}
                        avatar={user.avatar_url} url={user.html_url}/>)}
                {userStore.loading && new Array(20).fill(0).map((_, index) => <SkeletonCard key={index}/>)}
            </div>
            {userStore.usersList.length === 0 && !userStore.loading && !userStore.error &&
                <div className="flex items-center justify-center mt-20">
                    <h2 className="text-3xl font-bold text-white">No results found</h2>
                </div>
            }
            {userStore.error && <ErrorComponent message="Error in fetching data"/>}
        </>

    );
})

export default usersResults;
