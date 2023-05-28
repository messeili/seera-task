import {UserModel} from "@/models/user.model";
import axiosInstance from "@/utils/axios.config";
import {ApiConstants} from "@/constants/api.constants";
import {makeAutoObservable, observable, runInAction} from "mobx";
import {Response} from "@/models/response.model";
import {ISearchLabel} from "@/store/search.interface";

class UsersSore implements ISearchLabel<UserModel.GithubUser[]> {

    data: UserModel.GithubUser[] = [];
    totalItems = 0;
    loading = false;
    error = false;
    isAtEnd = false
    page = 0;
    cache = observable.map();

    constructor() {
        makeAutoObservable(this)
    }


    search(searchTerm: string, page = this.page) {
        this.error = false;
        this.loading = true;
        if(this.isAtEnd) return
        if (!searchTerm) {
            runInAction(() => {
                this.data = [];
            })
        } else {
            axiosInstance.get<Response<Array<UserModel.GithubUser>>>(ApiConstants.users, {params: {q: searchTerm, page}})
                .then(response => response.data)
                .then(response => {
                    runInAction(() => {
                        this.data = [...this.data, ...response.items]
                        this.totalItems = response.total_count;
                        this.isAtEnd = response.items.length < 30;
                        this.page = this.page + 1;
                    })
                })
                .catch(() => {
                    runInAction(() => {
                        this.error = true;
                    })
                })
                .finally(() => runInAction(() => this.loading = false))
        }
    }


    reset() {
        this.loading = true;
        this.totalItems = 0;
        this.isAtEnd = false;
        this.error = false;
        this.page = 0;
        this.data = []
    }
}

export default new UsersSore();
