import React, { createContext, useState, useContext } from 'react';

const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
    const [photoURL, setPhotoURL] = useState(null);

    return (
        <PhotoContext.Provider value={{ photoURL, setPhotoURL }}>
            {children}
        </PhotoContext.Provider>
    );
};

export const usePhoto = () => {
    return useContext(PhotoContext);
};