'use client';
import React, {useCallback, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {
    Container,
    Grid,
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
import ErrorComponent from "@/components/error";
import SkeletonResults from "@/components/skeletonResults";
import './page.scss'

const SearchForm: React.FC = observer(() => {
    const [searchType, setSearchType] = useState(SearchTypeConstants.users);
    const [searchQuery, setSearchQuery] = useState('');
    const searchLabel = searchType === SearchTypeConstants.repositories ? 'Search Repositories' : 'Search Users';
    const isInitialSearchState = useRef(true);
    const getStore = () => {
        if (searchType === SearchTypeConstants.users) {
            return userStore
        } else if (searchType === SearchTypeConstants.repositories) {
            return repositoryStore
        } else {
            throw new Error('Invalid search type')
        }
    }

    const handleScrollEnd = () => {
        getStore().search(searchQuery);
    };

    useInfiniteScroll(handleScrollEnd);

    const handleSearchTypeChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
        if(value === null) return;
        isInitialSearchState.current = true;
        setSearchType(value);
        setSearchQuery('');
        getStore().reset();
    };

    const handleSearchQueryChange = useCallback(customDebounce((value: string) => {
        getStore().search(value.toLowerCase());
    }, 500), [searchType]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        isInitialSearchState.current = false;
        getStore().reset();
        setSearchQuery(event.target.value);
        handleSearchQueryChange(event.target.value);
    };

    return (
        <Container>
            <Grid container spacing={6} className="mb-10">
                <Grid item xs={12}>
                    <div className="flex items-center justify-center mt-20">
                        <h1 data-testid="search-title" className="text-6xl font-bold text-black">Find Github users and repositories</h1>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col items-center justify-center gap-10">
                        <ToggleButtonGroup
                            color="primary"
                            value={searchType}
                            exclusive
                            onChange={handleSearchTypeChange}
                            aria-label="searchType"
                            className="ToggleButtonGroup"
                        >
                            <ToggleButton data-testid="user-button" className="ToggleButton" value={SearchTypeConstants.users}>Users</ToggleButton>
                            <ToggleButton data-testid="repo-button" className="ToggleButton" value={SearchTypeConstants.repositories}>Repositories</ToggleButton>
                        </ToggleButtonGroup>
                        <TextField
                            inputProps={{ "data-testid": "search-input" }}
                            className="TextField"
                            value={searchQuery}
                            color="primary"
                            name="search"
                            focused
                            variant="outlined"
                            type="text"
                            onChange={handleInputChange}
                            placeholder={searchLabel}
                        />
                    </form>
                </Grid>
                <Grid item xs={12}>
                    {!isInitialSearchState.current &&
                        <>
                            {searchType === SearchTypeConstants.users ?
                                <UsersResults><SkeletonResults size={30}/></UsersResults> :
                                <RepoResults><SkeletonResults size={30}/></RepoResults>}
                            {getStore().data.length === 0 && !getStore().loading && !getStore().error &&
                                <div className="flex items-center justify-center mt-20">
                                    <h2 className="text-3xl font-bold text-white">No results found</h2>
                                </div>
                            }
                            {getStore().error && <ErrorComponent message={getStore().error}/>}
                        </>}
                </Grid>
            </Grid>
        </Container>

    );
});

export default SearchForm;
