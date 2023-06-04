import axiosInstance from "@/utils/axios.config";
import {makeAutoObservable, ObservableMap, runInAction} from 'mobx';
import {Response} from "@/models/response.model";
import {RepositoryModel} from "@/models/repository.model";
import {ApiConstants} from "@/constants/api.constants";
import {ISearchLabel} from "@/store/search.interface";
import * as localForage from "localforage";
import {AxiosError} from "axios";

class RepositoryStore implements ISearchLabel<RepositoryModel.Repository[]> {

    data: RepositoryModel.Repository[] = [];
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
                const data: RepositoryModel.Repository[] = JSON.parse(cachedReps);
                this.data = [...this.data, ...data]
                this.loading = false;
                this.isAtEnd = this.data.length >= this.totalItems && data.length < 30;
                console.log(this.data.length, this.totalItems, data.length, this.isAtEnd)
                this.page = this.page + 1
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
            .then( async ({items, total_count}) => {
                // get forks and file types for each repository
                const promises = items.map(async (repo) => {
                    const [forks, fileTypes] = await Promise.all([
                        this.getRepositoryForks(repo.owner.login, repo.name, repo.git_url, repo.forks_count),
                        this.getRepositoryFileType(repo.owner.login, repo.name, repo.git_url, repo.size)
                    ]);

                    return new RepositoryModel.Repository( {
                        ...repo,
                        forks,
                        fileTypes
                    } )
                });
                const repositories = await Promise.all(promises);
                runInAction(() => {
                    this.data = [...this.data, ...repositories]
                    this.totalItems = total_count;
                    this.isAtEnd = this.data.length >= total_count || items.length < 30;
                    this.page = this.page + 1;
                });
                await this.cache.setItem<string>(cacheKey, JSON.stringify(repositories));
            })

            .catch((e) => this.handleErrors(e))
            .finally(() => runInAction(() => this.loading = false));
    }

    async getRepositoryForks(owner: string, repoName: string, git_url: string, forks_count: number): Promise<any> {
        // check if the repo has any forks before making the request
        if (forks_count === 0) {
            return Promise.resolve([]);
        }
        return axiosInstance.get<Array<RepositoryModel.Fork>>(ApiConstants.forks(owner, repoName))
            .then(response => response.data)
            .then(response => response.map(fork => ({login: fork.owner.login, avatar_url: fork.owner.avatar_url})))
            .catch((e) => {
                this.handleErrors(e)
                return this.handleRepoIsEmpty(e);
            })
    }

    async getRepositoryFileType(owner: string, repoName: string, git_url: string, repoSize: number) {
        // check if the repo has any files before making the request
        if (repoSize === 0) {
            return Promise.resolve([]);
        }
        return axiosInstance.get<Array<RepositoryModel.RepoFile>>(ApiConstants.fileType(owner, repoName))
            .then(response => response.data)
            .then(response => response.filter(file => file.type === 'file'))
            .then(files => files.map(file => this.getFileType(file.name)))
            .then(files => [...new Set(files.filter(Boolean))])
            .catch((e) => {
                this.handleErrors(e);
                return this.handleRepoIsEmpty(e);
            })
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

    handleRepoIsEmpty(e: AxiosError<any>): Promise<any> {
        return Promise.resolve([]);
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
