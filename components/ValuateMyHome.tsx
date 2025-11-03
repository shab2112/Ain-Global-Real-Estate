import React, { useState } from 'react';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { generatePropertyValuation } from '../services/geminiService';
import { PropertyType } from '../types';


const ValuateMyHome: React.FC = () => {
    const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.Apartment);
    const [bedrooms, setBedrooms] = useState(2);
    const [size, setSize] = useState(1500);
    const [community, setCommunity] = useState('Dubai Marina');
    
    const [isValuating, setIsValuating] = useState(false);
    const [valuation, setValuation] = useState<{ valueRange: string; commentary: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const handleValuation = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsValuating(true);
      setValuation(null);
      setError(null);
      try {
        const result = await generatePropertyValuation(propertyType, bedrooms, size, community);
        setValuation(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get valuation.');
      } finally {
        setIsValuating(false);
      }
    };
  
    return (
      <div className="h-full flex flex-col gap-6">
        <div className="flex items-center gap-3">
            <CalculatorIcon className="w-8 h-8 text-brand-gold"/>
            <h2 className="text-2xl font-bold text-brand-text">Valuate My Home</h2>
        </div>
        <div className="flex-1 bg-brand-secondary p-6 rounded-xl shadow-lg flex items-center justify-center">
            <div className="w-full max-w-lg">
                <form onSubmit={handleValuation} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="propertyType" className="block text-sm font-medium text-brand-light mb-1">Property Type</label>
                            <select id="propertyType" value={propertyType} onChange={e => setPropertyType(e.target.value as PropertyType)} className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold text-brand-text">
                                {Object.values(PropertyType).map(pt => <option key={pt} value={pt}>{pt}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="bedrooms" className="block text-sm font-medium text-brand-light mb-1">Bedrooms</label>
                            <input type="number" id="bedrooms" value={bedrooms} onChange={e => setBedrooms(parseInt(e.target.value))} min="0" className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold text-brand-text"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="size" className="block text-sm font-medium text-brand-light mb-1">Size (sqft)</label>
                            <input type="number" id="size" value={size} onChange={e => setSize(parseInt(e.target.value))} min="0" className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold text-brand-text"/>
                        </div>
                        <div>
                            <label htmlFor="community" className="block text-sm font-medium text-brand-light mb-1">Community</label>
                            <input type="text" id="community" value={community} onChange={e => setCommunity(e.target.value)} placeholder="e.g., Downtown Dubai" className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold text-brand-text"/>
                        </div>
                    </div>
                  
                  <button
                    type="submit"
                    disabled={isValuating}
                    className="w-full !mt-6 bg-brand-gold text-brand-primary font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 disabled:bg-brand-accent disabled:cursor-not-allowed"
                  >
                     {isValuating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-brand-primary rounded-full animate-spin"></div>
                        Valuating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        Get AI Valuation
                      </>
                    )}
                  </button>
                </form>

                {error && <div className="mt-6 text-center text-red-400 bg-red-500/10 p-3 rounded-md">{error}</div>}
                
                {valuation && (
                    <div className="mt-8 text-center bg-brand-primary p-6 rounded-lg border border-brand-accent">
                        <p className="text-brand-light">Estimated Property Value:</p>
                        <p className="text-4xl font-bold text-brand-gold mt-2">
                            {valuation.valueRange}
                        </p>
                        <p className="text-sm text-brand-light/80 mt-4">{valuation.commentary}</p>
                        <p className="text-xs text-brand-light/50 mt-4">This is an AI-powered estimate. For a detailed appraisal, please contact your advisor.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
};

export default ValuateMyHome;
