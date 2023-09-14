import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';


function Categories({ swal }) {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [parentCategory, setParentCateogory] = useState("");
    const [editedCategory, setEditedCategory] = useState(null);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    async function saveNewCategory(ev) {
        ev.preventDefault();

        setIsLoading(true);
        const data = { 
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(',')
            }))
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }
        else {
            await axios.post('/api/categories', data);
        }
        setName("");
        fetchCategories();
        setIsLoading(false);
        setProperties([]);
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCateogory(category.parent?._id);
        setProperties(
            category.properties.map(({name, values}) => ({
                name,
                values: values.join(','),
            }))
        )
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you Sure',
            text: `Do you want to delete "${category.name}" Category ?`,
            showCancelButton: true,
            confirmButtonColor: "#d55",
            confirmButtonText: "Yes Delete!",
            reverseButtons: true,

        }).then(async result => {
            // when confirmed and promise resolved...
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: "", values: "" }];
        })
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label
                htmlFor="categoryName"
                className=" text-lg">
                {editedCategory ? `Edit Category "${editedCategory.name}"` : "Add New Category"}
            </label>
            <form onSubmit={saveNewCategory} className="">
                <div className="flex gap-1">
                    <input onChange={e => setName(e.target.value)} value={name} className="" type="text" id="categoryName" placeholder="Category name" />

                    <select onChange={e => setParentCateogory(e.target.value)} value={parentCategory} className="">
                        <option value="">No Parent Category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block">Properities</label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className="btn-default text-sm mb-1">
                        Add new Property
                    </button>
                    {properties?.length > 0 && properties.map((property, index) => (
                        <div className="flex bg-[#E5E7EB] gap-1 p-2 rounded-lg mt-1">
                            <input
                                className="mb-0"
                                onChange={e => handlePropertyNameChange(index, property, e.target.value)}
                                type="text"
                                value={property.name}
                                placeholder="Property Name" />

                            <input
                                className="mb-0"
                                onChange={e => handlePropertyValuesChange(index, property, e.target.value)}
                                type="text"
                                value={property.values}
                                placeholder='comma "," separated Values' />

                            <button
                                type="button"
                                onClick={() => removeProperty(index)}
                                className="btn-default">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {editedCategory && (
                    <button
                    onClick={() => {
                        setEditedCategory(null);
                        setName("");
                        setParentCateogory("");
                        setProperties([]);
                    }}
                        type="button"
                        className="btn-default mr-2">
                        Cancel
                    </button>
                )}

                <button type="submit" className="btn-primary">Save</button>
            </form>
            {!editedCategory && (
                <table className="my-table">
                    <thead>
                        <tr>
                            <td>Category Name</td>
                            <td>Parent Category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button
                                        onClick={() => { editCategory(category) }}
                                        className="ml-2 font-semibold text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-md">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category)}
                                        className="ml-2 font-semibold text-sm text-red-600  bg-red-200 px-3 py-1 rounded-md">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {isLoading && (
                            <div className="">
                                <Spinner />
                            </div>
                        )}
                    </tbody>
                </table>
            )}


        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
))