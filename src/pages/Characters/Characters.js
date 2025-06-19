import React, {useEffect, useState} from 'react';
import {useApp} from '../../contexts/AppContext';
import {LogoLargeIcon, SearchIcon, FilterIcon} from '../../components/Icons';
import CharacterCard from '../../components/Cards/CharacterCard';
import FilterModal from '../../components/FilterModal/FilterModal';
import GhostLoader from '../../components/GhostLoader/GhostLoader';
import './Characters.css';

import {motion} from 'framer-motion';

const Characters = () => {
    const {
        characters,
        charactersLoading,
        characterFilters,
        pagination,
        loadCharacters,
        setFilters,
        error
    } = useApp();

    const [searchTimeout, setSearchTimeout] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        loadCharacters(1, false);
    }, [characterFilters]);

    const handleSearchChange = (e) => {
        const value = e.target.value;

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            setFilters('character', {name: value});
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleFilterChange = (filterKey, value) => {
        setFilters('character', {[filterKey]: value});
    };

    const handleLoadMore = () => {
        if (pagination.characters.hasNextPage && !charactersLoading) {
            loadCharacters(pagination.characters.page + 1, true);
        }
    };

    const openFilterModal = () => {
        setIsFilterModalOpen(true);
    };

    const closeFilterModal = () => {
        setIsFilterModalOpen(false);
    };

    const filterOptions = {
        species: ['Human', 'Alien', 'Humanoid', 'Poopybutthole', 'Mythological Creature', 'Robot', 'Animal', 'Cronenberg', 'Disease'],
        gender: ['Female', 'Male', 'Genderless', 'unknown'],
        status: ['Alive', 'Dead', 'unknown']
    };

    return (
        <div className="characters-page">
            <div className="main-logo w-fit mx-auto">
                <LogoLargeIcon className="main-logo__icon"/>
            </div>

            <div className="main-filters">
                <div className="filters__content">
                    <label htmlFor="search" className="search__field">
                        <input
                            type="search"
                            id="search"
                            name="search"
                            placeholder="Filter by name..."
                            onChange={handleSearchChange}
                        />
                        <SearchIcon className="search__icon"/>
                    </label>

                    <button className="filters__button" onClick={openFilterModal}>
                        <FilterIcon className="filter__icon"/>
                        Advanced filters
                    </button>

                    <select
                        id="species"
                        name="species"
                        value={characterFilters.species}
                        onChange={(e) => handleFilterChange('species', e.target.value)}
                    >
                        <option value="">All Species</option>
                        {filterOptions.species.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <select
                        id="gender"
                        name="gender"
                        value={characterFilters.gender}
                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                    >
                        <option value="">All Genders</option>
                        {filterOptions.gender.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <select
                        id="status"
                        name="status"
                        value={characterFilters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        {filterOptions.status.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="main__content">
                {charactersLoading && characters.length === 0 ? (
                    <GhostLoader type="character" count={8}/>
                ) : error && characters.length === 0 ? (
                    <div className="error-state">
                        <p>Oops! Something went wrong while loading characters.</p>
                        <button onClick={() => loadCharacters(1, false)}>Try again</button>
                    </div>
                ) : characters.length === 0 ? (
                    <div className="no-results-state">
                        <p>No characters found matching your criteria.</p>
                        <p>Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    characters.map((character, index) => (
                        <motion.div
                            key={character.id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.2, delay: (index % 20) * 0.05}}
                        >
                            <CharacterCard
                                key={character.id}
                                character={character}
                                fromPage="characters"
                            />
                        </motion.div>
                    ))
                )}
            </div>

            {
                pagination.characters.hasNextPage && (
                    <button
                        className="load-more__button w-fit mx-auto"
                        onClick={handleLoadMore}
                        disabled={charactersLoading}
                    >
                        {charactersLoading ? 'Loading...' : 'Load more'}
                    </button>
                )}

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={closeFilterModal}
                filterOptions={filterOptions}
                currentFilters={characterFilters}
                onApply={(filters) => setFilters('character', filters)}
                type="character"
            />
        </div>
    );
};

export default Characters;
