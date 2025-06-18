import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useApp} from '../../contexts/AppContext';
import {ArrowLeftIcon, ChevronRightIcon} from '../../components/Icons';
import './Character.css';

import {motion} from 'framer-motion';

const Character = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {character, characterLoading, loadCharacter, error} = useApp();
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (id) {
            loadCharacter(id);
            setImageLoaded(false);

            if (character) {
                document.title = `${character.name} - Rick and Morty`;
            }
        }
    }, [id]);

    const handleLocationClick = () => {
        if (character?.location?.url) {
            const locationId = character.location.url.split('/').pop();
            navigate(`/location/${locationId}`);
        }
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    if (error) {
        return (
            <div className="character-404">
                <div style={{textAlign: 'center', padding: '60px 20px'}}>
                    <h1 style={{fontSize: '48px', marginBottom: '16px', color: '#081F32'}}>404</h1>
                    <p style={{fontSize: '20px', marginBottom: '24px', color: '#6E798C'}}>Character not found</p>
                    <p style={{fontSize: '16px', marginBottom: '32px', color: '#8E8E93'}}>
                        The character you're looking for doesn't exist or may have been removed.
                    </p>
                    <Link
                        to="#"
                        onClick={e => {
                            e.preventDefault();
                            navigate(-1);
                        }}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-500)',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '1.25px',
                            fontSize: '14px',
                            boxShadow: '0 3px 4px 0 rgba(34, 60, 80, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <ArrowLeftIcon width={16} height={16}/>
                        Back
                    </Link>
                </div>
            </div>
        );
    }

    if (characterLoading || !character) {
        return (
            <div className="character-loading">
                <Link to="#"
                      onClick={e => {
                          e.preventDefault();
                          navigate(-1);
                      }} className="go-back__button">
                    <ArrowLeftIcon/>
                    Go back
                </Link>

                <div className="character__info-title">
                    <div className="avatar-ghost-loader"></div>
                    <div className="name-ghost-loader"></div>
                </div>

                <div className="character__info-body">
                    <div className="character-column__information">
                        <p className="character-column__title">Informations</p>
                        <div className="column__content">
                            {Array.from({length: 6}, (_, i) => (
                                <div key={i} className="information-ghost-item">
                                    <div className="ghost-title"></div>
                                    <div className="ghost-value"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="character-column__episodes">
                        <p className="character-column__title">Episodes</p>
                        <div className="column__content">
                            {Array.from({length: 3}, (_, i) => (
                                <div key={i} className="episode-ghost-item">
                                    <div className="ghost-title"></div>
                                    <div className="ghost-value"></div>
                                    <div className="ghost-date"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const informationItems = [
        {title: 'Gender', value: character.gender},
        {title: 'Status', value: character.status},
        {title: 'Specie', value: character.species},
        {title: 'Origin', value: character.origin?.name || 'Unknown'},
        {title: 'Type', value: character.type || 'Unknown'},
        {
            title: 'Location',
            value: character.location?.name || 'Unknown',
            hasLink: !!character.location?.url
        }
    ];

    return (
        <div className="character-detail">
            <Link to="#"
                  onClick={e => {
                      e.preventDefault();
                      navigate(-1);
                  }} className="go-back__button">
                <ArrowLeftIcon/>
                Go back
            </Link>

            <div className="character__info-title">
                <div className="character-avatar-container">
                    {!imageLoaded && <div className="avatar-ghost-loader"></div>}
                    <img
                        src={character.image}
                        alt={character.name}
                        className="character__avatar"
                        onLoad={handleImageLoad}
                        style={{opacity: imageLoaded ? 1 : 0}}
                    />
                </div>
                <p className="character__name">{character.name}</p>
            </div>

            <div className="character__info-body">
                <div className="character-column__information">
                    <p className="character-column__title">Informations</p>
                    <div className="column__content">
                        {informationItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.2, delay: index * 0.05}}
                                className="column__item"
                            >
                                <div className="column__item-wrapper">
                                    <div className="column__item-title">{item.title}</div>
                                    <div className="column__item-value">{item.value}</div>
                                </div>
                                {item.hasLink && (
                                    <button className="go-to__button" onClick={handleLocationClick}>
                                        <ChevronRightIcon className="go-to__icon"/>
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="character-column__episodes">
                    <p className="character-column__title">Episodes</p>
                    <div className="column__content">
                        {character.episodeDetails && character.episodeDetails.length > 0 ? (
                            character.episodeDetails.map((episode, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.2, delay: index * 0.05}}
                                    className="column__item"
                                >
                                    <div className="column__item-wrapper">
                                        <div className="column__item-title">{episode.episode}</div>
                                        <div className="column__item-value">{episode.name}</div>
                                        <div className="column__item-date">{episode.air_date}</div>
                                    </div>
                                    <button
                                        className="go-to__button"
                                        onClick={() => navigate(`/episode/${episode.id}`)}
                                    >
                                        <ChevronRightIcon className="go-to__icon"/>
                                    </button>
                                </motion.div>
                            ))
                        ) : (
                            <div className="column__item">
                                <div className="column__item-wrapper">
                                    <div className="column__item-title">No episodes found</div>
                                    <div className="column__item-value">This character doesn't appear in any episodes
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Character;
