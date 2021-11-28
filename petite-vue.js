import { createApp } from "https://unpkg.com/petite-vue?module";
import { cleanText } from "/helpers.js";
import recipes from "/recipes.js";

const INGREDIENTS = `INGREDIENTS`;
const APPLIANCES = `APPLIANCES`;
const UTENSILS = `UTENSILS`;
const SEARCH_MIN_TEXT = 3;

const clickOutside = (ctx) => {
  const handleOutsideClick = (e) => {
    e.stopPropagation();
    if (!ctx.el.contains(e.target)) ctx.get()();
  };
  // Register click/touchstart event listeners on the whole page
  document.addEventListener(`click`, handleOutsideClick);

  // cleanup if the element is unmounted
  return () => {
    document.removeEventListener(`click`, handleOutsideClick);
  };
};

const textToArray = (text) => {
  const textWithNoPunctuation = text
    .replace(/[\.'\(\)]/gi, ` `)
    .replace(/\s+/, ` `);
  const wordArray = textWithNoPunctuation
    .split(` `)
    .map(cleanText)
    .filter((word) => word.length >= SEARCH_MIN_TEXT);
  return wordArray;
};

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

function Filter(props) {
  return {
    $template: `#filter-template`,
    id: props.id,
    label: props.label,
    placeholder: props.placeholder,
    itemSearch: ``,
    showPanel: false,
    // passing keywords directly as a prop seems to remove reactivity
    // => use `id` as a key to get the filters from the global state
    get filteredKeywords() {
      if (!this.itemSearch) return this.filters[props.id];
      return this.filters[props.id].filter((item) =>
        item.includes(cleanText(this.itemSearch))
      );
    },
    onKeyword(keyword) {
      this.keywordsSelection.push({ label: cleanText(keyword), type: this.id });
      this.showPanel = false;
    },
    onFocus() {
      this.showPanel = true;
    },
    onOutside() {
      this.showPanel = false;
    },
  };
}

createApp({
  Filter,
  // global state
  search: ``,
  keywordsSelection: [],
  // getters
  get cleanedSearchAsArray() {
    return textToArray(this.search);
  },
  get isValidSearch() {
    return this.cleanedSearchAsArray.length > 0;
  },
  get recipes() {
    if (!this.isValidSearch) return FORMATTED_RECIPES;
    let filteredRecipes = FORMATTED_RECIPES.filter((recipe) => {
      return this.cleanedSearchAsArray
        .map((searchWord) => recipe.searches.all.includes(searchWord))
        .every((result) => result === true);
    });
    if (this.keywordsSelection.length) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        const isKeyWordMatch = this.keywordsSelection.map((keyword) => {
          return recipe.searches.keywords.includes(keyword.label);
        });
        return isKeyWordMatch.every((result) => result === true);
      });
    }
    return filteredRecipes;
  },
  get displayFilters() {
    return this.isValidSearch;
  },
  get filters() {
    this.recipes;
    const [ingredients, appliances, utensils] = [
      INGREDIENTS,
      APPLIANCES,
      UTENSILS,
    ].map((key) => {
      return (
        [...new Set(this.recipes.map((recipe) => recipe.searches[key]).flat())]
          .sort((a, b) => a.localeCompare(b))
          // don't repeat already pinned keywords into select
          .filter(
            (term) => !this.keywordsSelection.find((kw) => kw.label === term)
          )
      );
    });
    return {
      ingredients,
      utensils,
      appliances,
    };
  },
  // methods
  onRemoveKeyword(keyword) {
    this.keywordsSelection = this.keywordsSelection.filter(
      (kw) => kw.label !== keyword
    );
  },
})
  .directive(`click-outside`, clickOutside)
  .mount(`#app`);
