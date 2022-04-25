import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { likeRecipe, unlikeRecipe } from '../../services/recipeAPI';
import { setLikeRecipe, setUnlikeRecipe, likeDashboardRecipes, unlikeDashboardRecipes } from '../../state/actions';

//! styles and assets
import styles from './styles/recipe-preview.scss';
import PlayIcon from './../../assests/icons/play.svg';
import PauseIcon from './../../assests/icons/pause.svg';

const RecipePreview = ({ recipe, category }) => {
  const { likedRecipes, handle } = useSelector(state => state.profile);
  const authenticated = useSelector(state => state.authenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    //set the player
    setPlayer(document.getElementById(`${category}-${recipe._id}-player`));
  }, []);

  const handlePlayAudio = async () => {
    if (playing) {
      // pause the player
      await player.pause();
      setPlaying(false);
    } else {
      //play the player
      await player.play();
      setPlaying(true);
    }
  };

  const trackEnded = () => {
    setPlaying(false);
  };

  const routeToRecipe = () => {
    navigate('/recipe/', { state: { recipeId: recipe._id } });
  };

  const routeToUserProfile = () => {
    navigate(`/profile/${recipe.creatorHandle}`);
  };

  const handleLike = async (like) => {
    if (like) {
      const res = await likeRecipe(recipe._id);
      if (res.liked) {
        dispatch(setLikeRecipe(recipe._id));
        dispatch(likeDashboardRecipes(recipe._id, category));
      }
    } else {
      const res = await unlikeRecipe(recipe._id);
      if (res.unliked) {
        dispatch(setUnlikeRecipe(recipe._id));
        dispatch(unlikeDashboardRecipes(recipe._id, category));
      }
    }
  };


  return (
    <div className="recipe-preview-container">
      <div className="player-outer">
        <div className={recipe.category + ' player'}>
          <button className="player-button" onClick={handlePlayAudio}>
            <img className="playing-icon" src={playing ? PauseIcon : PlayIcon}></img>
          </button>
          <audio crossOrigin="anonymous" id={`${category}-${recipe._id}-player`} src={recipe.preview} onEnded={trackEnded}>
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
      <div className='recipe-details' id={recipe._id}>
        {(authenticated && likedRecipes && recipe.creatorHandle !== handle) &&
          <>
            {likedRecipes[recipe._id] ?
              <button onClick={() => handleLike(false)} className='like-button'>unlike</button>
              :
              <button onClick={() => handleLike(true)} className='like-button'>like</button>
            }
          </>
        }
        <h3 className="title" onClick={routeToRecipe}>{recipe.title}</h3>
        <p className="synth-name">{recipe.originalSynth}</p>
        <p className="user" onClick={routeToUserProfile}>{recipe.creatorHandle}</p>
        <p className="likes">Likes: {recipe.numberOfLikes}</p>
        <p className="description">{recipe.description.substring(0, 50)}...</p>

      </div>
    </div>
  );
};

export default RecipePreview;