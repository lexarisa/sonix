import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { likeRecipe, unlikeRecipe } from '../../services/recipeAPI';
import {
  setLikeRecipe,
  setUnlikeRecipe,
  likeDashboardRecipes,
  unlikeDashboardRecipes,
} from '../../state/actions';

//! styles and assets
import './styles/recipe-preview.scss';
import PlayIcon from './../../assests/icons/play.svg';
import PauseIcon from './../../assests/icons/pause.svg';
import Fav from '../../assests/icons/fav.svg';
import Unfav from '../../assests/icons/unfav.svg';
import Piano from '../../assests/icons/piano.svg';
import User from '../../assests/icons/signup.svg';
import Liked from '../../assests/icons/unfav-dark.svg';
import { CategoryInterface } from '../../interfaces/CategoryInterface';
import './styles/recipe-preview.scss';

type RecipePreviewProps = {
  recipe: CategoryInterface;
};

const RecipePreview = ({ recipe }: RecipePreviewProps) => {
  //@ts-ignore:next-line
  const { likedRecipes, handle } = useSelector((state) => state.profile);
  //@ts-ignore:next-line
  const authenticated = useSelector((state) => state.authenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState<HTMLMediaElement | null>(null);

  useEffect(() => {
    //set the player
    setPlayer(
      document.getElementById(
        `${recipe.category}-${recipe._id}-player`
      ) as HTMLMediaElement
    );
  }, []);

  const handlePlayAudio = async () => {
    if (player) {
      if (playing) {
        // pause the player
        await player.pause();
        setPlaying(false);
      } else {
        //play the player
        await player.play();
        setPlaying(true);
      }
    }
  };

  const trackEnded = () => {
    setPlaying(false);
  };

  const routeToRecipe = () => {
    navigate('/recipe', { state: { recipeId: recipe._id } });
  };

  const routeToUserProfile = () => {
    if (recipe.creatorHandle === handle) navigate('/me');
    else navigate(`/profile/${recipe.creatorHandle}`);
  };

  const handleLike = async (like: boolean) => {
    if (like) {
      const res = await likeRecipe(recipe._id);
      if (res.liked) {
        dispatch(setLikeRecipe(recipe._id));
        dispatch(likeDashboardRecipes(recipe._id, recipe.category));
      }
    } else {
      const res = await unlikeRecipe(recipe._id);
      if (res.unliked) {
        dispatch(setUnlikeRecipe(recipe._id));
        dispatch(unlikeDashboardRecipes(recipe._id, recipe.category));
      }
    }
  };
  return (
    <div className="recipe-preview-container">
      <div className="player-outer">
        <div className={recipe.category + ' player'}>
          <button className="player-button" onClick={handlePlayAudio}>
            <img
              className="playing-icon"
              src={playing ? PauseIcon : PlayIcon}
            ></img>
          </button>
          <audio
            crossOrigin="anonymous"
            id={`${recipe.category}-${recipe._id}-player`}
            src={recipe.preview}
            onEnded={trackEnded}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
      <div className="recipe-details" id={recipe._id}>
        {authenticated && likedRecipes && recipe.creatorHandle !== handle && (
          <>
            {likedRecipes[recipe._id] ? (
              <button onClick={() => handleLike(false)} className="like-button">
                <img className="like-icon" src={Fav} alt="un-favourite" />
              </button>
            ) : (
              <button onClick={() => handleLike(true)} className="like-button">
                <img className="like-icon" src={Unfav} alt="favourite" />
              </button>
            )}
          </>
        )}
        <h3 className="title" onClick={routeToRecipe}>
          {recipe.title}
        </h3>
        <div className="icon-detail-container">
          <img src={Piano} alt="piano-icon" className="recipe-details-icon" />
          <p className="synth-name">{recipe.originalSynth}</p>
        </div>
        <div className="icon-detail-container">
          <img src={User} alt="profile-icon" className="recipe-details-icon" />
          <p className="user" onClick={routeToUserProfile}>
            {recipe.creatorHandle}
          </p>
        </div>
        <div className="icon-detail-container">
          <img
            src={Liked}
            alt="favourite-icon"
            className="recipe-details-icon"
          />
          <p className="likes">{recipe.numberOfLikes}</p>
        </div>
        <p className="description">{recipe.description.substring(0, 50)}...</p>
      </div>
    </div>
  );
};

export default RecipePreview;
