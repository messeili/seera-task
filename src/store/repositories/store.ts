import axiosInstance from "@/utils/axios.config";
import {makeAutoObservable, ObservableMap, runInAction} from 'mobx';
import {Response} from "@/models/response.model";
import {RepositoryModel} from "@/models/repository.model";
import {ApiConstants} from "@/constants/api.constants";
import {ISearchLabel} from "@/store/search.interface";
import * as localForage from "localforage";

class RepositoryStore implements ISearchLabel<RepositoryModel.Repository[]> {

    data: RepositoryModel.Repository[] = [];
    totalItems = 0;
    isAtEnd = false;
    loading = false;
    error = false;
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
        this.error = false;
        this.loading = true;
        if (this.isAtEnd) return
        if (!searchTerm) {
            runInAction(() => {
                this.reset(false);
            })
        } else {
            const cacheKey = `search:${searchTerm}:page:${page}`;
            const cachedReps = await this.cache.getItem<string>(cacheKey);
            if (cachedReps) {
                runInAction(() => {
                    const data: RepositoryModel.Repository[] = JSON.parse(cachedReps);
                    this.data = [...this.data, ...data]
                    this.loading = false;
                    this.page = this.page + 1;
                    data.forEach((repo) => {
                        this.getRepositoryForks(repo.owner.login, repo.name, repo.git_url);
                        this.getRepositoryFileType(repo.owner.login, repo.name, repo.git_url);
                    });
                });
                return;
            }
            axiosInstance.get<Response<Array<RepositoryModel.Repository>>>(ApiConstants.repositories, {params: {
                q: searchTerm,
                    page
                }
            })
                .then(response => response.data)
                .then(response => {
                    runInAction(() => {
                        this.data = [...this.data, ...response.items]
                        this.totalItems = response.total_count;
                        this.isAtEnd = response.items.length > 30;
                        this.page = this.page + 1;
                    });
                    // Call getRepositoryForks for each repository
                    response.items.forEach((repo, index) => {
                        this.getRepositoryForks(repo.owner.login, repo.name, repo.git_url);
                        this.getRepositoryFileType(repo.owner.login, repo.name, repo.git_url);
                    });
                    this.cache.setItem<string>(cacheKey, JSON.stringify(response.items));
                })

                .catch(() => {
                    this.error = true;
                    this.data = [];
                })
                .finally(() => runInAction(() => this.loading = false))
        }
    }

    async getRepositoryForks(owner: string, repoName: string, git_url: string) {
        const cachedData = await this.forksCache.getItem<string>(`${git_url}`);
        if (cachedData) {
            runInAction(() => {
                this.forksMap.set(`${git_url}`, JSON.parse(cachedData));
            });
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
            .catch(() => {
                runInAction(() => {
                    this.error = true;
                });
            })
            .finally(() => runInAction(() => this.loading = false));
    }

    async getRepositoryFileType(owner: string, repoName: string,  git_url: string) {
        const cachedData = await this.fileTypeCache.getItem<string>(`${git_url}`);
        if (cachedData) {
            runInAction(() => {
                this.fileTypeMap.set(`${git_url}`, JSON.parse(cachedData));
            });
            return;
        }
        axiosInstance.get(ApiConstants.fileType(owner, repoName))
            .then(response => response.data)
            .then(response => response.filter(file => file.type === 'file'))
            .then(files => files.map(file => this.getFileType(file.name)))
            .then(files => {
                runInAction(() => {
                    this.fileTypeCache.setItem<string>(`${git_url}`, JSON.stringify(files));
                    this.fileTypeMap.set(`${git_url}`, files);
                });
            })
            .catch(() => {
                runInAction(() => {
                    this.error = true;
                });
            })
            .finally(() => runInAction(() => this.loading = false));
    }


    getFileType(filename: string) {
        const parts = filename.split('.');
        if (parts.length > 1) {
            return parts[parts.length - 1];
        }
        return '';
    }

    reset(loading = true) {
        this.loading = loading;
        this.data = [];
        this.totalItems = 0;
        this.isAtEnd = false;
        this.error = false;
        this.page = 0;
    }

}

export default new RepositoryStore();
