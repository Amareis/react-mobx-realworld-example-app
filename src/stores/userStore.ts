import { observable, action } from 'mobx';
import agent from '../agent';

export type User = {
    username: string
    image: string
    bio: string
    email: string
}

class UserStore {
  @observable currentUser: User | undefined;
  @observable loadingUser = false;
  @observable updatingUser = false;
  @observable updatingUserErrors: Record<string, string> | null = null;

  @action pullUser() {
    this.loadingUser = true;
    return agent.Auth.current()
      .then(action(({ user }) => { this.currentUser = user; }))
      .finally(action(() => { this.loadingUser = false; }))
  }

  @action updateUser(newUser) {
    this.updatingUser = true;
    return agent.Auth.save(newUser)
      .then(action(({ user }) => { this.currentUser = user; }))
      .finally(action(() => { this.updatingUser = false; }))
  }

  @action forgetUser() {
    this.currentUser = undefined;
  }

}

export default new UserStore();
