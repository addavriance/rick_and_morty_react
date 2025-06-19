import React, {useEffect, useState} from 'react';
import {useApp} from '../../contexts/AppContext';
import {SearchIcon, FilterIcon} from '../../components/Icons';
import LocationCard from '../../components/Cards/LocationCard';
import FilterModal from '../../components/FilterModal/FilterModal';
import GhostLoader from '../../components/GhostLoader/GhostLoader';
import './Locations.css';

import imageLogo from '../../images/rick_and_morty.png'

import {motion} from 'framer-motion';

const Locations = () => {
    const {
        locations,
        locationsLoading,
        locationFilters,
        pagination,
        loadLocations,
        setFilters,
        error
    } = useApp();

    const [searchTimeout, setSearchTimeout] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        // Reload locations when filters change
        loadLocations(1, false);
    }, [locationFilters]);

    const handleSearchChange = (e) => {
        const value = e.target.value;

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            setFilters('location', {name: value});
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleFilterChange = (filterKey, value) => {
        setFilters('location', {[filterKey]: value});
    };

    const handleLoadMore = () => {
        if (pagination.locations.hasNextPage && !locationsLoading) {
            loadLocations(pagination.locations.page + 1, true);
        }
    };

    const openFilterModal = () => {
        setIsFilterModalOpen(true);
    };

    const closeFilterModal = () => {
        setIsFilterModalOpen(false);
    };

    const filterOptions = {
        type: ["Acid Plant", "Arcade", "Artificially generated world", "Asteroid", "Base", "Box", "Cluster", "Consciousness", "Convention", "Country", "Customs", "Daycare", "Death Star", "Diegesis", "Dimension", "Dream", "Dwarf planet (Celestial Dwarf)", "Elemental Rings", "Fantasy town", "Game", "Hell", "Human", "Liquid", "Machine", "Memory", "Menagerie", "Microverse", "Miniverse", "Mount", "Nightmare", "Non-Diegetic Alternative Reality", "Planet", "Police Department", "Quadrant", "Quasar", "Reality", "Resort", "Spa", "Space", "Space station", "Spacecraft", "TV", "Teenyverse", "Woods", "unknown"],
        dimension: ["Chair Dimension", "Cromulon Dimension", "Cronenberg Dimension", "Dimension 5-126", "Dimension C-137", "Dimension C-35", "Dimension C-500A", "Dimension D-99", "Dimension D716", "Dimension D716-B", "Dimension D716-C", "Dimension J-22", "Dimension J19ζ7", "Dimension K-22", "Dimension K-83", "Eric Stoltz Mask Dimension", "Evil Rick's Target Dimension", "Fantasy Dimension", "Fascist Dimension", "Fascist Shrimp Dimension", "Fascist Teddy Bear Dimension", "Giant Telepathic Spiders Dimension", "Magic Dimension", "Merged Dimension", "Phone Dimension", "Pizza Dimension", "Post-Apocalyptic Dimension", "Replacement Dimension", "Testicle Monster Dimension", "Tusk Dimension", "Unknown dimension", "Wasp Dimension", "unknown"]
    };

    return (
        <div className="locations-page">
            <div className="main-logo w-fit mx-auto">
                <img
                    className="main-logo__icon"
                    src={imageLogo}
                    width="326"
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
                        id="type"
                        name="type"
                        value={locationFilters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="">All Types</option>
                        {filterOptions.type.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <select
                        id="dimension"
                        name="dimension"
                        value={locationFilters.dimension}
                        onChange={(e) => handleFilterChange('dimension', e.target.value)}
                    >
                        <option value="">All Dimensions</option>
                        {filterOptions.dimension.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="main__content">
                {locationsLoading && locations.length === 0 ? (
                    <GhostLoader type="location" count={8}/>
                ) : error && locations.length === 0 ? (
                    <div className="error-state">
                        <p>Oops! Something went wrong while loading locations.</p>
                        <button onClick={() => loadLocations(1, false)}>Try again</button>
                    </div>
                ) : locations.length === 0 ? (
                    <div className="no-results-state">
                        <p>No locations found matching your criteria.</p>
                        <p>Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    locations.map((location, index) => (
                        <motion.div
                            key={location.id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.2, delay: (index % 20) * 0.05}}
                        >
                            <LocationCard location={location} fromPage="locations"/>
                        </motion.div>
                    ))
                )}
            </div>

            {pagination.locations.hasNextPage && (
                <button
                    className="load-more__button w-fit mx-auto"
                    onClick={handleLoadMore}
                    disabled={locationsLoading}
                >
                    {locationsLoading ? 'Loading...' : 'Load more'}
                </button>
            )}

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={closeFilterModal}
                filterOptions={filterOptions}
                currentFilters={locationFilters}
                onApply={(filters) => setFilters('location', filters)}
                type="location"
            />
        </div>
    );
};

export default Locations;
