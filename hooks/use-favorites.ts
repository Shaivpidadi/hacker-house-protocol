'use client';

import { useState, useEffect } from 'react';

export interface FavoriteProperty {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    image: string;
    amenities: string[];
    timestamp: number;
}

const FAVORITES_KEY = 'hhp-favorites';

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setFavorites(parsed);
            }
        } catch (error) {
            console.error('Error loading favorites from localStorage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save favorites to localStorage whenever favorites change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            } catch (error) {
                console.error('Error saving favorites to localStorage:', error);
            }
        }
    }, [favorites, isLoaded]);

    const addFavorite = (property: Omit<FavoriteProperty, 'timestamp'>) => {
        const newFavorite: FavoriteProperty = {
            ...property,
            timestamp: Date.now(),
        };
        setFavorites(prev => {
            // Check if already exists
            const exists = prev.find(fav => fav.id === property.id);
            if (exists) return prev;
            return [...prev, newFavorite];
        });
    };

    const removeFavorite = (propertyId: string) => {
        setFavorites(prev => prev.filter(fav => fav.id !== propertyId));
    };

    const toggleFavorite = (property: Omit<FavoriteProperty, 'timestamp'>) => {
        const exists = favorites.find(fav => fav.id === property.id);
        if (exists) {
            removeFavorite(property.id);
        } else {
            addFavorite(property);
        }
    };

    const isFavorite = (propertyId: string) => {
        return favorites.some(fav => fav.id === propertyId);
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    return {
        favorites,
        isLoaded,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
    };
}
