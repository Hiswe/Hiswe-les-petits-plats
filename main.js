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
let KEYWORDS = [];

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

$searchInput.addEventListener(`input`, filterAndRender);
$ingredients.addEventListener(`selection`, (event) => {
  onKeywordSelection(event, INGREDIENTS);
});
$appliances.addEventListener(`selection`, (event) => {
  onKeywordSelection(event, APPLIANCES);
});
$utensils.addEventListener(`selection`, (event) => {
  onKeywordSelection(event, UTENSILS);
});
$keywordWrapper.addEventListener(`remove`, onKeywordRemoval);

renderListing(FORMATTED_RECIPES);

function getFilteredRecipes() {
  if (SEARCH_TERM.length < 3) return FORMATTED_RECIPES;
  let filteredRecipes = FORMATTED_RECIPES.filter((recipe) => {
    return recipe.searches.all.includes(SEARCH_TERM);
  });
  if (KEYWORDS.length) {
    filteredRecipes = filteredRecipes.filter((recipe) => {
      const isKeyWordMatch = KEYWORDS.map(keyword => {
        return recipe.searches[keyword.type].includes(keyword.label)
      })
      return isKeyWordMatch.every(result => result === true);
    });
  }
  return filteredRecipes;
}

function filterAndRender() {
  // keywords
  renderKeywords();
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

function renderKeywords() {
  if (!KEYWORDS.length) {
    $keywordWrapper.innerHTML = ``;
    $keywordWrapper.classList.remove(`keywords--visible`);
    return;
  }
  $keywordWrapper.classList.add(`keywords--visible`);
  const keywords = KEYWORDS.map((keyword) => {
    const keywordElement = document.createElement(`recipe-keyword`);
    keywordElement.setAttribute(`label`, keyword.label);
    keywordElement.style.setProperty(
      `--bg-color`,
      KEYWORD_COLORS[keyword.type]
    );
    return keywordElement;
  });
  $keywordWrapper.innerHTML = ``;
  $keywordWrapper.append(...keywords);
}

function onKeywordSelection(event, type) {
  KEYWORDS.push({ label: cleanText(event.detail), type });
  filterAndRender();
}

function onKeywordRemoval(event) {
  KEYWORDS = KEYWORDS.filter((keyword) => keyword.label !== event.detail);
  filterAndRender();
}
