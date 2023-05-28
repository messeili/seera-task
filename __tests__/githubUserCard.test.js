import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import GithubUserCard from "../src/components/githubUserCard";

const mockProps = {
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    url: 'https://github.com/johndoe',
};
describe('GithubUserCard', () => {
    test('renders the name', () => {
        // Arrange
        render(<GithubUserCard {...mockProps}/>);
        // Act
        const nameElement = screen.getByTestId('user-name')
        // Assert
        expect(nameElement).toBeInTheDocument();
    });

    test('renders the name and avatar', () => {
        // Arrange
        render(<GithubUserCard {...mockProps}/>);

        // Act
        const avatarElement = screen.getByAltText(mockProps.name);
        // Assert
        expect(avatarElement).toBeInTheDocument();
        expect(avatarElement).toHaveAttribute('src', mockProps.avatar);
    });

    test('renders the "Go to Profile" button with the correct URL', () => {
        // Arrange
        render(<GithubUserCard {...mockProps} />);
        // Act
        const buttonElement = screen.getByTestId('profile-button');
        // Assert
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveAttribute('href', mockProps.url);
    });
});
