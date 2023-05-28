import {UserModel} from "@/models/user.model";
import axiosInstance from "@/utils/axios.config";
import {ApiConstants} from "@/constants/api.constants";
import {makeAutoObservable, runInAction} from "mobx";
import {Response} from "@/models/response.model";
import {ISearchLabel} from "@/store/search.interface";
import localForage from "localforage";

class UsersSore implements ISearchLabel<UserModel.GithubUser[]> {

    data: UserModel.GithubUser[] = [];
    totalItems = 0;
    loading = false;
    error = false;
    isAtEnd = false
    page = 0;
    cache = localForage.createInstance({
        name: 'usersCache'
    });

    constructor() {
        makeAutoObservable(this)
    }


    async search(searchTerm: string, page = this.page) {
        this.error = false;
        this.loading = true;
        if (this.isAtEnd) return
        if (!searchTerm) {
            runInAction(() => this.reset(false))
            return
        }
        const cacheKey = `search:${searchTerm}:page:${page}`;
        const cachedUsers = await this.cache.getItem<string>(cacheKey);
        if (cachedUsers) {
            runInAction(() => {
                const data: UserModel.IGithubUser[] = JSON.parse(cachedUsers);
                this.data = [...this.data, ...data]
                this.loading = false;
                this.page = this.page + 1;
            });
            return;
        }
        axiosInstance.get<Response<Array<UserModel.IGithubUser>>>(ApiConstants.users, {
            params: {
                q: searchTerm,
                page
            }
        })
            .then(response => response.data)
            .then(({items, total_count}) => {
                runInAction(() => {
                    // create new user models to minimize the data we store in cache
                    const users = items.map((item) => new UserModel.GithubUser(item));
                    this.data = [...this.data, ...users]
                    this.totalItems = total_count;
                    this.isAtEnd = items.length < 30;
                    this.page = this.page + 1;
                    this.cache.setItem(cacheKey, JSON.stringify(users));
                })
            })
            .catch(() => runInAction(() => this.error = true))
            .finally(() => runInAction(() => this.loading = false))
    }


    reset(loading = true) {
        this.loading = loading;
        this.totalItems = 0;
        this.isAtEnd = false;
        this.error = false;
        this.page = 0;
        this.data = []
    }
}

export default new UsersSore();
