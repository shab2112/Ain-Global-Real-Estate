import React, { useState } from 'react';
import { User, ClientView } from '../types';
import MyListings from './MyListings';
import ValuateMyHome from './ValuateMyHome';
import ClientSidebar from './ClientSidebar';
import MortgageCalculator from './MortgageCalculator';
import MyVault from './MyVault';
import ClientAIView from './ClientAIView';

const ClientDashboard: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const [currentView, setCurrentView] = useState<ClientView>(ClientView.Valuation);

    const renderContent = () => {
        switch (currentView) {
            case ClientView.Valuation:
                return <ValuateMyHome />;
            case ClientView.Listings:
                return <MyListings currentUser={currentUser} />;
            case ClientView.AI:
                return <ClientAIView currentUser={currentUser} />;
            case ClientView.Mortgage:
                return <MortgageCalculator />;
            case ClientView.Vault:
                return <MyVault currentUser={currentUser} />;
            default:
                return <ValuateMyHome />;
        }
    };
    
    return (
        <div className="flex flex-1 overflow-hidden">
            <ClientSidebar currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default ClientDashboard;