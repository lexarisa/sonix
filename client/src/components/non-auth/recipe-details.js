import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { likeRecipe, unlikeRecipe } from '../../services/recipeAPI';
import { setLikeRecipe, setUnlikeRecipe, likeDashboardRecipes, unlikeDashboardRecipes } from '../../state/actions';

import styles from './styles/recipe-details.scss';
import PlayIcon from '../../assests/icons/play.svg';
import PauseIcon from '../../assests/icons/pause.svg';
import Fav from '../../assests/icons/fav.svg';
import Unfav from '../../assests/icons/unfav.svg';
import Piano from '../../assests/icons/piano.svg';
import User from '../../assests/icons/signup.svg';
import Liked from '../../assests/icons/unfav-dark.svg';

const RecipeDetails = ({ recipe, setRecipe }) => {
  const { likedRecipes, handle } = useSelector(state => state.profile);
  const authenticated = useSelector(state => state.authenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    setPlayer(document.getElementById(`${recipe._id}-player`));
  });

  const handlePlayAudio = () => {
    if (playing) {
      // pause the player
      player.pause();
      setPlaying(false);
    } else {
      //play the player
      player.play();
      setPlaying(true);
    }
  };

  const trackEnded = () => {
    setPlaying(false);
  };

  const routeToUserProfile = () => {
    if (recipe.creatorHandle === handle) navigate('/me');
    else navigate(`/profile/${recipe.creatorHandle}`);
  };

  const handleLike = async (like) => {
    if (like) {
      const res = await likeRecipe(recipe._id);
      if (res.liked) {
        dispatch(setLikeRecipe(recipe._id));
        dispatch(likeDashboardRecipes(recipe._id, recipe.category));
        // increase likes
        recipe.numberOfLikes++;
        setRecipe(recipe);
      }
    } else {
      const res = await unlikeRecipe(recipe._id);
      if (res.unliked) {
        dispatch(setUnlikeRecipe(recipe._id));
        dispatch(unlikeDashboardRecipes(recipe._id, recipe.category));
        recipe.numberOfLikes--;
        setRecipe(recipe);
      }
    }
  };

  return (
    <div className="preview-container">
      <div className={recipe.category + ' player'}>
        <button className="player-button" onClick={handlePlayAudio}>
          <img className="playing-icon" src={playing ? PauseIcon : PlayIcon}></img>
        </button>
        <audio crossOrigin="anonymous" id={`${recipe._id}-player`} src={recipe.preview} onEnded={trackEnded}>
          Your browser does not support the audio element.
        </audio>
      </div>
      <div className="recipe-information">
        {(authenticated && likedRecipes && recipe.creatorHandle !== handle) &&
          <>
            {likedRecipes[recipe._id] ?
              <button onClick={() => handleLike(false)} className='like-button'>
                <img className="like-icon" src={Fav} alt="un-favourite" />
              </button>
              :
              <button onClick={() => handleLike(true)} className='like-button'>
                <img className="like-icon" src={Unfav} alt="favourite" />
              </button>
            }
          </>
        }


        <h3 className="title">{recipe.title}</h3>
        <div className="tags">
          {recipe && recipe.tags.map(tag => <p key={tag} className="tag">{tag}</p>)}
        </div>

        <div className="icon-detail-container">
          <img src={Piano} alt="piano-icon" className='recipe-details-icon' />
          <p className="synth-name">{recipe.originalSynth}</p>
        </div>


        <div className="icon-detail-container">
          <img src={User} alt="profile-icon" className='recipe-details-icon' />
          <p className="user" onClick={routeToUserProfile}>{recipe.creatorHandle}</p>
        </div>

        <div className="icon-detail-container">
          <img src={Liked} alt="favourite-icon" className='recipe-details-icon' />
          <p className="likes">{recipe.numberOfLikes}</p>
        </div>

        <p className="description">{recipe.description}</p>
      </div>
    </div>

  );
};

export default RecipeDetails;