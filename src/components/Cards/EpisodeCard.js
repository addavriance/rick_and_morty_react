import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EpisodeCard.css';

const EpisodeCard = ({ episode, fromPage = 'episodes', fromId = null }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/episode/${episode.id}`);
    };

    return (
        <div className="episode__card" onClick={handleClick}>
            <div className="episode-card__content">
                <p className="episode-card__title">{episode.name}</p>
                <p className="episode-card__desc">{episode.air_date}</p>
                <p className="episode-card__index">{episode.episode}</p>
            </div>
        </div>
    );
};

export default EpisodeCard;
