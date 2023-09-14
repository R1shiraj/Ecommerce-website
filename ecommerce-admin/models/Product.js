const { Schema, model, models, default: mongoose } = require("mongoose");

const ProductSchema = new Schema({
    title: {type: String, required: true},
    category: {type: mongoose.Types.ObjectId, ref:'Category'},
    description: {type: String},
    price: {type: Number, required: true},
    images: {type: [String]},
    properties: {type: Object},
})

export const Product = models.Product || model('Product', ProductSchema);