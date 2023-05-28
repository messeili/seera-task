'use client';
import React, {useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {
    Container,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import {customDebounce} from "@/utils/debounce";
import useInfiniteScroll from "@/hooks/useInfiniteScroll.hook";
import {SearchTypeConstants} from "@/constants/searchType.constants";
import UsersResults from "@/components/usersResults";
import RepoResults from "@/components/repoResults";
import {userStore} from "@/store/users";
import {repositoryStore} from "@/store/repositories";

const SearchForm: React.FC = observer(() => {
    const [searchType, setSearchType] = useState(SearchTypeConstants.users);
    const [searchQuery, setSearchQuery] = useState('');
    const searchLabel = searchType === SearchTypeConstants.repositories ? 'Search Repositories' : 'Search Users';
    const isInitialSearchState = useRef(true);

    const handleScrollEnd = () => {
        if (searchType === SearchTypeConstants.users) {
            userStore.getUsers(searchQuery);
        } else if (searchType === SearchTypeConstants.repositories) {
            repositoryStore.getRepositories(searchQuery);
        }
    };

    useInfiniteScroll(handleScrollEnd);

    const handleSearchTypeChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
        isInitialSearchState.current = true;
        setSearchType(value);
        setSearchQuery('');
        if (searchType === SearchTypeConstants.users) {
            userStore.reset();
        } else if (searchType === SearchTypeConstants.repositories) {
            repositoryStore.reset();
        }
    };

    const handleSearchQueryChange = customDebounce((value: string) => {
        if (searchType === SearchTypeConstants.users) {
            userStore.getUsers(value);
        } else if (searchType === SearchTypeConstants.repositories) {
            repositoryStore.getRepositories(value);
        }
    }, 500);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        isInitialSearchState.current = false;
        if (searchType === SearchTypeConstants.users) {
            userStore.reset();
        } else if (searchType === SearchTypeConstants.repositories) {
            repositoryStore.reset();
        }
        setSearchQuery(event.target.value);
        handleSearchQueryChange(event.target.value);
    };

    return (
        <Container className="flex flex-col gap-20">
            <div className="flex items-center justify-center mt-20">
                <h1 className="text-6xl font-bold text-black">Find Github users and repositories</h1>
            </div>
            <form className="flex flex-col items-center justify-center gap-10">
                <ToggleButtonGroup
                    color="primary"
                    value={searchType}
                    exclusive
                    onChange={handleSearchTypeChange}
                    aria-label="searchType"
                >
                    <ToggleButton value={SearchTypeConstants.users}>Users</ToggleButton>
                    <ToggleButton value={SearchTypeConstants.repositories}>Repositories</ToggleButton>
                </ToggleButtonGroup>
                <TextField
                    value={searchQuery}
                    color="primary"
                    focused
                    variant="outlined"
                    className="w-full"
                    type="text"
                    onChange={handleInputChange}
                    placeholder={searchLabel}
                />
            </form>
            {!isInitialSearchState.current &&
                <>
                    {searchType === SearchTypeConstants.users ? <UsersResults/> : <RepoResults/>}
                </>}

        </Container>
    );
});

export default SearchForm;
