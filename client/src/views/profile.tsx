import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react';
import { getUserProfile } from '../services/userAPI';
import { getProfileRecipes } from '../services/recipeAPI';
import RecipeScrollContainer from '../components/non-auth/recipe-scroll-container';
import './styles/profile.scss';
import { useSelector } from 'react-redux';

//interfaces
import { UserInterface } from '../interfaces/UserInterface';
import { RecipeInterface } from '../interfaces/RecipeInterface';

const Profile: React.FC = () => {
  const params = useParams<{ userHandle: string }>();
  const myProfile = useSelector((state) => state.profile);
  const [profile, setProfile] = useState<UserInterface | null>(null);
  const [recipes, setRecipes] = useState<{
    ownRecipes: RecipeInterface[];
    likedRecipes: RecipeInterface[];
  } | null>(null);

  useEffect(() => {
    const { userHandle } = params;
    window.scrollTo(0, 0);

    //get the users profile info and recipe data
    userHandle &&
      getUserProfile(userHandle)
        .then((res: UserInterface) => {
          setProfile(res);
          // get user liked and own recipes
          getProfileRecipes({
            own: res.ownRecipes,
            liked: res.likedRecipes,
          })
            .then((res) => {
              //store the results in state
              setRecipes(res);
            })
            .catch((error: Error) => console.log(error));
        })
        .catch((error: Error) => console.log(error));

    //get the users profile recipes
  }, [params, myProfile]);

  return (
    <>
      {profile && (
        <div className="profile-wrapper">
          <h2 className="title">{profile.handle}</h2>
          <p className="bio">{profile.bio}</p>

          {recipes && (
            <>
              {recipes.ownRecipes.length > 0 ? (
                <RecipeScrollContainer
                  title="Recipes"
                  data={recipes.ownRecipes}
                  key="my-recipes"
                />
              ) : (
                <h3 className="no-content">No recipes created yet.</h3>
              )}
              {recipes.likedRecipes.length > 0 ? (
                <RecipeScrollContainer
                  title="Liked Recipes"
                  data={recipes.likedRecipes}
                  key={'liked-recipes'}
                />
              ) : (
                <h3 className="no-content">No recipes liked yet</h3>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
