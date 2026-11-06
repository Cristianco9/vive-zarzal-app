const typeSelect = document.getElementById('type');
const recipeFields = document.getElementById('recipe-fields');

if (typeSelect && recipeFields) {
  const syncRecipeFields = () => {
    const isRecipe = typeSelect.value === 'recipe';
    recipeFields.hidden = !isRecipe;

    const ingredients = document.getElementById('ingredients');
    const instructions = document.getElementById('instructions');

    if (ingredients) {
      ingredients.required = isRecipe;
    }
    if (instructions) {
      instructions.required = isRecipe;
    }
  };

  typeSelect.addEventListener('change', syncRecipeFields);
  syncRecipeFields();
}
