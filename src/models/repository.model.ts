export namespace RepositoryModel {
    export interface IRepository {
        allow_forking: boolean;
        archive_url: string;
        archived: boolean;
        assignees_url: string;
        blobs_url: string;
        branches_url: string;
        clone_url: string;
        collaborators_url: string;
        comments_url: string;
        commits_url: string;
        compare_url: string;
        contents_url: string;
        contributors_url: string;
        created_at: string;
        default_branch: string;
        deployments_url: string;
        description: string;
        disabled: boolean;
        downloads_url: string;
        events_url: string;
        fork: boolean;
        forks: number;
        forks_count: number;
        forks_url: string;
        full_name: string;
        git_commits_url: string;
        git_refs_url: string;
        git_tags_url: string;
        git_url: string;
        has_discussions: boolean;
        has_downloads: boolean;
        has_issues: boolean;
        has_pages: boolean;
        has_projects: boolean;
        has_wiki: boolean;
        homepage: string;
        hooks_url: string;
        html_url: string;
        id: number;
        is_template: boolean;
        issue_comment_url: string;
        issue_events_url: string;
        issues_url: string;
        keys_url: string;
        labels_url: string;
        language: string;
        languages_url: string;
        license: License
        merges_url: string;
        milestones_url: string;
        mirror_url: null;
        name: string;
        node_id: string;
        notifications_url: string;
        open_issues: number;
        open_issues_count: number;
        owner: RepoOwner;
        permissions: Permissions
        private: boolean;
        pulls_url: string;
        pushed_at: string;
        releases_url: string;
        score: number;
        size: number;
        ssh_url: string;
        stargazers_count: number;
        stargazers_url: string;
        statuses_url: string;
        subscribers_url: string;
        subscription_url: string;
        svn_url: string;
        tags_url: string;
        teams_url: string;
        topics: string[];
        trees_url: string;
        updated_at: string;
        url: string;
        visibility: string;
        watchers: number;
        watchers_count: number;
        web_commit_signoff_required: boolean;
    }

    export interface Fork {
        id: number;
        node_id: string;
        name: string;
        full_name: string;
        owner: RepoOwner
        private: boolean;
        html_url: string;
        description: string;
        fork: boolean;
        url: string;
        archive_url: string;
        assignees_url: string;
        blobs_url: string;
        branches_url: string;
        collaborators_url: string;
        comments_url: string;
        commits_url: string;
        compare_url: string;
        contents_url: string;
        contributors_url: string;
        deployments_url: string;
        downloads_url: string;
        events_url: string;
        forks_url: string;
        git_commits_url: string;
        git_refs_url: string;
        git_tags_url: string;
        git_url: string;
        issue_comment_url: string;
        issue_events_url: string;
        issues_url: string;
        keys_url: string;
        labels_url: string;
        languages_url: string;
        merges_url: string;
        milestones_url: string;
        notifications_url: string;
        pulls_url: string;
        releases_url: string;
        ssh_url: string;
        stargazers_url: string;
        statuses_url: string;
        subscribers_url: string;
        subscription_url: string;
        tags_url: string;
        teams_url: string;
        trees_url: string;
        clone_url: string;
        mirror_url: string;
        hooks_url: string;
        svn_url: string;
        homepage: string;
        language: string | null;
        forks_count: number;
        stargazers_count: number;
        watchers_count: number;
        size: number;
        default_branch: string;
        open_issues_count: number;
        is_template: boolean;
        topics: string[];
        has_issues: boolean;
        has_projects: boolean;
        has_wiki: boolean;
        has_pages: boolean;
        has_downloads: boolean;
        archived: boolean;
        disabled: boolean;
        visibility: string;
        pushed_at: string;
        created_at: string;
        updated_at: string;
        permissions: Permissions
        temp_clone_token: string;
        delete_branch_on_merge: boolean;
        subscribers_count: number;
        network_count: number;
        license: License
    }


    export interface RepoOwner {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
    }

    interface License {
        key: string;
        name: string;
        spdx_id: string;
        url: string;
        node_id: string;
    }

    interface Permissions {
        admin: boolean;
        maintain: boolean;
        push: boolean;
        triage: boolean;
        pull: boolean;
    }

    export interface RepoFile {
        download_url: string;
        git_url: string
        html_url: string;
        name: string;
        path: string;
        sha: string;
        size: number;
        type: string;
        url: string;
    }

    export class Repository implements Pick<IRepository, 'name' | 'description' | 'language' | 'forks_count' | 'id' | 'size'> {
        id: number;
        name: string;
        description: string;
        language: string;
        forks_count: number;
        git_url: string;
        owner: Pick<RepoOwner, | 'login'>;
        size: number;

        constructor(repo: IRepository) {
            this.id = repo.id;
            this.name = repo.name;
            this.description = repo.description;
            this.language = repo.language;
            this.forks_count = repo.forks_count;
            this.git_url = repo.git_url;
            this.owner = {login: repo.owner.login};
            this.size = repo.size;
        }
    }

}
