import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function myHandle(req, res) {
    const {method} = req;
    await isAdminRequest(req, res);

    if(method === "GET"){
        await mongooseConnect();
        if(req.query?.id){
            res.json(await Product.findOne({_id:req.query.id}));
        }
        else{
            res.json(await Product.find());
        }
    }

    if(method === "POST"){
        await mongooseConnect();
        const {title, category, description, price, images, properties} = req.body;
        const productDoc = await Product.create({
            title, category: category || undefined, description, price, images, properties
        })
        res.json(productDoc);
    }

    if(method === "PUT"){
        const {title, category, description, price, images, _id, properties} = req.body;
        await Product.updateOne({_id}, {title, category: category || undefined, description, price, images, properties})
        res.json(true);
    }

    if(method === "DELETE"){
        if(req.query?.id){
            await Product.deleteOne({_id: req.query?.id})
            res.json(true)
        }
    }

}   