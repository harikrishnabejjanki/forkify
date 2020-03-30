import { elements } from './base';

export const getInput = () => {
    return elements.searchInput.value;
};
export const clearInput = () => {
    elements.searchInput.value = "";
};
export const clearList = () => {
    elements.searchResultList.innerHTML = ''
};


// 'Pasta with tomato and spinach'  // string.split ===>  ['Pasta','with','tomato','and','spinach'];

/*
acc : acc+cur.length
0: 0 + 5 ('pasta' ==> 5 letters)  newTitle = ['pasta'],
5: 5 + 4 ('with' ==> 4 letters)  newTitle = ['pasta','with'],
9: 9 + 6 ('tomato' ==> 6 letters)  newTitle = ['pasta','with','tomato'],
14: 14 + 3 ('and' ==> 3 letters)  newTitle = ['pasta','with','tomato','and'],
17: 17 + 7 ('spinach' ==> 7 letters)  newTitle = ['pasta','with','tomato','and','spinach'],


*/


const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }

            return acc + cur.length;

        }, 0)

        // return the result

        return `${newTitle.join(' ')} ...`;
    }
    return title;

}


const renderRecipe = recipe => {
    console.log('list', recipe);

    const markup = `
            <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
`;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);



}
export const renderResults = recipes => {
    recipes.forEach(renderRecipe)
}