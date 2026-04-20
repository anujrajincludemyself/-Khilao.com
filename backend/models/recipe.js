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
    isPublic: {
        type: Boolean,
        default: true
    },
    isAIGenerated: {
        type: Boolean,
        default: false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    likesCount: {
        type: Number,
        default: 0
    }

},{timestamps:true})

// Add indexes for better query performance
recipeSchema.index({ createdBy: 1, createdAt: -1 })
recipeSchema.index({ createdAt: -1 })
recipeSchema.index({ title: 'text' }) // For text search
recipeSchema.index({ likesCount: -1 })

module.exports=mongoose.model("Recipes",recipeSchema)