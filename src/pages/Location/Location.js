import React, {useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useApp} from '../../contexts/AppContext';
import {ArrowLeftIcon} from '../../components/Icons';
import CharacterCard from '../../components/Cards/CharacterCard';
import GhostLoader from '../../components/GhostLoader/GhostLoader';
import './Location.css';

import {motion} from 'framer-motion';

const Location = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {location, locationLoading, loadLocation, error} = useApp();

    useEffect(() => {
        if (id) {
            loadLocation(id);
        }
    }, [id]);

    useEffect(() => {
        if (location) {
            document.title = `${location.name} - Rick and Morty`;
        }
    }, [location]);

    if (error) {
        return (
            <div className="location-404">
                <div style={{textAlign: 'center', padding: '60px 20px'}}>
                    <h1 style={{fontSize: '48px', marginBottom: '16px', color: '#081F32'}}>404</h1>
                    <p style={{fontSize: '20px', marginBottom: '24px', color: '#6E798C'}}>Location not found</p>
                    <p style={{fontSize: '16px', marginBottom: '32px', color: '#8E8E93'}}>
                        The location you're looking for doesn't exist or may have been removed.
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
                        Back to Locations
                    </Link>
                </div>
            </div>
        );
    }

    if (locationLoading || !location) {
        return (
            <div className="location-loading">
                <Link to="#"
                      onClick={e => {
                          e.preventDefault();
                          navigate(-1);
                      }} className="go-back__button">
                    <ArrowLeftIcon/>
                    Go back
                </Link>

                <div className="location-info__block">
                    <div className="location-name-ghost"></div>
                    <div className="location__info">
                        <div>
                            <p className="column__item-title">Type</p>
                            <div className="location-info-ghost"></div>
                        </div>
                        <div>
                            <p className="column__item-title">Dimension</p>
                            <div className="location-info-ghost"></div>
                        </div>
                    </div>
                </div>

                <p className="main__content-title">Residents</p>
                <div className="main__content">
                    <GhostLoader type="character" count={6}/>
                </div>
            </div>
        );
    }

    return (
        <div className="location-detail">
            <Link to="#"
                  onClick={e => {
                      e.preventDefault();
                      navigate(-1);
                  }} className="go-back__button">
                <ArrowLeftIcon/>
                Go back
            </Link>

            <div className="location-info__block">
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.2, delay: 0.05}}>
                    <p className="location__name">{location.name}</p>
                </motion.div>
                <div className="location__info">
                    <div>
                        <p className="column__item-title">Type</p>
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}}
                                    transition={{duration: 0.2, delay: 0.05}}>
                            <p className="column__item-value">{location.type}</p>
                        </motion.div>
                    </div>
                    <div>
                        <p className="column__item-title">Dimension</p>
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}}
                                    transition={{duration: 0.2, delay: 0.05}}>
                            <p className="column__item-value">{location.dimension}</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <p className="main__content-title">Residents</p>
            <div className="main__content">
                {location.residentDetails && location.residentDetails.length > 0 ? (
                    location.residentDetails.map((resident, index) => (
                        <motion.div
                            key={resident.id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.2, delay: (index % 20) * 0.05}}
                        >
                            <CharacterCard
                                character={resident}
                                fromPage="location"
                                fromId={location.id}
                            />
                        </motion.div>

                    ))
                ) : (
                    <div className="no-residents-state">
                        <p style={{fontSize: '18px', marginBottom: '8px'}}>No residents found</p>
                        <p style={{fontSize: '14px'}}>This location doesn't have any known residents.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Location;
