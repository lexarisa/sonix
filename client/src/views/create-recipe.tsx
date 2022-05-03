import { useForm, useFieldArray } from 'react-hook-form';
import { storage } from '../services/firebase';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { createRecipe } from '../services/recipeAPI';
import { storeRecipe } from '../state/actions';
import { storeRecipeProfile } from '../state/actions';
import { FormRecipeInterface } from '../interfaces/FormRecipeInterface';
import { FormConstructorRecipeInterface } from '../interfaces/FormRecipeInterface';

import './styles/create-recipe.scss';

const CreateRecipe = () => {
  //store / state / navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<string>('');

  // react hook forms
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      description: '',
      originalSynth: '',
      category: '',
      sampleFile: '',
      tags: [{ value: '' }],
      ingredients: [{ value: '' }],
      steps: [{ step: '' }],
    },
  });

  //ingredients field array
  const {
    fields: ingredients,
    append: ingredientsAppend,
    // remove: ingredientsRemove,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  //method field array
  const {
    fields: steps,
    append: stepsAppend,
    // remove: stepsRemove,
  } = useFieldArray({
    control,
    name: 'steps',
  });

  const {
    fields: tags,
    append: tagsAppend,
    // remove: tagsRemove,
  } = useFieldArray({
    control,
    name: 'tags',
  });

  //! submit the form to firebase/server
  const onSubmit = async (data: FormConstructorRecipeInterface) => {
    //make the document to store

    console.log('data', data);
    const file: any = data.sampleFile[0];

    // check the file is type mp3 or wav
    if (file.type !== 'audio/wav' && file.type !== 'audio/mpeg') {
      setUploadMessage('Audio preview must be of type wav or mp3!');
      return;
      // throw an error
    }

    let filename;
    //get the filename
    if (typeof data.sampleFile[0] !== 'string') {
      filename = data.sampleFile[0].name;

      //create a unique filename
      const fileId = uuidv4();
      filename += fileId;
      filename += new Date().toLocaleTimeString();
    }

    //todo - check if the file exists already or create unique filename for each file?
    //todo - could hash the filename + date???
    //! try to upload the audio to firebase
    let filepath;
    try {
      //create the reference
      const storageRef = ref(storage, `samples/${filename}`);
      //store the data
      await uploadBytes(storageRef, file);
      //get the download link to display on the page
      filepath = await getDownloadURL(ref(storage, `samples/${filename}`));
      // check for error
      setUploadMessage('Uploaded audio preview.');
    } catch (error) {
      setUploadMessage('Failed to upload audio!');
      return;
    }

    //build the recipe object
    const recipe: FormRecipeInterface = {
      //get creator handle and id on server from token middleware
      title: data.title,
      description: data.description,
      category: data.category,
      originalSynth: data.originalSynth,
      preview: filepath,
      tags: data.tags.map((tag: { value: string }) => tag.value),
      ingredients: data.ingredients.map((ing: { value: string }) => ing.value),
      recipeMethod: data.steps.map((step: any) => step.step),
    };

    createRecipe(recipe)
      .then((res) => {
        console.log('RES', res);
        if (res) {
          console.log('RES IN CREATE REC', res);
          setResultMessage('Uploaded recipe to database.');
          return res;
        } else throw new Error(res.error.message);
      })
      .then((res) => {
        dispatch(storeRecipe(res, data.category));
        dispatch(storeRecipeProfile(res._id));
        navigate('/recipe', { state: { recipeId: res._id } });
      })
      .catch((err) => {
        console.log(err.message);
        setResultMessage('Failed to upload recipe to database!');
      });
    // add to recipe to the database
    // try {
    //   const result = await createRecipe(recipe);
    //   console.log('RECIPE',recipe);
    //   console.log('RESULT',result);
    //   //if added to db - add to local storage
    //   if (result.created) setResultMessage('Uploaded recipe to database.');
    //   else throw new Error(result.error.message);
    //   // navigate to new recipe / reset form
    // } catch (error: unknown) {
    //   setResultMessage('Failed to upload recipe to database!');
    // }
    // add the recipe to the local store
    // try {
    //   dispatch(storeRecipe(result.data, data.category));
    //   dispatch(storeRecipeProfile(result.data._id));
    //   navigate('/recipe', { state: { recipeId: result.data._id } });
    // } catch (error) {
    //   setResultMessage('Failed to store recipe in local store!');
    // }
  };

  return (
    <div className="create-recipe-wrapper">
      <form className="create-form" onSubmit={handleSubmit(onSubmit)}>
        {/* details */}
        <div className="recipe-section recipe-details">
          <h2>Recipe Details</h2>
          <input
          data-input=
            type="text"
            {...register('title')}
            placeholder="title"
            required
          />
          <input
            type="text"
            {...register('description')}
            placeholder="description"
            required
          />
          <input
            type="text"
            {...register('originalSynth')}
            placeholder="synth"
            required
          />

          <select {...register('category')} defaultValue="Bass">
            {/* <option value="" disabled selected hidden>category</option> */}
            <option value="Bass">Bass</option>
            <option value="Pad">Pad</option>
            <option value="Lead">Lead</option>
            <option value="FX">FX</option>
            <option value="Keys">Keys</option>
            <option value="Pluck">Pluck</option>
            <option value="String">String</option>
            <option value="Other">Other</option>
          </select>

          {tags.map((field, index) => (
            <input
              key={field.id} // important to include key with field's id
              placeholder="tag (one per input)"
              {...register(`tags.${index}.value`)}
            />
          ))}
          <button
            className="add-btn"
            type="button"
            onClick={() => {
              tagsAppend({ value: '' });
            }}
          >
            +
          </button>
          <label className="file-upload">
            <input type="file" {...register('sampleFile')} required />
            Click to upload audio sample (wav or mp3)
          </label>
        </div>

        {/* ingredients */}
        <div className="recipe-section recipe-ingredients">
          <h2>Ingredients</h2>
          {ingredients.map((field, index) => (
            <input
              key={field.id} // important to include key with field's id
              {...register(`ingredients.${index}.value`)}
            />
          ))}
          <button
            className="add-btn"
            type="button"
            onClick={() => {
              ingredientsAppend({ value: '' });
            }}
          >
            +
          </button>
        </div>
        {/* method */}
        <div className="recipe-section recipe-method">
          <h2>Method</h2>
          {steps.map((field, index) => (
            <textarea
              rows={3}
              key={field.id}
              {...register(`steps.${index}.step`)}
            ></textarea>
          ))}
          <button
            className="add-btn"
            type="button"
            onClick={() => {
              stepsAppend({ step: '' });
            }}
          >
            +
          </button>
          <input className="submit-btn" type="submit" />
          {uploadMessage && <p className="error-message">{uploadMessage}</p>}
          {resultMessage && <p className="error-message">{resultMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
