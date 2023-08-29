import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || "");
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price };
        if (_id) {
            //UPDATE
            await axios.put('/api/products', { ...data, _id })
        }
        else {
            //CREATE
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev){
        const files = ev.target?.files;
        if(files?.length > 0){
            const data = new FormData();
            for(const file of files){
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            console.log(res.data)
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label htmlFor="productName">Product Name</label>
            <input value={title}
                onChange={e => setTitle(e.target.value)}
                id="productName" type="text" placeholder="Product name" />

            <label htmlFor="productPhotos">Photos</label>
            <div className="mb-2">
                <label id="productPhotos" className="cursor-pointer w-24 h-24 text-center flex items-center justify-center gap-1 text-gray-600 hover:text-black hover:bg-gray-400 rounded-lg bg-gray-300 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input onChange={uploadImages} type="file" className="hidden"/>
                </label>
                {!images && (
                    <div className="">
                        No photos for this Product.
                    </div>
                )}
            </div>

            <label htmlFor="description">Description</label>
            <textarea value={description}
                onChange={e => setDescription(e.target.value)}
                id="description" placeholder="Description"></textarea>

            <label htmlFor="price">Price in INR</label>
            <input value={price}
                onChange={e => setPrice(e.target.value)}
                id="price" type="number" placeholder="Price (₹)" />

            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
}