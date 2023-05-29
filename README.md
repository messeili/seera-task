<p align="center">
  <img src="public/gifs/search-1.gif">
</p>

[Deployed version](https://seera-task.vercel.app/)

[Detailed demo with steps](https://app.supademo.com/demo/hapaw3tYXqRMRrzlDiDmn)

## Find GitHub users and repositories
The app utilizes the GitHub API to enable searching for GitHub users and repositories, presenting the results in a list. It is built on Next.js and incorporates the following technologies:
-  **Next.js 13 & React 18**
-  **Tailwind CSS 3** - A utility-first CSS framework
-  **ESLint** — Pluggable JavaScript linter
-  **Prettier** - Opinionated Code Formatter
-  **Mobx** - State management
-  **Material ui** - React components for faster and easier web development
-  **localForge** - IndexedDB wrapper with a simple API for caching data

## 🚀 Getting started
To the run the project, you need to have [Node](https://nodejs.org/en/) and npm or [Yarn](https://yarnpkg.com/) installed.
Then you need to create a `.env.local` file in the root of the project and add the following environment variables:
```agsl
NEXT_PUBLIC_GITHUB_API_URL=https://api.github.com  # GitHub API URL
NEXT_PUBLIC_GITHUB_API_KEY=your_client_id          # GitHub Apikey for authentication
```
To install the dependencies and run the project, clone the project and run the following commands:

```
npm install
npm run dev
 # or
yarn install
yarn dev
 ```

To run the tests, run the following commands:
```
npm run test
 # or
yarn test
```


To view the project open `http://localhost:3000`


## Responsive design
<p align="center">
  <img src="public/gifs/search-2.gif">
</p>

## How Search enhanced to handle large data and caching
- The search results are cached in the browser using localForge, which is an IndexedDB wrapper with a simple API for caching data.
- The search results are paginated, and the pagination is handled by the GitHub API.
- The search input is debounced to avoid making unnecessary requests to the GitHub API.
- The search query is lowercased to avoid making unnecessary requests to the GitHub API.
- We check the repo size and the number if forks to avoid making unnecessary requests to the GitHub API.
- Only cache the properties that are needed to display the results, that helps to reduce the size of the cache.
- stop calling the api when the user reaches the last page, also stop the infinite scrolling.


## Unit tests and code coverage
- Test Case Count: more than 14 test cases
- Test Success Rate: 100% success rate
- Test Execution Time: 5.001 s
- Test Failure Rate: 0% failure rate
- Test Maintenance Effort: Utilizing the data-testid provided by react testing library will prevent the tests from breaking when the UI changes


## Future improvements
- Add more unit tests
- Allow offline search by utilizing the cache data in the IndexedDB
- implement virtual scrolling to handle large data with the help of [TanStack/react-virtualized](https://tanstack.com/virtual/v3/docs/guide/introduction)
- implement TTL for the cache data to avoid caching outdated data for a long time
- implement a cache invalidation strategy to avoid caching outdated data
- implement infinite scrolling to load more data when the user reaches the end of the page with the help of [TanStack/react-infinite](https://tanstack.com/virtual/v3/docs/examples/react/infinite-scroll)







