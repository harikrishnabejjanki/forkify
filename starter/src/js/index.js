import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';

// global state like redux in store

/*
we will store here

Search object
current recipe object
shopping list object
liked recipes
*/

const state = {};

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

        await state.search.getResults();
        //5) render result on ui
        clearLoader();
        searchView.renderResults(state.search.recipes); 

    }

}


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

})
const search = new Search('pizza');
search.getResults();