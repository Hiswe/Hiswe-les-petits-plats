import "./style.css";

import recipeCard from "/recipe-card/index.js";
import recipes from "/recipes.js";

// const ALL_INGREDIENTS = [...new Set(recipes.map((recipe) => {
//   return recipe.ingredients.map((ingredient) => ingredient.ingredient);
// }).flat())].sort(((a, b) => a.localeCompare(b)));

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
const $recipesListing = document.querySelector(`.cards`);

$searchInput.addEventListener(`input`, filterAndRender);

render(FORMATTED_RECIPES);

function filterAndRender() {
  const value = cleanText($searchInput.value);
  if (!value) return render(FORMATTED_RECIPES);
  const filteredListing = FORMATTED_RECIPES.filter((recipe) => {
    return recipe.search.includes(value);
  });
  return render(filteredListing);
}

function render(recipes) {
  $recipesListing.innerHTML = ``;
  const cards = recipes.map((recipe) => {
    const card = document.createElement(`recipe-card`);
    card.data = recipe;
    return card;
  });
  $recipesListing.append(...cards);
}

function cleanText(text) {
  if (typeof text !== `string`) return ``;
  if (!text) return ``;
  return text.trim().toLowerCase();
}
