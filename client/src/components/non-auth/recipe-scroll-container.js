import './styles/recipe-scroll-container.scss';
import RecipePreview from './recipe-preview';
import { useNavigate } from 'react-router-dom';

const RecipeScrollContainer = ({ title, data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/category', { state: { category: title } });
  };

  return (
    <>
      <div className="outer-container">
        <h2 onClick={handleClick} className="category-title">{title}</h2>

        <div className="scroll-container">
          {data && data.map(recipe => (
            <RecipePreview recipe={recipe} category={recipe.category} key={recipe._id} />
          ))
          }
        </div>
      </div>

    </>

  );
};

export default RecipeScrollContainer;