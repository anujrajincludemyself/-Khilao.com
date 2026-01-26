const mongoose=require("mongoose")

const recipeSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    ingredients:{
        type:Array,
        required:true
    },
    instructions:{
        type:String,
        required:true
    },
    time:{
        type:String,
    },
    coverImage:{
        type:String,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

// Add indexes for better query performance
recipeSchema.index({ createdBy: 1, createdAt: -1 })
recipeSchema.index({ createdAt: -1 })
recipeSchema.index({ title: 'text' }) // For text search

module.exports=mongoose.model("Recipes",recipeSchema)