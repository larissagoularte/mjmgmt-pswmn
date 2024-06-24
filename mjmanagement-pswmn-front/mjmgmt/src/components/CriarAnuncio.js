import React, { useContext, useState, useRef } from 'react';
import AuthContext from '../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { FaTimes } from "react-icons/fa";
import Toggle from 'react-toggle';
import "react-toggle/style.css";

const CREATE_LISTING_URL = process.env.CREATE_LISTING_URL;

const CriarAnuncio = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [rooms, setRooms] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState(true);
    const [rent, setRent] = useState('');
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [errMsg, setErrMsg] = useState('');

    const fileInputRef = useRef(null);

    const handleImagemChange = (e) => {
        const files = Array.from(e.target.files);

        const newFiles = files.filter(file => 
            !images.some(existingFile => 
                existingFile.name === file.name && existingFile.size === file.size
            )
        );

        if (newFiles.length < files.length) {
            setErrMsg('A imagem selecionada é duplicada.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        } else {
            console.log('');
        }

        setImages(prevImages => [...prevImages, ...files]);

        const imagePreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prevPreviews => [...prevPreviews, ...imagePreviews]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setPreviewImages(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('rooms', rooms);
        formData.append('location', location);
        formData.append('rent', rent);
        formData.append('status', status ? 'available' : 'unavailable');

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            const response = await axios.post(CREATE_LISTING_URL, formData, {
                withCredentials: true
            });

            console.log(response.data);
            navigate('/');
        } catch(err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg(err.response.data.message || 'Dados inválidos.');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Creation Failed');
            }
        }
    }
  return (
    <div className="flex flex-col items-center">
        <div className="w-full sm:w-full md:w-10/12 lg:w-10/12 xl:w-6/12 bg-neutral-100 md:rounded-lg lg:rounded-lg p-8 flex flex-col sm:mt-0 md:mt-10 lg:mt-10 xl:mt-10">        
            <h2 className="text-3xl text-gray-900 font-medium mb-5">Criar Anúncio</h2>

            <form onSubmit={handleSubmit}>

                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                    <div className='relative mb-4'>
                        <label htmlFor="title" className="leading-7 text-gray-600">Título</label>
                        <input
                            type="text"
                            id="title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            required
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"
                        />
                    </div>

                    <div className='relative mb-4'>
                        <label htmlFor="rent" className="leading-7 text-gray-600">Renda</label>
                        <input
                            type="number"
                            id="rent"
                            onChange={(e) => setRent(e.target.value)}
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
                        onChange={(e) => setDescription(e.target.value)}
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
                            onChange={(e) => setRooms(e.target.value)}
                            value={rooms}
                            required
                            className="w-full pr-2 bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-2.5 pl-2 leading-8 transition-colors duration-200 ease-in-outS"

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
                        <label htmlFor="location" className="leading-7 text-gray-600">Localização</label>
                        <input
                            type="text"
                            id="location"
                            onChange={(e) => setLocation(e.target.value)}
                            value={location}
                            required
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-outS"

                        />
                    </div>
                </div>


                <div className='relative mb-4 flex flex-col'>
                    <label htmlFor="images" className='text-gray-900 text-xl font-medium border-b'>Imagens</label>
                    <input
                        type="file"
                        id="images"
                        ref={fileInputRef}
                        onChange={handleImagemChange}
                        multiple
                        className='mt-3 mb-4'
                    />

                    <div className='flex flex-wrap gap-4'>
                        {previewImages.map((src, index) => (
                            <div key={index} className="relative w-32 h-32">
                                    <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>
                        ))}
                    </div>
                </div>

                <div className='relative mb-4'>                    
                    <div className=''>
                        <div className='flex flex-col items-end'>

                            <Toggle 
                                id='status'
                                checked={status}
                                onChange={() => setStatus(!status)}
                                className={`${status ? 'bg-green-500' :  'bg-red-500'}`}
                            />

                            <div className="mt-1 text-sm tracking-wider text-gray-500">{status ? 'Disponível' : 'Indisponível'}</div>
                        </div>
                    </div>
                </div>
                <div className='flex md:flex-row flex-col-reverse gap-2 md:justify-between'>
                    <Link to='/'>
                        <div className="text-white bg-red-600 border-0 py-2 px-8 focus:outline-none hover:bg-red-700 rounded text-lg text-center">Cancelar</div>
                    </Link>
                    <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg ">Adicionar</button>
                </div>
            </form>
            {errMsg && <p className="text-red-500 text-center mt-2">{errMsg}</p>}
        </div>
    </div>
  )
}

export default CriarAnuncio