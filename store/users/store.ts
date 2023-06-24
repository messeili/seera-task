import {action, makeAutoObservable, observable,} from 'mobx';
import {userModel} from "@/models/user.model";

class UsersSore {

  @observable usersList: userModel.User[] = [];

  public constructor() {
    makeAutoObservable(this);
  }

  @action
  async getUsers(query: string): Promise<void> {
    fetch('https://jsonplaceholder.typicode.com/users', {method: 'GET'})
      .then(response => response.json())
      .then(response => this.usersList = response.data)
  }
}

export default new UsersSore();
