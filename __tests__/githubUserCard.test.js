import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import GithubUserCard from "../src/components/githubUserCard";

describe('GithubUserCard', () => {
    const mockProps = {
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
        url: 'https://github.com/johndoe',
    };

    test('renders the name and avatar', () => {
        render(<GithubUserCard {...mockProps}/>);

        const nameElement = screen.getByTestId('user-name')
        expect(nameElement).toBeInTheDocument();

        const avatarElement = screen.getByAltText(mockProps.name);
        expect(avatarElement).toBeInTheDocument();
        expect(avatarElement).toHaveAttribute('src', mockProps.avatar);
    });

    test('renders the "Go to Profile" button with the correct URL', () => {
        render(<GithubUserCard {...mockProps} />);

        const buttonElement = screen.getByTestId('profile-button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveAttribute('href', mockProps.url);
    });
});
