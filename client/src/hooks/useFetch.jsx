import { useEffect, useState } from 'react';

const APIKEY = import.meta.env.VITE_GIPHY_API;

const useFetch = ({ keyword, url }) => {
    const [gifUrl, setGifUrl] = useState('');

    useEffect(() => {
        const fetchGifs = async () => {
            try {
                if (keyword) {
                    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${keyword.split(' ').join('')}&limit=1`);
                    const { data } = await response.json();

                    setGifUrl(data[0]?.images?.downsized_medium?.url);
                } else {
                    if (!url) {
                        setGifUrl('https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284');
                    }
                    setGifUrl(url);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchGifs();
    }, [keyword]);

    return gifUrl;
};

export default useFetch;
