import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import SearchForm from "../src/app/search/page";
import {userStore} from "../src/store/users";
import '@testing-library/jest-dom';

jest.mock('localforage', () => {
    const mockLocalForage = {
        createInstance: jest.fn(() => mockLocalForage),
        getItem: jest.fn(),
        setItem: jest.fn(),
    };

    return mockLocalForage;
});

jest.mock('../src/store/users', () => ({
    userStore: {
        search: jest.fn(),
        reset: jest.fn(),
        data: [],
        loading: false,
        error: false,
    }
}));

jest.mock('../src/store/repositories', () => ({
    repositoryStore: {
        search: jest.fn(),
        reset: jest.fn(),
        data: [],
        loading: false,
        error: false,
    },
}));

describe('SearchForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the SearchForm component', () => {
        // Arrange
        render(<SearchForm/>);
        // Assert
        expect(screen.getByTestId('search-title')).toBeInTheDocument();
    });

    it('should toggle search type when a button is clicked', () => {
        // Arrange
        render(<SearchForm/>);

        // Act
        const repositoriesButton = screen.getByTestId('repo-button');
        fireEvent.click(repositoriesButton);

        // Assert
        expect(repositoriesButton).toHaveClass('Mui-selected');
    });

    it('should call the search function when the form is submitted', async () => {
        // Arrange
        render(<SearchForm/>);

        // Act
        const searchInput = screen.getByTestId('search-input');
        fireEvent.input(searchInput, {target: {value: 'test'}});

        // Assert
        await waitFor(() => {
            expect(userStore.search).toHaveBeenCalledWith('test')
        }, 1000)
    });

    it('should reset the store when the search type is changed', async () => {
        // Arrange
        render(<SearchForm/>);

        // Act
        const repositoriesButton = screen.getByTestId('repo-button');
        fireEvent.click(repositoriesButton);

        // Assert
        expect(userStore.reset).toBeCalled()
    });

    test('should have no items in the result component if the data is empty', async () => {
        // Arrange
        render(<SearchForm/>);

        // Act
        const searchInput = screen.getByTestId('search-input');
        fireEvent.input(searchInput, {target: {value: 'test2'}});
        const userResults = screen.queryAllByTestId('user-result');
        const actual = userResults.length;

        // Assert
        await waitFor(() => {
            expect(userStore.search).toHaveBeenCalledWith('test2');
            expect(actual).toEqual(0);
        }, {timeout: 1000});
    });
});
