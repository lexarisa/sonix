import RecipeScrollContainer from './recipe-scroll-container';

const Ingredients = ({ ingredients }) => {
  return (
    <div className="ingredients-container">
      <h2 className="title">Ingredients</h2>

      <div className="scroll-container">
        {ingredients.map((ing, i) => (
          <div key={i} className="ingredient">
            <p className="ingredient-title">{ing}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ingredients;