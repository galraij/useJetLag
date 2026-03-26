import { createContext, useContext, useState } from 'react';

const TravelContext = createContext(undefined);

const mockUser = {
    id: 'user-1',
    name: 'Alex Chen',
    email: 'alex@example.com'
};

const mockTrips = [
    {
        id: 'trip-1',
        userId: 'user-1',
        title: 'Summer Adventures in Santorini',
        coverImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
        country: 'Greece',
        region: 'Santorini',
        isPublic: true,
        createdAt: '2024-08-15',
        images: [
            { id: 'img-1', url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', date: '2024-08-15', location: 'Oia', weather: 'sunny' },
            { id: 'img-2', url: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800', date: '2024-08-16', location: 'Fira', weather: 'sunny' },
            { id: 'img-3', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', date: '2024-08-17', location: 'Red Beach', weather: 'cloudy' },
        ],
        blogContent: `# Summer Adventures in Santorini

Our journey to Santorini began with a breathtaking view of the iconic white-washed buildings perched on volcanic cliffs.

## Day 1: Oia's Sunset Magic

Walking through the narrow cobblestone streets, we discovered hidden gems at every corner.

## Day 2: Exploring Fira

The capital city of Fira offered a different perspective of island life.

## Day 3: Red Beach Adventure

Our final day took us to the unique Red Beach, named for its distinctive red volcanic sand and cliffs.`
    },
    {
        id: 'trip-2',
        userId: 'user-1',
        title: 'Tokyo Street Food Journey',
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        country: 'Japan',
        region: 'Tokyo',
        isPublic: true,
        createdAt: '2024-09-20',
        images: [
            { id: 'img-4', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', date: '2024-09-20', location: 'Shibuya', weather: 'cloudy' },
            { id: 'img-5', url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800', date: '2024-09-21', location: 'Shinjuku', weather: 'rainy' },
        ],
        blogContent: "Tokyo's vibrant street food scene is a culinary adventure waiting to be explored..."
    },
    {
        id: 'trip-3',
        userId: 'user-1',
        title: 'Northern Lights in Iceland',
        coverImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
        country: 'Iceland',
        region: 'Reykjavik',
        isPublic: false,
        createdAt: '2024-10-10',
        images: [
            { id: 'img-6', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', date: '2024-10-10', location: 'Reykjavik', weather: 'cloudy' },
        ],
    },
];

const mockPublicTrips = [
    ...mockTrips.filter(t => t.isPublic),
    {
        id: 'trip-4',
        userId: 'user-2',
        title: 'Exploring the Swiss Alps',
        coverImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
        country: 'Switzerland',
        region: 'Zermatt',
        isPublic: true,
        createdAt: '2024-07-05',
        images: [],
    },
    {
        id: 'trip-5',
        userId: 'user-3',
        title: 'Bali Temple Tour',
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        country: 'Indonesia',
        region: 'Bali',
        isPublic: true,
        createdAt: '2024-06-12',
        images: [],
    },
];

export function TravelProvider({ children }) {
    const [user, setUser] = useState(mockUser);
    const [trips, setTrips] = useState(mockTrips);
    const [publicTrips] = useState(mockPublicTrips);

    const login = (email, password) => {
        setUser(mockUser);
    };

    const register = (name, email, password) => {
        setUser({ id: Date.now().toString(), name, email });
    };

    const logout = () => {
        setUser(null);
    };

    const createTrip = (trip) => {
        const newTrip = {
            ...trip,
            id: `trip-${Date.now()}`,
            userId: user?.id || '',
            createdAt: new Date().toISOString().split('T')[0],
            images: [],
        };
        setTrips(prev => [...prev, newTrip]);
        return newTrip.id;
    };

    const updateTrip = (id, updates) => {
        setTrips(prev => prev.map(trip => trip.id === id ? { ...trip, ...updates } : trip));
    };

    const deleteTrip = (id) => {
        setTrips(prev => prev.filter(trip => trip.id !== id));
    };

    const addImagesToTrip = (tripId, images) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                const newImages = images.map((img, idx) => ({
                    ...img,
                    id: `img-${Date.now()}-${idx}`
                }));
                return { ...trip, images: [...trip.images, ...newImages] };
            }
            return trip;
        }));
    };

    const generateBlog = async (tripId) => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;

        const generatedContent = `# ${trip.title}

Our incredible journey through ${trip.region}, ${trip.country} was filled with unforgettable moments.

${trip.images.map((img, idx) => `
## Day ${idx + 1}: ${img.location || 'Exploring'}

${img.weather === 'sunny' ? 'The sun shone brightly as we explored...' :
                img.weather === 'rainy' ? 'Despite the rain, we discovered...' :
                    img.weather === 'cloudy' ? 'Under cloudy skies, we wandered...' :
                        'The weather was perfect for...'}
`).join('\n')}

## Memories to Treasure

This trip to ${trip.country} will forever hold a special place in our hearts.`;

        updateTrip(tripId, { blogContent: generatedContent });
    };

    return (
        <TravelContext.Provider
            value={{
                user,
                trips,
                publicTrips,
                login,
                register,
                logout,
                createTrip,
                updateTrip,
                deleteTrip,
                addImagesToTrip,
                generateBlog,
            }}
        >
            {children}
        </TravelContext.Provider>
    );
}

export function useTravel() {
    const context = useContext(TravelContext);
    if (context === undefined) {
        throw new Error('useTravel must be used within a TravelProvider');
    }
    return context;
}
