import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

const LISTINGS_URL = process.env.FETCH_LISTINGS_URL;
const apiUrl = process.env.API_URL;

const EditarAnuncio = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [newImages, setNewImages] = useState([]);
    const [imagesRemove, setImagesRemove] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [toggleStatus, setToggleStatus] = useState(true);
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchListingById = async () => {
            try {
                const response = await axios.get(`${LISTINGS_URL}/${id}`, {
                    withCredentials: true
                });

                setListing(response.data);
                setToggleStatus(response.data.status);

            } catch (err) {
                if (!err?.response) {
                    console.log('No Server Response');
                } else if (err.response?.status === 404) {
                    console.log('Anuncio not found');
                } else {
                    console.log('Failed to fetch anuncio');
                }
            }
        };

        fetchListingById();
    }, [id]);

    const handleToggleChange = () => {
        setToggleStatus(!toggleStatus);
        setListing({ ...listing, status: !toggleStatus ? 'available' : 'unavailable' });
    };

    const handleRemoverImagem = (image) => {
        setImagesRemove([...imagesRemove, image]);
        setListing({ ...listing, images: listing.images.filter(img => img !== image) });
    };

    const handleNovasImagens = (e) => {
        const files = Array.from(e.target.files);

        const newFiles = files.filter(file => 
            !newImages.some(existingFile => 
                existingFile.name === file.name && existingFile.size === file.size
            )
        );

        if (newFiles.length < files.length) {
            console.log('A imagem selecionada é duplicada.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setNewImages(prevImages => [...prevImages, ...newFiles]);

        const imagePreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prevPreviews => [...prevPreviews, ...imagePreviews]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeletePreviewImgs = (index)=> {
        setNewImages(prevImages => prevImages.filter((_, i) => i !== index));
        setPreviewImages(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        newImages.forEach(file => {
            formData.append('images', file);
        });

        const updatedData = { ...listing, imagesRemove, status: toggleStatus ? 'available' : 'unavailable' };

        formData.append('data', JSON.stringify(updatedData));

        try {
            const response = await axios.put(`${LISTINGS_URL}/${id}`, formData, {
                withCredentials: true
            });

            console.log(response.data);
            navigate('/');
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else if (err.response?.status === 400) {
                console.log(err.response.data.message || 'Missing or invalid fields');
            } else if (err.response?.status === 401) {
                console.log('Unauthorized');
            } else {
                console.log('Update Failed');
            }
        }
    };

    if (!listing) return <div>Loading...</div>;

    const { title, description, rent, rooms, location, status } = listing;

    return (
        <div className="flex flex-col items-center md:pb-5 lg:pb-5">
            <div className="w-full sm:w-full md:w-9/12 lg:w-9/12 xl:w-9/12 bg-neutral-100 md:rounded-lg lg:rounded-lg p-8 flex flex-col sm:mt-0 md:mt-5 lg:mt-5 xl:mt-5 ">        
            <h2 className="text-3xl text-gray-900 font-medium mb-5">Editar Anúncio</h2>
                {listing ? (
                    <form onSubmit={handleSubmit}>

                            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                                <div className='relative mb-4'>
                                    <label htmlFor="title" className="leading-7 text-gray-600">Título</label>
                                    <input
                                        type="text"
                                        id="title"
                                        onChange={(e) => setListing({ ...listing, title: e.target.value })}
                                        value={title}
                                        required
                                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"
                                    />
                                </div>

                                <div className='relative mb-4'>
                                    <label htmlFor="rent" className="leading-7 text-gray-600">Renda</label>
                                    <input
                                        type='number'
                                        id="rent"
                                        onChange={(e) => setListing({ ...listing, rent: e.target.value })}
                                        value={rent}
                                        required
                                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"
                                    />
                                </div>
                            </div>

                            <div className='relative mb-4'>
                                <label htmlFor="description" className="leading-7 text-gray-600">Descrição</label>
                                <textarea
                                    id="description"
                                    onChange={(e) => setListing({ ...listing, description: e.target.value })}
                                    value={description}
                                    required
                                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"
                                />
                            </div>

                            <div className='grid md:grid-cols-[1fr_5fr] md:gap-4 grid-cols-1'>
                                <div className='relative mb-4'>
                                    <label htmlFor="rooms" className="leading-7 text-gray-600">Tipologia</label>
                                    <select
                                        id="rooms"
                                        onChange={(e) => setListing({ ...listing, rooms: e.target.value })}
                                        value={rooms}
                                        required
                                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-2.5 pl-2 leading-8 transition-colors duration-200 ease-in-outS"
                                    >
                                        <option value="">Tipologia</option>
                                        <option value="T0">T0</option>
                                        <option value="T1">T1</option>
                                        <option value="T2">T2</option>
                                        <option value="T3">T3</option>
                                        <option value="T4">T4</option>
                                        <option value="T5+">T5+</option>    
                                    </select>
                                </div>

                                <div className='relative mb-4'>
                                    <label htmlFor="location" className="leading-7 text-gray-600">Localizacao</label>
                                    <input
                                        type="text"
                                        id="location"
                                        onChange={(e) => setListing({ ...listing, location: e.target.value })}
                                        value={location}
                                        required
                                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"
                                    />
                                </div>
                            </div>
                            

                            <div className='relative mb-4 flex flex-col'>
                                <label htmlFor="imagens" className='text-gray-900 text-xl font-medium border-b mb-4'>Imagens</label>
                                <div className='flex flex-wrap gap-4'>
                                {listing.images.map((image, index) => (
                                    <div key={index} className='relative w-32 h-32'>
                                        <img src={`${apiUrl}${image}`} alt={`Imagem ${index}`} className='w-full h-full object-cover rounded' />
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoverImagem(image)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                                        >
                                            <FaTimes size={16} />    
                                        </button>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <div className='relative mb-4 flex flex-col'>
                                <label htmlFor='newImages' className='text-gray-900 text-xl font-medium border-b'>Adicionar Imagens</label>
                                <input 
                                    type="file" 
                                    id="images"
                                    ref={fileInputRef}
                                    multiple 
                                    onChange={handleNovasImagens} 
                                    className='mt-3 mb-4'
                                />

                                <div className='flex flex-wrap gap-4'>
                                        {previewImages.map((src, index) => (
                                            <div key={index} className="relative w-32 h-32">
                                                <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePreviewImgs(index)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                                                >
                                                    <FaTimes size={16} />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className='relative mb-4'>                    
                                <div className='flex flex-col items-end'>
                                    <Toggle
                                        id='status'
                                        checked={toggleStatus}
                                        onChange={handleToggleChange}
                                        className={`${toggleStatus ? 'bg-green-500' :  'bg-red-500'}`}
                                    />
                                    <div className="mt-1 text-sm tracking-wider text-gray-500">{toggleStatus ? 'Disponível' : 'Indisponível'}</div>
                                </div>
                            </div>

                            <div className='flex md:flex-row flex-col-reverse gap-2 md:justify-between'>
                                <Link to='/'>
                                    <div className="text-white bg-red-600 border-0 py-2 px-8 focus:outline-none hover:bg-red-700 rounded text-lg text-center">Cancelar</div>
                                </Link>
                                <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg ">Salvar</button>
                            </div>
                    </form>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default EditarAnuncio;
