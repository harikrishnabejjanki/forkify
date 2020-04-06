export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {

        const like = {
            id,
            title,
            author,
            img
        }

        this.likes.push(like);
        this.persistData();
        // Persist the data to the local storage (adding)
        return like;

    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.persistData();
        // Persist the data to the local storage (removing)
    }

    isLiked(id) {

        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumOfLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
 

        // restore likes from the local storage
        if (storage) {
            this.likes = storage;
        }
    }
}