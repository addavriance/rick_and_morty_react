import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { rickAndMortyAPI } from '../services/api';

// Actions
const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_CHARACTERS: 'SET_CHARACTERS',
    SET_CHARACTER: 'SET_CHARACTER',
    SET_LOCATIONS: 'SET_LOCATIONS',
    SET_LOCATION: 'SET_LOCATION',
    SET_EPISODES: 'SET_EPISODES',
    SET_EPISODE: 'SET_EPISODE',
    SET_FILTERS: 'SET_FILTERS',
    RESET_FILTERS: 'RESET_FILTERS',
    SET_PAGINATION: 'SET_PAGINATION',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
    // Characters
    characters: [],
    character: null,
    characterLoading: false,
    charactersLoading: false,

    // Locations
    locations: [],
    location: null,
    locationLoading: false,
    locationsLoading: false,

    // Episodes
    episodes: [],
    episode: null,
    episodeLoading: false,
    episodesLoading: false,

    // Filters
    characterFilters: {
        name: '',
        species: '',
        gender: '',
        status: ''
    },
    locationFilters: {
        name: '',
        type: '',
        dimension: ''
    },
    episodeFilters: {
        name: '',
        episode: ''
    },

    // Pagination
    pagination: {
        characters: { page: 1, hasNextPage: true, totalPages: 0 },
        locations: { page: 1, hasNextPage: true, totalPages: 0 },
        episodes: { page: 1, hasNextPage: true, totalPages: 0 }
    },

    // Error handling
    error: null
};

function appReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return {
                ...state,
                [`${action.payload.type}Loading`]: action.payload.loading
            };

        case ACTIONS.SET_CHARACTERS:
            return {
                ...state,
                characters: action.payload.append
                    ? [...state.characters, ...action.payload.data]
                    : action.payload.data,
                charactersLoading: false
            };

        case ACTIONS.SET_CHARACTER:
            return {
                ...state,
                character: action.payload,
                characterLoading: false
            };

        case ACTIONS.SET_LOCATIONS:
            return {
                ...state,
                locations: action.payload.append
                    ? [...state.locations, ...action.payload.data]
                    : action.payload.data,
                locationsLoading: false
            };

        case ACTIONS.SET_LOCATION:
            return {
                ...state,
                location: action.payload,
                locationLoading: false
            };

        case ACTIONS.SET_EPISODES:
            return {
                ...state,
                episodes: action.payload.append
                    ? [...state.episodes, ...action.payload.data]
                    : action.payload.data,
                episodesLoading: false
            };

        case ACTIONS.SET_EPISODE:
            return {
                ...state,
                episode: action.payload,
                episodeLoading: false
            };

        case ACTIONS.SET_FILTERS:
            return {
                ...state,
                [`${action.payload.type}Filters`]: {
                    ...state[`${action.payload.type}Filters`],
                    ...action.payload.filters
                }
            };

        case ACTIONS.RESET_FILTERS:
            return {
                ...state,
                [`${action.payload.type}Filters`]: initialState[`${action.payload.type}Filters`]
            };

        case ACTIONS.SET_PAGINATION:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    [action.payload.type]: {
                        ...state.pagination[action.payload.type],
                        ...action.payload.data
                    }
                }
            };

        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload
            };

        case ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
}

