import React from 'react';
import {useNavigate} from 'react-router-dom';
import './LocationCard.css';

const LocationCard = ({location}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/location/${location.id}`);
    };

    return (
        <div className="location__card" onClick={handleClick}>
            <div className="location-card__content">
                <p className="location-card__title">{location.name}</p>
                <p className="location-card__desc">{location.type}</p>
            </div>
        </div>
    );
};

export default LocationCard;
