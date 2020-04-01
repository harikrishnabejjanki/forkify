import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;

    }
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            let dataObj = res.data.recipe;
            this.title = dataObj.title;
            this.author = dataObj.publisher;
            this.img = dataObj.image_url;
            this.url = dataObj.source_url;
            this.ingredients = dataObj.ingredients;
            console.log(res);

        } catch (error) {
            console.log(error);

        }


    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients

        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods;
    }

    calcServings() {
        this.servings = 4;
    }
}