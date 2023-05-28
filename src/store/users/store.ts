import {UserModel} from "@/models/user.model";
import axiosInstance from "@/utils/axios.config";
import {ApiConstants} from "@/constants/api.constants";
import {makeAutoObservable, observable, runInAction} from "mobx";
import {Response} from "@/models/response.model";

class UsersSore {

    usersList: UserModel.GithubUser[] = [];
    totalItems = 0;
    loading = false;
    error = false;
    fetchedItemsCount = 0;
    page = 0;
    cache = observable.map();

    constructor() {
        makeAutoObservable(this)
    }


    getUsers(query: string, page = this.page) {
        this.error = false;
        this.loading = true;
        if(!query) return Promise.resolve();
        return axiosInstance.get<Response<Array<UserModel.GithubUser>>>(ApiConstants.users, {params: {q: query, page}})
            .then(response => response.data)
            .then(response => {
                runInAction(() => {
                    this.usersList = [...this.usersList, ...response.items]
                    this.totalItems = response.total_count;
                    this.fetchedItemsCount += response.items.length;
                    this.page = this.page + 1;
                })
            })
            .catch(() => {
                runInAction(() => {
                    this.error = true;
                    this.usersList = [];
                })
            })
            .finally(() => runInAction(() => this.loading = false))
    }


    reset() {
        this.loading = false;
        this.usersList = [];
        this.totalItems = 0;
        this.fetchedItemsCount = 0;
        this.error = false;
        this.page = 0;
    }
}

export default new UsersSore();
