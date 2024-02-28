import { User } from "../User";
import { ICounter } from "../ICounter";

export interface IgetUsers {
    users: Array<User>;
}

export interface IgetUsersCounter {
    counters: ICounter;
}