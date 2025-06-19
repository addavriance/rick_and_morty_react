import React from 'react';
import './GhostLoader.css';

const CharacterGhost = () => (
    <div className="character-card-ghost">
        <div className="character-card-ghost__image"></div>
        <div className="character-card-ghost__content">
            <div className="character-card-ghost__title"></div>
            <div className="character-card-ghost__desc"></div>
        </div>
    </div>
);

const LocationGhost = () => (
    <div className="location-card-ghost">
        <div className="location-card-ghost__content">
            <div className="location-card-ghost__title"></div>
            <div className="location-card-ghost__desc"></div>
        </div>
    </div>
);

const EpisodeGhost = () => (
    <div className="episode-card-ghost">
        <div className="episode-card-ghost__content">
            <div className="episode-card-ghost__title"></div>
            <div className="episode-card-ghost__desc"></div>
            <div className="episode-card-ghost__index"></div>
        </div>
    </div>
);

const GhostLoader = ({type, count = 6}) => {
    const renderGhost = () => {
        switch (type) {
            case 'character':
                return <CharacterGhost/>;
            case 'location':
                return <LocationGhost/>;
            case 'episode':
                return <EpisodeGhost/>;
            default:
                return <CharacterGhost/>;
        }
    };

    return (
        <>
            {Array.from({length: count}, (_, index) => (
                <React.Fragment key={index}>
                    {renderGhost()}
                </React.Fragment>
            ))}
        </>
    );
};

export default GhostLoader;
