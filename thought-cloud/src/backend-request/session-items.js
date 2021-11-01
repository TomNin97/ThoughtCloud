export class SessionItems {
    constructor() {
        this.localStorage = window.localStorage;
    }

    setItem(key, value) {
        this.localStorage.setItem(`${key}`, `${value}`);
    }

    getItem(key) {
        return this.localStorage.getItem(`${key}`);
    }
}