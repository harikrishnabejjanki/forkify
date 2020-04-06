import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    };

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,5,6,7,8] => splice(1,2)--> returns [4,5], original array is [2,6,7,8] == it will mutates the array

        // [2,4,5,6,7,8] => slice(1,2)--> returns[4], (it doesnt inclueds the end index in slice) so original array = [2,4,5,6,7,8]   // it will not mutates the array
        this.items.splice(index, 1);

    };

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }

}