import "./style.css";

import "/components/no-results/index.js";
import searchBarInit from "/components/search-bar/index.js";
import filterSelectInit from "/components/filter-select/index.js";
import recipeCardInit from "/components/recipe-card/index.js";
import recipeKeywordInit from "/components/recipe-keyword/index.js";
import { cleanText } from "/helpers.js";
import recipes from "/recipes.js";

await Promise.all([
  searchBarInit,
  filterSelectInit,
  recipeCardInit,
  recipeKeywordInit,
]);

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

const KEYWORD_COLORS = {
  [INGREDIENTS]: `#3282f7`,
  [APPLIANCES]: `#68d9a4`,
  [UTENSILS]: `#ed6454`,
};

const $searchInput = document.querySelector(`search-bar`);
const $filters = document.querySelector(`.filters`);
const $recipesListing = document.querySelector(`.cards`);
const $ingredients = document.querySelector(`#ingredients`);
const $appliances = document.querySelector(`#appliances`);
const $utensils = document.querySelector(`#utensils`);

const $keywordWrapper = document.querySelector(`.keywords`);
const $keyword = document.querySelector(`recipe-keyword`);

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

$keyword.addEventListener(`remove`, (event) => {
  KEYWORD_TYPE = ``;
  KEYWORD = ``;
  $keyword.removeAttribute(`label`);
  $keyword.style.removeProperty(`--bg-color`);
  filterAndRender();
});

renderListing(FORMATTED_RECIPES);

function getFilteredRecipes() {
  if (SEARCH_TERM.length < 3) return FORMATTED_RECIPES;
  let filteredRecipes = FORMATTED_RECIPES.filter((recipe) => {
    return recipe.searches.all.includes(SEARCH_TERM);
  });
  if (KEYWORD && KEYWORD_TYPE) {
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return recipe.searches[KEYWORD_TYPE].includes(KEYWORD);
    });
  }
  return filteredRecipes;
}

function filterAndRender() {
  // keywords
  const hasKeywords = KEYWORD && KEYWORD_TYPE;
  $keywordWrapper.classList[hasKeywords ? `add` : `remove`](
    `keywords--visible`
  );
  if (hasKeywords) {
    $keyword.setAttribute(`label`, KEYWORD);
    $keyword.style.setProperty(`--bg-color`, KEYWORD_COLORS[KEYWORD_TYPE]);
  }
  // search
  const newSearch = cleanText($searchInput.value);
  const hasSearch = newSearch && newSearch.length >= 3;
  if (!SEARCH_TERM && !hasSearch) return;
  SEARCH_TERM = newSearch;
  const filteredRecipes = getFilteredRecipes();
  renderListing(filteredRecipes);
  const { hasFilters } = getSelectInformation(filteredRecipes);
  $filters.classList[hasFilters && hasSearch ? `add` : `remove`](
    `filters--visible`
  );
}

function getSelectInformation(filteredRecipes) {
  const ingredients = [
    ...new Set(
      filteredRecipes.map((recipe) => recipe.searches[INGREDIENTS]).flat()
    ),
  ].sort((a, b) => a.localeCompare(b));
  const appliances = [
    ...new Set(
      filteredRecipes.map((recipe) => recipe.searches[APPLIANCES]).flat()
    ),
  ];
  const utensils = [
    ...new Set(
      filteredRecipes.map((recipe) => recipe.searches[UTENSILS]).flat()
    ),
  ].sort((a, b) => a.localeCompare(b));

  $ingredients.data = ingredients;
  $appliances.data = appliances;
  $utensils.data = utensils;

  return {
    ingredients,
    utensils,
    appliances,
    hasFilters: ingredients.length || utensils.length || appliances.length,
  };
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
