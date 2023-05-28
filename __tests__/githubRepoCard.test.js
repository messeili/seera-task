import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import RepositoryCard from "../src/components/repositoryCard";

    const mockProps = {
        name: 'example-repo',
        language: 'JavaScript',
        description: 'Example repository description',
        forks_count: 10,
        topics: ['topic1', 'topic2', 'topic3', 'topic4', 'topic5'],
    };
describe('RepositoryCard', () => {
    test('renders the repository name', () => {
        // Arrange
        render(<RepositoryCard {...mockProps} />);
        // Act
        const nameElement = screen.getByTestId('repo-name');
        // Assert
        expect(nameElement).toBeInTheDocument();
    });

    test('renders the repository language', () => {
        // Arrange
        render(<RepositoryCard {...mockProps} />);
        // Act
        const languageElement = screen.getByTestId('repo-lang');
        // Assert
        expect(languageElement).toBeInTheDocument();
    });

    test('renders the repository description', () => {
        // Arrange
        render(<RepositoryCard {...mockProps} />);
        // Act
        const descriptionElement = screen.getByTestId('repo-dec');
        // Assert
        expect(descriptionElement).toBeInTheDocument();
    });

    test('renders the repository forks count', () => {
        // Arrange
        render(<RepositoryCard {...mockProps} />);
        // Act
        const forksElement = screen.getByTestId('repo-forks-count');
        // Assert
        expect(forksElement).toBeInTheDocument();
    });

    test('renders up to three topics', () => {
        // Arrange
        render(<RepositoryCard {...mockProps} />);
        // Act
        const topics = screen.getByTestId('repo-topics').children;
        // Assert
        expect(topics).toHaveLength(4);
    });
});
