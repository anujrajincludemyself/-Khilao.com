import React from 'react'
import profileImg from '../assets/profile.png'
import food from '../assets/foodRecipe.png'
import { useLoaderData } from 'react-router-dom'

// ✅ add this line
const BASE_URL = "https://khilao-com.onrender.com";

export default function RecipeDetails() {
  const recipe = useLoaderData()
  console.log(recipe)

  return (
    <>
      <div className='outer-container'>
        <div className='profile'>
          <img src={profileImg} width="50px" height="50px" />
          <h5>{recipe.email}</h5>
        </div>

        <h3 className='title'>{recipe.title}</h3>

        {/* ✅ changed ONLY this line */}
        <img
          src={`${BASE_URL}/images/${recipe.coverImage}`}
          width="220px"
          height="200px"
        />

        <div className='recipe-details'>
          <div className='ingredients'>
            <h4>Ingredients</h4>
            <ul>
              {recipe.ingredients.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className='instructions'>
            <h4>Instructions</h4>
            <span>{recipe.instructions}</span>
          </div>
        </div>
      </div>
    </>
  )
}
