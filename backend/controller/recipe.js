const Recipes=require("../models/recipe")
const multer  = require('multer')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + '-' + file.fieldname
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

const getRecipes=async(req,res)=>{
    const recipes=await Recipes.find()
    return res.json(recipes)
}

const getRecipe=async(req,res)=>{
    const recipe=await Recipes.findById(req.params.id)
    res.json(recipe)
}

const addRecipe=async(req,res)=>{
    try {
        console.log('Add recipe request:', {
            body: req.body,
            file: req.file,
            user: req.user
        })
        
        const {title,ingredients,instructions,time}=req.body 

        if(!title || !ingredients || !instructions) {
            return res.status(400).json({error:"Required fields can't be empty"})
        }

        if(!req.file) {
            return res.status(400).json({error:"Recipe image is required"})
        }

        // Handle ingredients - if it comes as a string, convert to array
        let ingredientsList = ingredients
        if (typeof ingredients === 'string') {
            ingredientsList = ingredients.split(',').map(item => item.trim()).filter(item => item)
        } else if (Array.isArray(ingredients)) {
            ingredientsList = ingredients.filter(item => item && item.trim())
        }

        const newRecipe=await Recipes.create({
            title,
            ingredients: ingredientsList,
            instructions,
            time,
            coverImage: req.file.filename,
            createdBy: req.user.id
        })
        
        console.log('Recipe created successfully:', newRecipe)
        return res.status(201).json(newRecipe)
    } catch (error) {
        console.error('Error adding recipe:', error)
        return res.status(500).json({error: 'Failed to add recipe'})
    }
}

const editRecipe=async(req,res)=>{
    try {
        console.log('Edit recipe request:', {
            body: req.body,
            file: req.file,
            params: req.params.id
        })
        
        const {title,ingredients,instructions,time}=req.body 
        let recipe=await Recipes.findById(req.params.id)

        if(!recipe){
            return res.status(404).json({error:"Recipe not found"})
        }

        // Handle ingredients - if it comes as a string, convert to array
        let ingredientsList = ingredients
        if (typeof ingredients === 'string') {
            ingredientsList = ingredients.split(',').map(item => item.trim()).filter(item => item)
        } else if (Array.isArray(ingredients)) {
            ingredientsList = ingredients.filter(item => item && item.trim())
        } else {
            ingredientsList = recipe.ingredients // Keep existing if not provided
        }

        let coverImage = req.file?.filename ? req.file?.filename : recipe.coverImage
        
        const updatedRecipe = await Recipes.findByIdAndUpdate(
            req.params.id,
            {
                title: title || recipe.title,
                ingredients: ingredientsList,
                instructions: instructions || recipe.instructions,
                time: time || recipe.time,
                coverImage
            },
            {new: true}
        )
        
        console.log('Recipe updated successfully:', updatedRecipe)
        return res.status(200).json(updatedRecipe)
    }
    catch(err){
        console.error('Error updating recipe:', err)
        return res.status(500).json({error: err.message || "Failed to update recipe"})
    }
    
}

const deleteRecipe=async(req,res)=>{
    try{
        console.log('Delete recipe request:', req.params.id)
        const recipe = await Recipes.findById(req.params.id)
        
        if(!recipe){
            return res.status(404).json({error:"Recipe not found"})
        }
        
        await Recipes.deleteOne({_id:req.params.id})
        console.log('Recipe deleted successfully')
        return res.status(200).json({status:"ok", message: "Recipe deleted successfully"})
    }
    catch(err){
        console.error('Error deleting recipe:', err)
        return res.status(500).json({error: err.message || "Failed to delete recipe"})
    }
}

module.exports={getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload}