import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './CharacterCard.css';

const CharacterCard = ({character, fromPage = 'characters', fromId = null}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    const handleClick = () => {
        navigate(`/character/${character.id}`);
    };

    return (
        <div className="character__card" onClick={handleClick}>
            <div className="card__image-box">
                {!imageLoaded && (
                    <div className="image-ghost-loader"></div>
                )}
                <img
                    src={character.image}
                    alt={character.name}
                    loading="lazy"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                        opacity: imageLoaded ? 1 : 0,
                        backgroundColor: imageError ? '#f0f0f0' : 'transparent'
                    }}
                />
            </div>
            <div className="character-card__content">
                <p className="character-card__title">{character.name}</p>
                <p className="character-card__desc">{character.species}</p>
            </div>
        </div>
    );
};

export default CharacterCard;
