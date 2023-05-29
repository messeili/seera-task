import axiosInstance from "@/utils/axios.config";
import {makeAutoObservable, ObservableMap, runInAction} from 'mobx';
import {Response} from "@/models/response.model";
import {RepositoryModel} from "@/models/repository.model";
import {ApiConstants} from "@/constants/api.constants";
import {ISearchLabel} from "@/store/search.interface";
import * as localForage from "localforage";
import {AxiosError} from "axios";

class RepositoryStore implements ISearchLabel<RepositoryModel.IRepository[]> {

    data: RepositoryModel.IRepository[] = [];
    totalItems = 0;
    isAtEnd = false;
    loading = false;
    error = '';
    page = 0;
    cache = localForage.createInstance({
        name: 'repositoryCache'
    });
    forksCache = localForage.createInstance({
        name: 'repositoryForksCache'
    });
    forksMap = new ObservableMap(); // key: github_url, value: forks

    fileTypeCache = localForage.createInstance({
        name: 'fileTypeCache'
    });
    fileTypeMap = new ObservableMap(); // key: github_url, value: fileType

    constructor() {
        makeAutoObservable(this)
    }

    async search(searchTerm: string, page = this.page) {
        if (this.isAtEnd) return
        this.error = '';
        this.loading = true;
        if (!searchTerm) {
            runInAction(() => this.reset(false))
            return
        }
        const cacheKey = `search:${searchTerm}:page:${page}`;
        const cachedReps = await this.cache.getItem<string>(cacheKey);
        if (cachedReps) {
            runInAction(() => {
                const data: RepositoryModel.IRepository[] = JSON.parse(cachedReps);
                this.data = [...this.data, ...data]
                this.loading = false;
                this.isAtEnd = this.data.length >= this.totalItems || data.length < 30;
                this.page = this.page + 1;
                data.forEach((repo) => {
                    this.getRepositoryForks(repo.owner.login, repo.name, repo.git_url, repo.forks_count);
                    this.getRepositoryFileType(repo.owner.login, repo.name, repo.git_url, repo.size);
                });
            });
            return;
        }
        axiosInstance.get<Response<Array<RepositoryModel.IRepository>>>(ApiConstants.repositories, {
            params: {
                q: searchTerm,
                page
            }
        })
            .then(response => response.data)
            .then(({items, total_count}) => {
                // create new repository models to minimize the data we store in cache
                const repositories = items.map((item) =>
                    new RepositoryModel.Repository(item)) as RepositoryModel.IRepository[];
                runInAction(() => {
                    this.data = [...this.data, ...repositories]
                    this.totalItems = total_count;
                    this.isAtEnd = this.data.length >= total_count || items.length < 30;
                    this.page = this.page + 1;
                });
                // get forks and file types for each repository
                items.forEach((repo) => {
                    this.getRepositoryForks(repo.owner.login, repo.name, repo.git_url, repo.forks_count);
                    this.getRepositoryFileType(repo.owner.login, repo.name, repo.git_url, repo.size);
                });
                this.cache.setItem<string>(cacheKey, JSON.stringify(repositories));
            })

            .catch((e) => this.handleErrors(e))
            .finally(() => runInAction(() => this.loading = false));
    }

    async getRepositoryForks(owner: string, repoName: string, git_url: string, forks_count: number) {
        // check if the repo has any forks before making the request
        if (forks_count === 0) {
            await this.forksCache.setItem<string>(`${git_url}`, JSON.stringify([]));
        }
        const cachedData = await this.forksCache.getItem<string>(`${git_url}`);
        if (cachedData) {
            runInAction(() => this.forksMap.set(`${git_url}`, JSON.parse(cachedData)));
            return;
        }
        axiosInstance.get<Array<RepositoryModel.Fork>>(ApiConstants.forks(owner, repoName))
            .then(response => response.data)
            .then(response => response.map(fork => ({login: fork.owner.login, avatar_url: fork.owner.avatar_url})))
            .then(forks => {
                runInAction(() => {
                    this.forksCache.setItem<string>(`${git_url}`, JSON.stringify(forks));
                    this.forksMap.set(`${git_url}`, forks);
                });
            })
            .catch((e) => this.handleErrors(e))
            .finally(() => runInAction(() => this.loading = false));
    }

    async getRepositoryFileType(owner: string, repoName: string, git_url: string, repoSize: number) {
        // check if the repo has any files before making the request
        if (repoSize === 0) {
            await this.fileTypeCache.setItem<string>(`${git_url}`, JSON.stringify([]))
        }
        const cachedData = await this.fileTypeCache.getItem<string>(`${git_url}`);
        if (cachedData) {
            runInAction(() => this.fileTypeMap.set(`${git_url}`, JSON.parse(cachedData)));
            return;
        }
        axiosInstance.get<Array<RepositoryModel.RepoFile>>(ApiConstants.fileType(owner, repoName))
            .then(response => response.data)
            .then(response => response.filter(file => file.type === 'file'))
            .then(files => files.map(file => this.getFileType(file.name)))
            .then(files => [...new Set(files.filter(Boolean))])
            .then(files => {
                runInAction(() => {
                    this.fileTypeCache.setItem<string>(`${git_url}`, JSON.stringify(files));
                    this.fileTypeMap.set(`${git_url}`, files);
                });
            })
            .catch((e) => {
                this.handleErrors(e);
                this.handleRepoIsEmpty(e, git_url);
            })
            .finally(() => runInAction(() => this.loading = false));
    }

    handleErrors(e: AxiosError<any>) {
        switch (e.response?.status) {
            case 403:
                this.error = e.response?.data.message;
                break;
            case 404:
                break;
            default:
                this.error = e.response?.data.message;
        }
    }

    handleRepoIsEmpty(e: AxiosError<any>, git_url: string) {
        if (e.response?.status === 404) {
            this.fileTypeCache.setItem<string>(`${git_url}`, JSON.stringify([]));
            this.fileTypeMap.set(`${git_url}`, []);
        }
    }


    getFileType(filename: string) {
        const parts = filename.split('.');
        if (parts.length > 1 && parts[0] !== '' && parts.at(-1) !== '') {
            return parts.at(-1);
        }
        return '';
    }

    reset(loading = true) {
        this.loading = loading;
        this.data = [];
        this.totalItems = 0;
        this.isAtEnd = false;
        this.error = '';
        this.page = 0;
    }

}

export default new RepositoryStore();
