const express=require("express")
const { getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,toggleLikeRecipe,upload} = require("../controller/recipe")
const { getAiRecipe, getAiRecipesHistory, deleteAiRecipeHistory } = require('../controller/aiRecipe')
const verifyToken = require("../middleware/auth")
const router=express.Router()

router.get("/",verifyToken,getRecipes) //Get all recipes (protected)
router.get('/ai-history', verifyToken, getAiRecipesHistory) // User's AI generated recipes
router.post('/ai-generate', verifyToken, getAiRecipe) // Protected AI recipe generation
router.delete('/ai-history/:id', verifyToken, deleteAiRecipeHistory) // Delete own AI recipe history item
router.patch('/:id/like', verifyToken, toggleLikeRecipe) // Toggle like on recipe
router.get("/:id",verifyToken,getRecipe) //Get recipe by id (protected)
router.post("/",upload.single('file'),verifyToken ,addRecipe) //add recipe
router.put("/:id",upload.single('file'),verifyToken,editRecipe) //Edit recipe (protected)
router.delete("/:id",verifyToken,deleteRecipe) //Delete recipe (protected)

module.exports=router