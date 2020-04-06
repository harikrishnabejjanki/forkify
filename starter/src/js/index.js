
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import Search from './models/Search';
import List from './models/List';
import Likes from './models/Likes';

// global state like redux in store

/*
we will store here

Search object
current recipe object
shopping list object
liked recipes
*/

const state = {};
window.state = state;



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
            recipeView.renderRecipe(state.recipe,
                state.likes.isLiked(id));
            console.log('state', state.recipe);
        } catch (error) {
            console.log(error);

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
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
};


/* --------------------------  List control end -----------------------------------*/



/* --------------------------  Likes control start -----------------------------------*/



const controllerLike = () => {

    if (!state.likes) {
        state.likes = new Likes();
    }
    const currentId = state.recipe.id;

    if (!state.likes.isLiked(currentId)) {       ////// This if Condition for User not yet liked the recipe
        // Add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );


        // toggle the like button
        likesView.toggleLikedBtn(true);
        // add like to the UI list
        likesView.renderLike(newLike);

    } else {                               ////// This else Condition for User already  liked the recipe we should remove it
        // remove like from the state
        state.likes.deleteLike(currentId);
        // toggle remove the like button
        likesView.toggleLikedBtn(false);
        // remove like to the UI list

        likesView.deleteLike(currentId);
    }

    likesView.toggleLikesMenu(state.likes.getNumOfLikes())
}

/* --------------------------  Likes control end -----------------------------------*/




// --------------------------------- Handle delete and update list item  ------------------------///

elements.shoppingList.addEventListener('click', e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete button

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI

        listView.deleteItem(id);

    } else if (e.target.matches('.shopping__count--value')) {   // hadleing the update count

        const val = parseFloat(e.target.value, 10);
        // update item when change the drop down
        state.list.updateCount(id, val);
    }

});



// ----------------------------------  List controller end ---------------------------------///


/// restore liked recipes when page loades 

window.addEventListener('load', e => {
 
    state.likes = new Likes(); 


    // restore the likes

    state.likes.readStorage();

    // toggle like menu button
    likesView.toggleLikesMenu(state.likes.getNumOfLikes());

    // Render the existing likes

    state.likes.likes.forEach(like => likesView.renderLike(like))

});

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
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {    // it will click inc button its child elements
        // Call like controll
        controllerLike();
    }


});
