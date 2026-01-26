const Recipes=require("../models/recipe")
const { cloudinary, upload } = require('../config/cloudinary')

const getRecipes=async(req,res)=>{
    try {
        const limit = parseInt(req.query.limit) || 50
        const skip = parseInt(req.query.skip) || 0
        
        const recipes = await Recipes.find()
            .select('title ingredients instructions time coverImage createdBy createdAt')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean() // Convert to plain JS objects (faster)
        
        // Set cache headers
        res.set('Cache-Control', 'public, max-age=300') // Cache for 5 minutes
        return res.json(recipes)
    } catch(error) {
        console.error('Error fetching recipes:', error)
        return res.status(500).json({ error: 'Failed to fetch recipes' })
    }
}

const getRecipe=async(req,res)=>{
    try {
        const recipe = await Recipes.findById(req.params.id)
            .populate('createdBy', 'email') // Get user email in same query
            .lean()
        
        if(!recipe) {
            return res.status(404).json({ error: 'Recipe not found' })
        }
        
        // Set cache headers
        res.set('Cache-Control', 'public, max-age=600') // Cache for 10 minutes
        res.json(recipe)
    } catch(error) {
        console.error('Error fetching recipe:', error)
        return res.status(500).json({ error: 'Failed to fetch recipe' })
    }
}

const addRecipe=async(req,res)=>{
    try {
        console.log('=== Add recipe request ===')
        console.log('Body:', req.body)
        console.log('File:', req.file)
        console.log('User:', req.user)
        console.log('Headers:', req.headers.authorization)
        
        // Check if user is authenticated
        if(!req.user || !req.user.id) {
            console.error('Authentication failed: No user in request')
            return res.status(401).json({error:"Authentication required"})
        }
        
        const {title,ingredients,instructions,time}=req.body 

        // Validate required fields
        if(!title || !title.trim()) {
            return res.status(400).json({error:"Title is required"})
        }

        if(!ingredients) {
            return res.status(400).json({error:"Ingredients are required"})
        }

        if(!instructions || !instructions.trim()) {
            return res.status(400).json({error:"Instructions are required"})
        }

        if(!req.file) {
            return res.status(400).json({error:"Recipe image is required"})
        }

        // Handle ingredients - if it comes as a string, convert to array
        let ingredientsList = []
        if (typeof ingredients === 'string') {
            ingredientsList = ingredients.split(',').map(item => item.trim()).filter(item => item)
        } else if (Array.isArray(ingredients)) {
            ingredientsList = ingredients.filter(item => item && item.trim())
        }

        if(ingredientsList.length === 0) {
            return res.status(400).json({error:"At least one ingredient is required"})
        }

        const newRecipe=await Recipes.create({
            title: title.trim(),
            ingredients: ingredientsList,
            instructions: instructions.trim(),
            time: time?.trim() || '30min',
            coverImage: req.file.path, // Cloudinary URL
            createdBy: req.user.id
        })
        
        console.log('Recipe created successfully:', newRecipe)
        return res.status(201).json(newRecipe)
    } catch (error) {
        console.error('Error adding recipe:', error)
        console.error('Error stack:', error.stack)
        return res.status(500).json({
            error: 'Failed to add recipe',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
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

        let coverImage = recipe.coverImage
        
        // If new image uploaded, delete old one from Cloudinary and use new URL
        if (req.file) {
            // Extract public_id from old Cloudinary URL and delete
            if (recipe.coverImage && recipe.coverImage.includes('cloudinary')) {
                const publicId = recipe.coverImage.split('/').slice(-2).join('/').split('.')[0]
                await cloudinary.uploader.destroy('khao-khilao-recipes/' + publicId.split('/').pop())
            }
            coverImage = req.file.path // New Cloudinary URL
        }
        
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
                // Delete image from Cloudinary if it exists
        if (recipe.coverImage && recipe.coverImage.includes('cloudinary')) {
            const publicId = recipe.coverImage.split('/').slice(-2).join('/').split('.')[0]
            await cloudinary.uploader.destroy('khao-khilao-recipes/' + publicId.split('/').pop())
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