const AppContext = createContext();

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const loadCharacters = async (page = 1, append = false) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'characters', loading: true } });
            dispatch({ type: ACTIONS.CLEAR_ERROR });

            const data = await rickAndMortyAPI.getCharacters(page, state.characterFilters);

            dispatch({
                type: ACTIONS.SET_CHARACTERS,
                payload: { data: data.results, append }
            });

            dispatch({
                type: ACTIONS.SET_PAGINATION,
                payload: {
                    type: 'characters',
                    data: {
                        page,
                        hasNextPage: !!data.info.next,
                        totalPages: data.info.pages
                    }
                }
            });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'characters', loading: false } });

            dispatch({
                type: ACTIONS.SET_PAGINATION,
                payload: {
                    type: 'characters',
                    data: {
                        page,
                        hasNextPage: false,
                        totalPages: 0
                    }
                }
            });
        }
    };

    const loadCharacter = async (id) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'character', loading: true } });
            dispatch({ type: ACTIONS.CLEAR_ERROR });

            const character = await rickAndMortyAPI.getCharacter(id);

            // Load episodes if character has them
            if (character.episode && character.episode.length > 0) {
                const episodeIds = character.episode.map(url => {
                    const parts = url.split('/');
                    return parts[parts.length - 1];
                });

                let episodes;
                if (episodeIds.length === 1) {
                    episodes = [await rickAndMortyAPI.getEpisode(episodeIds[0])];
                } else {
                    episodes = await rickAndMortyAPI.getMultipleEpisodes(episodeIds);
                }

                character.episodeDetails = episodes;
            }

            dispatch({ type: ACTIONS.SET_CHARACTER, payload: character });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'character', loading: false } });
        }
    };

    const loadLocations = async (page = 1, append = false) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'locations', loading: true } });
            dispatch({ type: ACTIONS.CLEAR_ERROR });

            const data = await rickAndMortyAPI.getLocations(page, state.locationFilters);

            dispatch({
                type: ACTIONS.SET_LOCATIONS,
                payload: { data: data.results, append }
            });

            dispatch({
                type: ACTIONS.SET_PAGINATION,
                payload: {
                    type: 'locations',
                    data: {
                        page,
                        hasNextPage: !!data.info.next,
                        totalPages: data.info.pages
                    }
                }
            });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'locations', loading: false } });

            dispatch({
                type: ACTIONS.SET_PAGINATION,
                payload: {
                    type: 'locations',
                    data: {
                        page,
                        hasNextPage: false,
                        totalPages: 0
                    }
                }
            });
        }
    };

    const loadLocation = async (id) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'location', loading: true } });
            dispatch({ type: ACTIONS.CLEAR_ERROR });

            const location = await rickAndMortyAPI.getLocation(id);

            if (location.residents && location.residents.length > 0) {
                const residentIds = location.residents.map(url => {
                    const parts = url.split('/');
                    return parts[parts.length - 1];
                });

                let residents;
                if (residentIds.length === 1) {
                    residents = [await rickAndMortyAPI.getCharacter(residentIds[0])];
                } else {
                    residents = await rickAndMortyAPI.getMultipleCharacters(residentIds);
                }

                location.residentDetails = residents;
            }

            dispatch({ type: ACTIONS.SET_LOCATION, payload: location });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'location', loading: false } });
        }
    };

    const loadEpisodes = async (page = 1, append = false) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'episodes', loading: true } });
            dispatch({ type: ACTIONS.CLEAR_ERROR });

            const data = await rickAndMortyAPI.getEpisodes(page, state.episodeFilters);

            dispatch({
                type: ACTIONS.SET_EPISODES,
                payload: { data: data.results, append }
            });

            dispatch({
                type: ACTIONS.SET_PAGINATION,
                payload: {
                    type: 'episodes',
                    data: {
                        page,
                        hasNextPage: !!data.info.next,
                        totalPages: data.info.pages
                    }
                }
            });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'episodes', loading: false } });

            dispatch({
                type: ACTIONS.SET_PAGINATION,
                payload: {
                    type: 'episodes',
                    data: {
                        page,
                        hasNextPage: false,
                        totalPages: 0
                    }
                }
            });
        }
    };

    const loadEpisode = async (id) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'episode', loading: true } });
            dispatch({ type: ACTIONS.CLEAR_ERROR });

            const episode = await rickAndMortyAPI.getEpisode(id);

            // Load cast if episode has characters
            if (episode.characters && episode.characters.length > 0) {
                const characterIds = episode.characters.map(url => {
                    const parts = url.split('/');
                    return parts[parts.length - 1];
                });

                let cast;
                if (characterIds.length === 1) {
                    cast = [await rickAndMortyAPI.getCharacter(characterIds[0])];
                } else {
                    cast = await rickAndMortyAPI.getMultipleCharacters(characterIds);
                }

                episode.castDetails = cast;
            }

            dispatch({ type: ACTIONS.SET_EPISODE, payload: episode });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            dispatch({ type: ACTIONS.SET_LOADING, payload: { type: 'episode', loading: false } });
        }
    };

    const setFilters = (type, filters) => {
        dispatch({
            type: ACTIONS.SET_FILTERS,
            payload: { type, filters }
        });
    };

    const resetFilters = (type) => {
        dispatch({
            type: ACTIONS.RESET_FILTERS,
            payload: { type }
        });
    };

    const value = {
        // State
        ...state,

        // Actions
        loadCharacters,
        loadCharacter,
        loadLocations,
        loadLocation,
        loadEpisodes,
        loadEpisode,
        setFilters,
        resetFilters,

        // Helper functions
        clearError: () => dispatch({ type: ACTIONS.CLEAR_ERROR })
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

export { ACTIONS };
