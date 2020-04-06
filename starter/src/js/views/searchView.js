import { elements } from './base';

export const getInput = () => {
    return elements.searchInput.value;
};
export const clearInput = () => {
    elements.searchInput.value = "";
};
export const clearList = () => {
    elements.searchResultList.innerHTML = '';
    elements.serachResultPages.innerHTML = '';
};

export const highlightedSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));

    resultArr.map(el=>{
        el.classList.remove('results__link--active');
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}
// 'Pasta with tomato and spinach'  // string.split ===>  ['Pasta','with','tomato','and','spinach'];

/*
acc : acc+cur.length
0: 0 + 5 ('pasta' ==> 5 letters)  newTitle = ['pasta'],
5: 5 + 4 ('with' ==> 4 letters)  newTitle = ['pasta','with'],
9: 9 + 6 ('tomato' ==> 6 letters)  newTitle = ['pasta','with','tomato'],
14: 14 + 3 ('and' ==> 3 letters)  newTitle = ['pasta','with','tomato','and'],
17: 17 + 7 ('spinach' ==> 7 letters)  newTitle = ['pasta','with','tomato','and','spinach'],


*/


export const limitRecipeTitle = (title, limit = 17) => {
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

const createButton = (page, type) => {
    return `
           <button class="btn-inline results__btn--${type}" data-goto=${type == 'prev' ? page - 1 : page + 1}>
           <span>Page ${type == 'prev' ? page - 1 : page + 1}</span>
           <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type == 'prev' ? 'left' : 'right'}"></use>
            </svg>
           
            </button>
           `
};

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // show only next button
        button = createButton(page, 'next');
    } else if (page < pages) {
        // show next and prev button
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}        
        `;

    } else if (page === pages && pages > 1) {
        // show only prev button
        button = createButton(page, 'prev');
    }

    elements.serachResultPages.insertAdjacentHTML('afterbegin', button);

};
export const renderResults = (recipes, page = 1, resPerPage = 10) => {

    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);

};