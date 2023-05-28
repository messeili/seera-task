import {UserModel} from "@/models/user.model";
import React from "react";
import GithubUserCard from "@/components/githubUserCard";
import {userStore} from "@/store/users";
import {observer} from "mobx-react-lite";

interface UsersResultsProps {
    children: React.ReactNode;
}

const usersResults: React.FC<UsersResultsProps> = observer(({children}: { children: React.ReactNode }) => {
    return (
        <>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-3 md:gap-4 lg:gap-8">
                {!userStore.error && userStore.data.map((user: UserModel.GithubUser, index) =>
                    <GithubUserCard
                        key={`${user.id}-${index}`}
                        name={user.login}
                        avatar={user.avatar_url} url={user.html_url}/>)}
                {userStore.loading && children}
            </div>
        </>

    );
})

export default usersResults;
