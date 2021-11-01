import "./style.css";

import "/components/no-results/index.js";
import searchBarInit from "/components/search-bar/index.js";
import filterSelectInit from "/components/filter-select/index.js";
import recipeCardInit from "/components/recipe-card/index.js";
import { cleanText } from "/helpers.js";
import recipes from "/recipes.js";

await Promise.all([searchBarInit, filterSelectInit, recipeCardInit]);

const INGREDIENTS = `INGREDIENTS`;
const APPLIANCES = `APPLIANCES`;
const UTENSILS = `UTENSILS`;

const FORMATTED_RECIPES = recipes.map((recipe) => {
  return {
    ...recipe,
    searches: {
      // make a big  string with everything inside to make the search more easy
      all: cleanText(
        `${recipe.name} ${recipe.description} ${recipe.ustensils.join(
          ` `
        )} ${recipe.ingredients.map((i) => i.ingredient).join(` `)}`
      ),
      // we'll need split keywords to have an exact match
      // • convert everything to array to keep a single method to call
      [INGREDIENTS]: recipe.ingredients.map((i) => cleanText(i.ingredient)),
      [APPLIANCES]: [cleanText(recipe.appliance)],
      [UTENSILS]: recipe.ustensils.map((u) => cleanText(u)),
    },
  };
});

let SEARCH_TERM = ``;
let KEYWORD = ``;
let KEYWORD_TYPE = ``;

const $searchInput = document.querySelector(`search-bar`);
const $recipesListing = document.querySelector(`.cards`);
const $ingredients = document.querySelector(`#ingredients`);
const $appliances = document.querySelector(`#appliances`);
const $utensils = document.querySelector(`#utensils`);

$searchInput.addEventListener(`input`, filterAndRender);
$ingredients.addEventListener(`selection`, (event) => {
  KEYWORD_TYPE = INGREDIENTS;
  onKeywordSelection(event);
});
$appliances.addEventListener(`selection`, (event) => {
  KEYWORD_TYPE = APPLIANCES;
  onKeywordSelection(event);
});
$utensils.addEventListener(`selection`, (event) => {
  KEYWORD_TYPE = UTENSILS;
  onKeywordSelection(event);
});

renderListing(FORMATTED_RECIPES);

function getFilteredRecipes() {
  if (SEARCH_TERM.length < 3) return FORMATTED_RECIPES;
  let filteredRecipes = FORMATTED_RECIPES.filter((recipe) => {
    return recipe.searches.all.includes(SEARCH_TERM);
  });
  if (KEYWORD && KEYWORD_TYPE) {
    console.log({ KEYWORD, KEYWORD_TYPE });
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return recipe.searches[KEYWORD_TYPE].includes(KEYWORD);
    });
  }
  return filteredRecipes;
}

function filterAndRender() {
  const newSearch = cleanText($searchInput.value);
  if (!SEARCH_TERM && (!newSearch || newSearch.length < 3)) return;
  SEARCH_TERM = newSearch;
  const filteredRecipes = getFilteredRecipes();
  getSelectInformation(filteredRecipes);
  renderListing(filteredRecipes);
}

function getSelectInformation(filteredRecipes) {
  const ingredients = [
    ...new Set(
      filteredRecipes
        .map((recipe) => {
          return recipe.ingredients.map((ingredient) => ingredient.ingredient);
        })
        .flat()
    ),
  ].sort((a, b) => a.localeCompare(b));

  const appliances = [
    ...new Set(filteredRecipes.map((recipe) => recipe.appliance)),
  ];

  const utensils = [
    ...new Set(filteredRecipes.map((recipe) => recipe.ustensils).flat()),
  ].sort((a, b) => a.localeCompare(b));

  $ingredients.data = ingredients;
  $appliances.data = appliances;
  $utensils.data = utensils;

  return { ingredients, utensils, appliances };
}

function renderListing(recipes) {
  if (!recipes.length) {
    $recipesListing.innerHTML = `<no-results />`;
    return;
  }
  const cards = recipes.map((recipe) => {
    const card = document.createElement(`recipe-card`);
    card.data = recipe;
    return card;
  });
  $recipesListing.innerHTML = ``;
  $recipesListing.append(...cards);
}

function onKeywordSelection(event) {
  KEYWORD = cleanText(event.detail);
  filterAndRender();
}
