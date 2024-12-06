import { makeAutoObservable } from 'mobx';

class Store {
    constructor() {
        makeAutoObservable(this);
    }

    count = 0;

    inc = (value) => {
        this.count += value;
    };

    dec = (value) => {
        this.count -= value;
    };

    get double() {
        return this.count * 2;
    }
}

export default new Store();
