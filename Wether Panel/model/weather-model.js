
class modelClass {
    constructor() { }

    // Loading data from url.
    async loadData(url) {
        let promise = await fetch(url)
        return promise;
    }
}