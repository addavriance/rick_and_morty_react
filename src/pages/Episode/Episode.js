import React, {useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {useApp} from '../../contexts/AppContext';
import {ArrowLeftIcon} from '../../components/Icons';
import CharacterCard from '../../components/Cards/CharacterCard';
import GhostLoader from '../../components/GhostLoader/GhostLoader';
import './Episode.css';
import {motion} from "framer-motion";

const Episode = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {episode, episodeLoading, loadEpisode, error} = useApp();

    useEffect(() => {
        if (id) {
            loadEpisode(id);
        }

        if (episode) {
            document.title = `${episode.name} - Rick and Morty`;
        }
    }, [id]);

    if (error) {
        return (
            <div className="episode-404">
                <div style={{textAlign: 'center', padding: '60px 20px'}}>
                    <h1 style={{fontSize: '48px', marginBottom: '16px', color: '#081F32'}}>404</h1>
                    <p style={{fontSize: '20px', marginBottom: '24px', color: '#6E798C'}}>Episode not found</p>
                    <p style={{fontSize: '16px', marginBottom: '32px', color: '#8E8E93'}}>
                        The episode you're looking for doesn't exist or may have been removed.
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
                        Back to Episodes
                    </Link>
                </div>
            </div>
        );
    }

    if (episodeLoading || !episode) {
        return (
            <div className="episode-loading">
                <Link to="#"
                      onClick={e => {
                          e.preventDefault();
                          navigate(-1);
                      }} className="go-back__button">
                    <ArrowLeftIcon/>
                    Go back
                </Link>

                <div className="episode-info__block">
                    <div className="episode-name-ghost"></div>
                    <div className="episode__info">
                        <div>
                            <p className="column__item-title">Episode</p>
                            <div className="episode-info-ghost"></div>
                        </div>
                        <div>
                            <p className="column__item-title">Date</p>
                            <div className="episode-info-ghost"></div>
                        </div>
                    </div>
                </div>

                <p className="main__content-title">Cast</p>
                <div className="main__content">
                    <GhostLoader type="character" count={6}/>
                </div>
            </div>
        );
    }

    return (
        <div className="episode-detail">
            <Link to="#"
                  onClick={e => {
                      e.preventDefault();
                      navigate(-1);
                  }} className="go-back__button">
                <ArrowLeftIcon/>
                Go back
            </Link>

            <div className="episode-info__block">
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.2, delay: 0.05}}>
                    <p className="episode__name">{episode.name}</p>
                </motion.div>
                <div className="episode__info">
                    <div>
                        <p className="column__item-title">Episode</p>
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}}
                                    transition={{duration: 0.2, delay: 0.05}}>
                            <p className="column__item-value">{episode.episode}</p>
                        </motion.div>
                    </div>
                    <div>
                        <p className="column__item-title">Date</p>
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}}
                                    transition={{duration: 0.2, delay: 0.05}}>
                            <p className="column__item-value">{episode.air_date}</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <p className="main__content-title">Cast</p>
            <div className="main__content">
                {episode.castDetails && episode.castDetails.length > 0 ? (
                    episode.castDetails.map((character, index) => (
                        <motion.div
                            key={character.id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.2, delay: (index % 20) * 0.05}}
                        >
                            <CharacterCard
                                character={character}
                                fromPage="episode"
                                fromId={episode.id}
                            />
                        </motion.div>

                    ))
                ) : (
                    <div className="no-cast-state">
                        <p style={{fontSize: '18px', marginBottom: '8px'}}>No cast found</p>
                        <p style={{fontSize: '14px'}}>This episode doesn't have any known characters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Episode;
