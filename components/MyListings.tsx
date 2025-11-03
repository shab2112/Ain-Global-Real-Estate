import React, { useState, useEffect } from 'react';
import { Listing, User } from '../types';
import { getListingsByClientId } from '../services/apiService';
import { BuildingIcon } from './icons/BuildingIcon';

const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => {
    const formatPrice = (price: number) => {
        return `AED ${price.toLocaleString()}`;
    };

    return (
        <div className="bg-brand-primary rounded-lg overflow-hidden border border-brand-accent flex flex-col md:flex-row">
            <img src={listing.imageUrl} alt={listing.title} className="w-full md:w-64 h-48 md:h-auto object-cover" />
            <div className="p-6 flex flex-col justify-between">
                <div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block ${listing.status === 'For Sale' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                        {listing.status}
                    </span>
                    <h4 className="font-bold text-xl text-brand-text">{listing.title}</h4>
                    <p className="text-md text-brand-light">{listing.address}</p>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mt-4">
                    <p className="text-2xl font-bold text-brand-gold">{formatPrice(listing.price)}</p>
                    <div className="flex gap-4 text-brand-light">
                        <span>{listing.bedrooms} Beds</span>
                        <span>{listing.bathrooms} Baths</span>
                        <span>{listing.sqft.toLocaleString()} sqft</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface MyListingsProps {
    currentUser: User;
}

const MyListings: React.FC<MyListingsProps> = ({ currentUser }) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            try {
                const clientListings = await getListingsByClientId(currentUser.id);
                setListings(clientListings);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, [currentUser.id]);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <BuildingIcon className="w-8 h-8 text-brand-gold"/>
                <h2 className="text-2xl font-bold text-brand-text">My Listings</h2>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto">
            {isLoading ? (
                <div className="text-center p-8 text-brand-light">Loading your listings...</div>
            ) : listings.length > 0 ? (
                listings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))
            ) : (
                <div className="text-center p-8 text-brand-light">You do not have any active listings with us.</div>
            )}
            </div>
        </div>
    );
};

export default MyListings;
