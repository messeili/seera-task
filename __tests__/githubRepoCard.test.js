import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import RepositoryCard from "../src/components/repositoryCard";

describe('RepositoryCard', () => {
    const mockProps = {
        name: 'example-repo',
        language: 'JavaScript',
        description: 'Example repository description',
        forks_count: 10,
        topics: ['topic1', 'topic2', 'topic3', 'topic4', 'topic5'],
    };

    test('renders the repository name', () => {
        render(<RepositoryCard {...mockProps} />);

        const nameElement = screen.getByTestId('repo-name');
        expect(nameElement).toBeInTheDocument();
    });

    test('renders the repository language', () => {
        render(<RepositoryCard {...mockProps} />);

        const languageElement = screen.getByTestId('repo-lang');
        expect(languageElement).toBeInTheDocument();
    });

    test('renders the repository description', () => {
        render(<RepositoryCard {...mockProps} />);

        const descriptionElement = screen.getByTestId('repo-dec');
        expect(descriptionElement).toBeInTheDocument();
    });

    test('renders the repository forks count', () => {
        render(<RepositoryCard {...mockProps} />);

        const forksElement = screen.getByTestId('repo-forks-count');
        expect(forksElement).toBeInTheDocument();
    });

    test('renders up to three topics', () => {
        render(<RepositoryCard {...mockProps} />);

        const topics = screen.getByTestId('repo-topics').children;
        expect(topics).toHaveLength(4);
    });
});
