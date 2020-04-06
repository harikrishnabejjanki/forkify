
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import Recipe from './models/Recipe';
import Search from './models/Search';
import List from './models/List';

// global state like redux in store

/*
we will store here

Search object
current recipe object
shopping list object
liked recipes
*/

const state = {};





/* --------------------------  Search control start -----------------------------------*/
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



/* --------------------------  Search control end -----------------------------------*/

/*--------------------------------Recipe controller start------------------------------------------------------*/



const controlRecipe = async () => {
    // Get Id from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for chnages
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) {
            searchView.highlightedSelected(id);
        }
        // Create new recipe object

        state.recipe = new Recipe(id);
        //window.r = state.recipe;

        try {
            // Get the recipe data and parse ingrdients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculate servings and time

            state.recipe.calcTime();
            state.recipe.calcServings();


            // Render recipe

            clearLoader();
            recipeView.renderRecipe(state.recipe);
            console.log('state', state.recipe);
        } catch (error) {
            alert('Error processing recipe !')
        }
        // Get recipe object

    }

}
// ---------------------------------------------------------Recipe controler end --------------------------


// ----------------------------------  List controller start ---------------------------------///


const controlList = () => {
   
    // Create new list if there is no list yet

    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredient to the list and UI

    state.recipe.ingredients.forEach(el => {
       const item =  state.list.addItem(el.count, el.unit, el.ingredient);
       listView.renderItem(item);
    })
}



// ----------------------------------  List controller end ---------------------------------///




/// --------------------- All event listners  ----------------------- ////


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


//window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));




//handling recipe controller button clikcs

elements.recipe.addEventListener('click', e => {               // it will clicks dec button or its child elements
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {

            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {    // it will click inc button its child elements
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
        
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {    // it will click inc button its child elements
        
        controlList();
    }


});
 