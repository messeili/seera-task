export namespace UserModel {
    export interface IGithubUser {
        avatar_url: string;
        events_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        gravatar_id: string;
        html_url: string;
        id: number;
        login: string;
        node_id: string;
        organizations_url: string;
        received_events_url: string;
        repos_url: string;
        score: number;
        site_admin: boolean;
        starred_url: string;
        subscriptions_url: string;
        type: string;
        url: string;
    }

    export class GithubUser implements Pick<IGithubUser, 'avatar_url' | 'login' | 'html_url'> {
        id: number;
        avatar_url: string;
        login: string;
        html_url: string;

        constructor(user: IGithubUser) {
            this.id = user.id;
            this.avatar_url = user.avatar_url;
            this.login = user.login;
            this.html_url = user.html_url;
        }
    }
}
