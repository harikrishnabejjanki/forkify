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

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {

            // 1. uniform units
            let ingredient = el.toLowerCase();

            unitsLong.map((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });


            //2 remove paretheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");


            //3 Parse ingredients into count, unit and ingredient

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => {
                units.includes(el2);
            });

            let objIng;
            if (unitIndex > -1) {
                // There is a unit value
                const arrCount = arrIng.slice(0, unitIndex);   //ex: 4 1/2 cups, arrCount is [4, 1/2]

                let count;

                if (arrCount.length === 1) {
                    count = (arrCount[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')); // eval('4+1/2') ---> 4.5
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' '),

                }

            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit, but 1st element is number

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is no unit but no number in 1st position

                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings

        const newServings = type == 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients

        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings/this.servings);
            
        })

        this.servings = newServings;
    }
}