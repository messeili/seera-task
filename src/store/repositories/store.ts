import axiosInstance from "@/utils/axios.config";
import {makeAutoObservable, observable, runInAction} from 'mobx';
import {Response} from "@/models/response.model";
import {RepositoryModel} from "@/models/repository.model";
import {ApiConstants} from "@/constants/api.constants";
import {ISearchLabel} from "@/store/search.interface";

class RepositoryStore implements ISearchLabel<RepositoryModel.Repository[]> {

    data: RepositoryModel.Repository[] = [];
    totalItems = 0;
    isAtEnd = false;
    loading = false;
    error = false;
    page = 0;
    cache = observable.map();

    constructor() {
        makeAutoObservable(this)
    }

    async search(searchTerm: string, page = this.page) {
        this.error = false;
        this.loading = true;
        if (this.isAtEnd) return
        if (!searchTerm) {
            runInAction(() => {
                this.data = [];
            })
        } else {
            axiosInstance.get<Response<Array<RepositoryModel.Repository>>>(ApiConstants.repositories, {
                params: {
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
                    })
                })
                .catch(() => {
                    this.error = true;
                    this.data = [];
                })
                .finally(() => runInAction(() => this.loading = false))
        }
    }

    reset() {
        this.loading = true;
        this.data = [];
        this.totalItems = 0;
        this.isAtEnd = false;
        this.error = false;
        this.page = 0;
    }

}

export default new RepositoryStore();
