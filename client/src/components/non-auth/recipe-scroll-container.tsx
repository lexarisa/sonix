import './styles/recipe-scroll-container.scss';
import React from 'react';
import RecipePreview from './recipe-preview';
import { useNavigate } from 'react-router-dom';
import { RecipeInterface } from '../../interfaces/RecipeInterface';

const RecipeScrollContainer: React.FC<{
  title: string;
  data: RecipeInterface[];
}> = ({ title, data }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/category', { state: { category: title } });
  };

  return (
    <>
      <div className="outer-container">
        <h1 onClick={handleClick} className="category-title">
          {title}
        </h1>

        <div className="scroll-container">
          {data &&
            data.map((recipe: RecipeInterface) => (
              <RecipePreview recipe={recipe} key={recipe._id} />
            ))}
        </div>
      </div>
    </>
  );
};

export default RecipeScrollContainer;
