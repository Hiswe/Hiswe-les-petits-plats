import { createApp } from "https://unpkg.com/petite-vue?module";
import { cleanText } from "/helpers.js";
import recipes from "/recipes.js";

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
      // make a big array of keywords too
      // this will help with keyword selection
      keywords: [
        recipe.ingredients.map((i) => cleanText(i.ingredient)),
        [cleanText(recipe.appliance)],
        recipe.ustensils.map((u) => cleanText(u)),
      ].flat(),
      // a dictionary of all keywords
      // will be used for select
      [INGREDIENTS]: recipe.ingredients.map((i) => cleanText(i.ingredient)),
      [APPLIANCES]: [cleanText(recipe.appliance)],
      [UTENSILS]: recipe.ustensils.map((u) => cleanText(u)),
    },
  };
});

createApp({
  // exposed to all expressions
  search: ``,
  keywords: [],
  // getters
  get recipes() {
    if (this.search.length < 3) return FORMATTED_RECIPES;
    
    let filteredRecipes = FORMATTED_RECIPES.filter((recipe) => {
      return recipe.searches.all.includes(this.search);
    });
    if (this.keywords.length) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        const isKeyWordMatch = KEYWORDS.map((keyword) => {
          return recipe.searches.keywords.includes(keyword.label);
        });
        return isKeyWordMatch.every((result) => result === true);
      });
    }
    return filteredRecipes;
  },
  // methods
  increment() {
    this.count++;
  },
}).mount(`#app`);
