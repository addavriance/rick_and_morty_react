class RickAndMortyAPI {
    constructor() {
        this.baseURL = 'https://rickandmortyapi.com/api';
        this.endpoints = {
            characters: '/character',
            locations: '/location',
            episodes: '/episode'
        };
    }

    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    return {
                        info: {
                            count: 0,
                            pages: 0,
                            next: null,
                            prev: null
                        },
                        results: []
                    };
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getCharacters(page = 1, filters = {}) {
        let url = `${this.baseURL}${this.endpoints.characters}?page=${page}`;

        // Add filters to URL
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.trim() !== '') {
                url += `&${key}=${encodeURIComponent(value)}`;
            }
        });

        return await this.fetchData(url);
    }

    async getCharacter(id) {
        const url = `${this.baseURL}${this.endpoints.characters}/${id}`;
        return await this.fetchData(url);
    }

    async getMultipleCharacters(ids) {
        const url = `${this.baseURL}${this.endpoints.characters}/${ids.join(',')}`;
        return await this.fetchData(url);
    }

    async getLocations(page = 1, filters = {}) {
        let url = `${this.baseURL}${this.endpoints.locations}?page=${page}`;

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.trim() !== '') {
                url += `&${key}=${encodeURIComponent(value)}`;
            }
        });

        return await this.fetchData(url);
    }

    async getLocation(id) {
        const url = `${this.baseURL}${this.endpoints.locations}/${id}`;
        return await this.fetchData(url);
    }

    async getEpisodes(page = 1, filters = {}) {
        let url = `${this.baseURL}${this.endpoints.episodes}?page=${page}`;

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.trim() !== '') {
                url += `&${key}=${encodeURIComponent(value)}`;
            }
        });

        return await this.fetchData(url);
    }

    async getEpisode(id) {
        const url = `${this.baseURL}${this.endpoints.episodes}/${id}`;
        return await this.fetchData(url);
    }

    async getMultipleEpisodes(ids) {
        const url = `${this.baseURL}${this.endpoints.episodes}/${ids.join(',')}`;
        return await this.fetchData(url);
    }
}

export const rickAndMortyAPI = new RickAndMortyAPI();
