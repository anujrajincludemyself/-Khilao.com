const mongoose = require('mongoose')

const aiRecipeHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    query: {
      dishDescription: { type: String, required: true },
      dietary: { type: String, default: 'none' },
      servings: { type: String, default: '2' }
    },
    recipe: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
)

aiRecipeHistorySchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('AIRecipeHistory', aiRecipeHistorySchema)
