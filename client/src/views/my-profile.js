import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateMyProfile } from '../services/userAPI';
import { getProfileRecipes } from '../services/recipeAPI';
import RecipeScrollContainer from '../components/non-auth/recipe-scroll-container';
import { updateMyBio } from '../state/actions';

import './styles/profile.scss';

const MyProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);
  const [recipes, setRecipes] = useState(null);
  const [updatingBio, setUpdatingBio] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!profile.ownRecipes || !profile.likedRecipes) {
      return;
    }
    // get user liked and own recipes
    getProfileRecipes({
      own: profile.ownRecipes,
      liked: Object.keys(profile.likedRecipes)
    })
      .then(res => {
        //store the results in state
        if (res.fetched) {
          setRecipes(res.data);
        } else {
          console.log('Could not fetch recipes!');
        }
      })
      .catch(error => console.log(error));
  }, [profile]);

  const showUpdateBio = async () => {
    setUpdatingBio(!updatingBio);
  };


  const handleUpdate = async () => {
    const bio = document.getElementById('update-bio');

    if (bio.value === '') {
      setUpdateError('Bio can not be empty!');
      return;
    }

    const res = await updateMyProfile({
      bio: bio.value
    });

    if (res.updated) {
      //update in store profile
      dispatch(updateMyBio(bio.value));
      //clear the input and hide it
      bio.value = '';
      setUpdateError(null);
      setUpdatingBio(false);

    } else {
      //display error message
      setUpdateError('Error updating bio!');
    }
  };

  return (
    <>
      {profile &&
        <div className="profile-wrapper">
          <h2 className="title">{profile.handle}</h2>
          <p className="my-bio" onClick={showUpdateBio}>{profile.bio}</p>
          {updateError &&
            <p className="error-message error-bottom-margin">{updateError}</p>
          }

          {updatingBio &&
            <>
              <textarea id="update-bio" name="bio" rows="3" placeholder='new bio...' />
              <input onClick={handleUpdate} className="submit-btn" type="submit" value="Update" />
            </>
          }
          {recipes &&
            <>
              {recipes.ownRecipes.length > 0 ?
                <RecipeScrollContainer title="Recipes" data={recipes.ownRecipes} key="my-recipes" />
                :
                <h3 className="no-content">No recipes created yet.</h3>
              }
              {recipes.likedRecipes.length > 0 ?
                <RecipeScrollContainer title="Liked Recipes" data={recipes.likedRecipes} key={'liked-recipes'} />
                :
                <h3 className="no-content">No recipes liked yet</h3>
              }
            </>

          }

        </div>
      }
    </>
  );
};

export default MyProfile;