import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { MdDelete, MdPlace } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const FETCH_LISTINGS_URL = process.env.FETCH_LISTINGS_URL;
const apiUrl = process.env.API_URL;

const Home = () => {
    const { auth } = useContext(AuthContext);
    const [listings, setListings] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    const truncateDescricao = (description, maxLength) => {
        if (description.length <= maxLength) {
            return description;
        } else {
            return description.slice(0, maxLength) + '...';
        }
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get(FETCH_LISTINGS_URL, {
                    withCredentials: true
                });

                
                setListings(response.data);

                const initialIndexes = {};

                response.data.forEach(listing => {
                    initialIndexes[listing._id] = 0;
                });
                setCurrentImageIndex(initialIndexes);

                console.log(response.data);
            } catch (err) {
                if (!err?.response) {
                    console.log('No Server Response');
                } else if (err.response?.status === 404) {
                    console.log('Listings not found');
                } else {
                    console.log('Failed to fetch anuncios');
                }
            }
        };

        fetchListings();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${FETCH_LISTINGS_URL}/${id}`, {
                withCredentials: true
            });

            setListings(listings.filter(listing => listing._id !== id));
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else if (err.response?.status === 403) {
                console.log('Nao autorizado');
            } else {
                console.log('Falha ao excluir anuncio');
            }
        }
    }

    const handlePrevImage = (listingId) => {
        setCurrentImageIndex(prevState => ({
            ...prevState,
            [listingId]: (prevState[listingId] - 1 + listings.find(a => a._id === listingId).images.length) % listings.find(a => a._id === listingId).images.length
        }));
    }

    const handleNextImage = (listingId) => {
        setCurrentImageIndex(prevState => ({
            ...prevState,
            [listingId]: (prevState[listingId] + 1) % listings.find(a => a._id === listingId).images.length
        }));
    }

    return (

        <div className="p-8 bg-gray-100 h-svh">
            <h2 className="text-3xl text-gray-900 font-bold mb-5">Meus Anúncios</h2>
            <Link to="/criar-anuncio">
                <button className='text-white bg-indigo-500 border-0 px-4 py-3 focus:outline-none hover:bg-indigo-600 rounded-lg text-xl font-medium mb-10'>Adicionar Anúncio</button>
            </Link>
        
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pb-5">
                {listings.length ? (
                    listings.map((listing) => (
                        <div key={listing._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col min-w-lg">
                            <div className="relative h-48 overflow-hidden">
                                {listing.images && listing.images.length > 0 && (
                                    <>
                                        <img src={`${apiUrl}${listing.images[currentImageIndex[listing._id]]}`} alt={`Imagem ${currentImageIndex[listing._id] + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-75 text-gray-800 px-2 py-1 rounded focus:outline-none hover:bg-opacity-100"
                                            onClick={() => handlePrevImage(listing._id)}
                                        >
                                            &lt;
                                        </button>
                                        <button
                                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-75 text-gray-800 px-2 py-1 rounded focus:outline-none hover:bg-opacity-100"
                                            onClick={() => handleNextImage(listing._id)}
                                        >
                                            &gt;
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="p-4 flex-grow">
                                <div className='flex justify-between items-center mb-2'>
                                    <h3 className="text-xl font-semibold ">
                                        <Link to={`/anuncios/${listing._id}`} className="text-indigo-500 hover:underline">{listing.title}</Link>
                                    </h3>
                                    <p className="text-gray-700 text-2xl font-bold">{listing.rent}€</p>
                                </div>
                                
                                <p className='text-gray-600 tracking-widest text-sm font-light '>DESCRIÇÃO</p>
                                <p className="text-gray-700 mb-4 min-h-16">{truncateDescricao(listing.description, 100)}</p>

                                <div className='flex justify-end'>
                                    <div className={`py-1 px-3 rounded-sm uppercase ${listing.status === 'available' ? 'text-green-500 bg-green-50 text-xs font-medium tracking-widest' : 'text-red-500 bg-red-50 text-xs font-medium tracking-widest'}`}>{listing.status === 'available' ? 'Disponível' : 'Indisponível'}</div>
                                </div>
                            </div>

                            <div className="p-4 pt-0 flex justify-between">
                                <button
                                    className="bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(listing._id)}
                                >
                                    <MdDelete size={24} />
                                </button>
                                <Link to={`/anuncios/${listing._id}/editar`}>
                                <div className="bg-indigo-500 text-white py-2 px-3 rounded hover:bg-indigo-600">
                                    <FaEdit size={24} />
                                </div>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum anúncio encontrado.</p>
                )}
            </div>
        </div>

    );
}

export default Home;