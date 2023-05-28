export namespace ApiConstants {
    export const users = '/search/users'
    export const repositories = '/search/repositories'
    export const forks = (owner: string, repoName: string) => `/repos/${owner}/${repoName}/forks?per_page=3&sort=newest`;
    export const fileType = (owner: string, repoName: string) => `/repos/${owner}/${repoName}/contents`;

}
