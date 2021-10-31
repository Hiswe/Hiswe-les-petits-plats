import "./style.css";

import "/components/no-results/index.js";
import recipeCard from "/components/recipe-card/index.js";
import recipes from "/recipes.js";

await recipeCard;

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

const $searchInput = document.querySelector(`.search`);
// const $filters = document.querySelector(`.filters`);
const $recipesListing = document.querySelector(`.cards`);

$searchInput.addEventListener(`input`, filterAndRender);

renderListing(FORMATTED_RECIPES);

function filterAndRender() {
  const value = cleanText($searchInput.value);
  if (!value) return renderListing(FORMATTED_RECIPES);
  if (value.length < 3) return renderListing(FORMATTED_RECIPES);
  const filteredListing = FORMATTED_RECIPES.filter((recipe) => {
    return recipe.search.includes(value);
  });
  return renderListing(filteredListing);
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

function renderSelects() {}

function cleanText(text) {
  if (typeof text !== `string`) return ``;
  if (!text) return ``;
  return text.trim().toLowerCase();
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

  const utensils = [
    ...new Set(recipes.map((recipe) => recipe.ustensils).flat()),
  ].sort((a, b) => a.localeCompare(b));

  const machines = [...new Set(recipes.map((recipe) => recipe.appliance))];
  return { ingredients, utensils, machines };
}
