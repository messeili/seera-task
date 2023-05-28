import axiosInstance from "@/utils/axios.config";
import {makeAutoObservable, observable, runInAction} from 'mobx';
import {Response} from "@/models/response.model";
import {RepositoryModel} from "@/models/repository.model";
import {ApiConstants} from "@/constants/api.constants";

class RepositoryStore {

     repositoriesList: RepositoryModel.Repository[] = [];
     totalItems = 0;
     fetchedItemsCount = 0;
     loading = false;
     error = false;
     page = 0;
     cache = observable.map();

    constructor() {
        makeAutoObservable(this)
    }

    async getRepositories(query: string, page = this.page) {
        this.error = false;
        this.loading = true;
        if(!query) return Promise.resolve();
        return axiosInstance.get<Response<Array<RepositoryModel.Repository>>>(ApiConstants.repositories, {
            params: {
                q: query,
                page
            }
        })
            .then(response => response.data)
            .then(response => {
                runInAction(() => {
                    this.repositoriesList = [...this.repositoriesList, ...response.items]
                    this.totalItems = response.total_count;
                    this.fetchedItemsCount += response.items.length;
                    this.page = this.page + 1;
                })
            })
            .catch(() => {
                this.error = true;
                this.repositoriesList = [];
            })
            .finally(() => runInAction(() => this.loading = false))
    }

    reset() {
        this.loading = false;
        this.repositoriesList = [];
        this.totalItems = 0;
        this.fetchedItemsCount = 0;
        this.error = false;
        this.page = 0;
    }

}

export default new RepositoryStore();
