import "./style.css";

import "/components/no-results/index.js";
import searchBarInit from "/components/search-bar/index.js";
import filterSelectInit from "/components/filter-select/index.js";
import recipeCardInit from "/components/recipe-card/index.js";
import { cleanText } from "/helpers.js";
import recipes from "/recipes.js";

await Promise.all([searchBarInit, filterSelectInit, recipeCardInit]);

const FORMATTED_RECIPES = recipes.map((recipe) => {
  return {
    ...recipe,
    search: cleanText(
      `${recipe.name} ${recipe.description} ${recipe.ustensils.join(
        ` `
      )} ${recipe.ingredients.map((i) => i.ingredient).join(` `)}`
    ),
  };
});

// const INGREDIENTS = [
//   ...new Set(
//     FORMATTED_RECIPES
//       .map((recipe) => {
//         return recipe.ingredients.map((ingredient) => ingredient.ingredient);
//       })
//       .flat()
//   ),
// ].sort((a, b) => a.localeCompare(b));
// const MACHINES  = [...new Set(FORMATTED_RECIPES.map((recipe) => recipe.appliance))]
// const UTENSILS = [
//   ...new Set(FORMATTED_RECIPES.map((recipe) => recipe.ustensils).flat()),
// ].sort((a, b) => a.localeCompare(b));

const $searchInput = document.querySelector(`search-bar`);
// const $filters = document.querySelector(`.filters`);
const $recipesListing = document.querySelector(`.cards`);
const $ingredients = document.querySelector(`#ingredients`);
const $machines = document.querySelector(`#machines`);
const $utensils = document.querySelector(`#utensils`);

$searchInput.addEventListener(`input`, filterAndRender);

renderListing(FORMATTED_RECIPES);

function filterAndRender() {
  const value = cleanText($searchInput.value);
  if (!value) return renderListing(FORMATTED_RECIPES);
  if (value.length < 3) return renderListing(FORMATTED_RECIPES);
  const filteredListing = FORMATTED_RECIPES.filter((recipe) => {
    return recipe.search.includes(value);
  });
  getSelectInformation(filteredListing);
  renderListing(filteredListing);
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

function getSelectInformation(recipes) {
  const ingredients = [
    ...new Set(
      recipes
        .map((recipe) => {
          return recipe.ingredients.map((ingredient) => ingredient.ingredient);
        })
        .flat()
    ),
  ].sort((a, b) => a.localeCompare(b));

  const machines = [...new Set(recipes.map((recipe) => recipe.appliance))];

  const utensils = [
    ...new Set(recipes.map((recipe) => recipe.ustensils).flat()),
  ].sort((a, b) => a.localeCompare(b));

  $ingredients.data = ingredients;
  $machines.data = machines;
  $utensils.data = utensils;

  return { ingredients, utensils, machines };
}
