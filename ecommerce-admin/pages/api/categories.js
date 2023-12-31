import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await isAdminRequest(req, res);

    if(method === "GET"){
        await mongooseConnect();
        res.json(await Category.find().populate('parent'));
    }

    if(method === "PUT"){
        await mongooseConnect();
        const { name, parentCategory, properties, _id } = req.body;
        const categoryDoc = await Category.updateOne({_id}, {
            name,
            parent: parentCategory || undefined,
            properties,
            _id,
        });
        res.json(categoryDoc);
    }

    if(method === "DELETE"){
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json("Ok");
    }

    if(method === "POST"){
        await mongooseConnect();
        const { name, parentCategory, properties } = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || undefined,
            properties,
        });
        res.json(categoryDoc);
    }
}