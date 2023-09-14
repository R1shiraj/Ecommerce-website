import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    category: existingCategory,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    properties: existingProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [category, setCategory] = useState(existingCategory || "");
    const [images, setImages] = useState(existingImages || []);
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || "");
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productProperties, setProductProperties] = useState(existingProperties || {});
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, [])

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, category, description, price, images, properties: productProperties };
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

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldLinks => {
                return [...oldLinks, ...res.data.links]
            })
            setIsUploading(false);
        }
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let CatInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...CatInfo.properties);
        while (CatInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === CatInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            CatInfo = parentCat;
        }
    }

    function setProductProps(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    return (
        <form onSubmit={saveProduct}>
            <label htmlFor="productName">Product Name</label>
            <input value={title}
                onChange={e => setTitle(e.target.value)}
                id="productName" type="text" placeholder="Product name" />

            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Uncategorized">Uncategorized</option>
                {categories?.length > 0 && categories.map(category => (
                    <option value={category._id}>{category.name}</option>
                ))}
            </select>

            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="">
                    <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                    <div>
                        <select
                            value={productProperties[p.name]}
                            onChange={e => setProductProps(p.name, e.target.value)}>
                            {p.values.map(v => (
                                <option value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable className="flex flex-wrap gap-2"
                    list={images} setList={im => setImages(im)}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white shadow-md p-4 border border-gray-200 rounded-md">
                            <img src={link} className="rounded-lg" alt="product-image" />
                        </div>
                    ))}
                </ReactSortable>

                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}

                <label className="cursor-pointer w-24 h-24 text-center flex items-center justify-center gap-1 text-primary hover:text-black hover:bg-gray-400 rounded-lg bg-white shadow-md border border-primary font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input onChange={uploadImages} type="file" className="hidden" />
                </label>
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