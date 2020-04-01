import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import Recipe from './models/Recipe';

// global state like redux in store

/*
we will store here

Search object
current recipe object
shopping list object
liked recipes
*/

const state = {};

/* --------------------------  Search control -----------------------------------*/
const controlSearch = async () => {
    // 1) get the query from view

    const query = searchView.getInput();       // TODO


    if (query) {
        //2) IF search object is not empty create new object and add to the state
        state.search = new Search(query);
        //3) prepare ui for result

        searchView.clearInput();
        searchView.clearList();
        renderLoader(elements.serachResultDiv);
        //4)search for recipes

        try {

            await state.search.getResults();
            //5) render result on ui
            clearLoader();
            searchView.renderResults(state.search.recipes);
        } catch (error) {
            alert('Something went wrong with search !')
        }

    }

}



const search = new Search('pizza');
search.getResults();

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});

elements.serachResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearList();
        searchView.renderResults(state.search.recipes, gotoPage);
        console.log('event', gotoPage);

    }

});




/*--------------------------------Recipe controller------------------------------------------------------*/

const r = new Recipe(47746);
r.getRecipe();
console.log('r>>', r);


const controlRecipe = async () => {
    // Get Id from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for chnages

        // Create new recipe object

        state.recipe = new Recipe(id);
        try {

            await state.recipe.getRecipe()
            //Calculate servings and time

            state.recipe.calcTime();
            state.recipe.calcServings();


            // Render recipe
            console.log('state', state.recipe);
        } catch (error) {
            alert('Error processing recipe !')
        }
        // Get recipe object

    }

}

//window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));