import React, {useEffect, useState} from 'react';
import {useApp} from '../../contexts/AppContext';
import {SearchIcon} from '../../components/Icons';
import EpisodeCard from '../../components/Cards/EpisodeCard';
import GhostLoader from '../../components/GhostLoader/GhostLoader';
import './Episodes.css';

import {motion} from 'framer-motion';

const Episodes = () => {
    const {
        episodes,
        episodesLoading,
        episodeFilters,
        pagination,
        loadEpisodes,
        setFilters,
        error
    } = useApp();

    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        // Reload episodes when filters change
        loadEpisodes(1, false);
    }, [episodeFilters]);

    const handleSearchChange = (e) => {
        const value = e.target.value;

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            // Check if search value matches episode format (S01 or S01E02)
            if (value.match(/^S\d{2}E\d{2}$/i)) {
                setFilters('episode', {episode: value, name: ''});
            } else if (value.match(/^S\d{2}$/i)) {
                setFilters('episode', {episode: value, name: ''});
            } else {
                setFilters('episode', {name: value, episode: ''});
            }
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleLoadMore = () => {
        if (pagination.episodes.hasNextPage && !episodesLoading) {
            loadEpisodes(pagination.episodes.page + 1, true);
        }
    };

    return (
        <div className="episodes-page">
            <div className="main-logo w-fit mx-auto">
                <img
                    className="main-logo__icon"
                    src="%PUBLIC_URL%/rick_and_morty2.png"
                    width="270"
                    alt="Rick and Morty Logo"
                />
            </div>

            <div className="main-filters">
                <div className="filters__content">
                    <label htmlFor="search" className="search__field">
                        <input
                            type="search"
                            id="search"
                            name="search"
                            placeholder="Filter by name or episode (ex. S01 or S01E02)"
                            onChange={handleSearchChange}
                        />
                        <SearchIcon className="search__icon"/>
                    </label>
                </div>
            </div>

            <div className="main__content">
                {episodesLoading && episodes.length === 0 ? (
                    <GhostLoader type="episode" count={8}/>
                ) : error && episodes.length === 0 ? (
                    <div className="error-state">
                        <p>Oops! Something went wrong while loading episodes.</p>
                        <button onClick={() => loadEpisodes(1, false)}>Try again</button>
                    </div>
                ) : episodes.length === 0 ? (
                    <div className="no-results-state">
                        <p>No episodes found matching your criteria.</p>
                        <p>Try adjusting your search terms.</p>
                    </div>
                ) : (
                    episodes.map((episode, index) => (
                        <motion.div
                            key={episode.id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.2, delay: (index % 20) * 0.05}}
                        >
                            <EpisodeCard
                                episode={episode}
                                fromPage="episodes"
                            />
                        </motion.div>
                    ))
                )}
            </div>

            {
                pagination.episodes.hasNextPage && (
                    <button
                        className="load-more__button w-fit mx-auto"
                        onClick={handleLoadMore}
                        disabled={episodesLoading}
                    >
                        {episodesLoading ? 'Loading...' : 'Load more'}
                    </button>
                )
            }
        </div>
    )
        ;
};

export default Episodes;
