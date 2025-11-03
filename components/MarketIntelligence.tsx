import React, { useState, useCallback } from 'react';
// FIX: The geminiService file is no longer empty, so this import will work.
import { generateMarketReport } from '../services/geminiService';
import { MarketReportResult } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { TokenIcon } from './icons/TokenIcon';
import { CashIcon } from './icons/CashIcon';
import InfographicReport from './InfographicReport';

const CITIES = [
  'Abu Dhabi', 'Bangalore', 'Chennai', 'Delhi', 'Dubai', 'Hyderabad', 'London', 
  'Los Angeles', 'Mumbai', 'New York', 'Paris', 'Shanghai', 'Singapore', 'Sydney', 'Tokyo'
];

const METRIC_CATEGORIES = [
  { id: 'Pricing', name: 'Pricing' },
  { id: 'Investment Returns', name: 'Investment Returns' },
  { id: 'Market Activity', name: 'Market Activity' },
  { id: 'Supply & Development', name: 'Supply & Development' },
  { id: 'Economic Factors', name: 'Economic Factors' },
  { id: 'Livability & Infrastructure', name: 'Livability & Infrastructure' },
  { id: 'Regulatory & Ownership', name: 'Regulatory & Ownership' },
  { id: 'Currency Stability & Exchange Rate', name: 'Currency Stability & Exchange Rate' },
];

const MarketIntelligence: React.FC = () => {
  const [primaryCity, setPrimaryCity] = useState<string>(CITIES[4]);
  const [comparisonCities, setComparisonCities] = useState<string[]>(['London', 'New York', 'Singapore']);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['Pricing', 'Investment Returns', 'Market Activity']);
  const [result, setResult] = useState<MarketReportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComparisonCityChange = (city: string) => {
    setComparisonCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
    );
  };

  const handleGenerate = useCallback(async () => {
    if (!primaryCity) {
      setError('Please select a primary city.');
      return;
    }
    if (selectedMetrics.length === 0) {
      setError('Please select at least one metric to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const reportResult = await generateMarketReport(primaryCity, comparisonCities, selectedMetrics);
      setResult(reportResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [primaryCity, comparisonCities, selectedMetrics]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <ChartBarIcon className="w-8 h-8 text-brand-gold" />
        <h2 className="text-2xl font-bold text-brand-text">Market Intelligence Engine</h2>
      </div>

      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md">{error}</div>}

      <div className="bg-brand-secondary p-6 rounded-xl shadow-lg flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="primary-city" className="block font-medium text-brand-light mb-2">
              1. Select Primary City
            </label>
            <select
              id="primary-city"
              value={primaryCity}
              onChange={(e) => setPrimaryCity(e.target.value)}
              className="w-full bg-brand-primary border border-brand-accent rounded-md p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition text-brand-text"
            >
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium text-brand-light mb-2">
              2. Select Comparison Cities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-brand-primary rounded-md border border-brand-accent max-h-32 overflow-y-auto">
              {CITIES.filter(c => c !== primaryCity).map(city => (
                <label key={city} className="flex items-center gap-2 text-sm text-brand-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={comparisonCities.includes(city)}
                    onChange={() => handleComparisonCityChange(city)}
                    className="form-checkbox bg-brand-primary border-brand-accent text-brand-gold focus:ring-brand-gold"
                  />
                  {city}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="block font-medium text-brand-light mb-2">
            3. Choose Metrics for Report
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {METRIC_CATEGORIES.map(metric => (
              <label key={metric.id} className="flex items-center gap-2 p-2 rounded-md bg-brand-primary border border-brand-accent cursor-pointer hover:border-brand-light transition">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.id)}
                  onChange={() => handleMetricChange(metric.id)}
                  className="form-checkbox bg-brand-accent border-brand-light text-brand-gold focus:ring-brand-gold"
                />
                <span className="text-sm text-brand-text">{metric.name}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full sm:w-auto self-start bg-brand-gold text-brand-primary font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:bg-brand-accent disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-t-transparent border-brand-primary rounded-full animate-spin"></div>
              Generating Report...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate Report
            </>
          )}
        </button>
      </div>

      {isLoading && (
         <div className="flex-1 bg-brand-secondary p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-brand-light">
            <div className="w-12 h-12 border-4 border-t-transparent border-brand-gold rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Analyzing global market data...</p>
            <p className="text-sm">This may take a moment.</p>
         </div>
      )}

      {result && (
        <div className="flex-1 bg-brand-secondary p-6 rounded-xl shadow-lg overflow-y-auto">
            <InfographicReport content={result.report} />

            <div className="mt-8 pt-4 border-t border-brand-accent/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {result.sources && result.sources.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-brand-text mb-2">
                                Data Sources
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {result.sources.map((source, index) => (
                                source.web && (
                                    <li key={index}>
                                        <a 
                                            href={source.web.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-brand-gold/80 hover:text-brand-gold underline transition break-all"
                                        >
                                            {source.web.title || source.web.uri}
                                        </a>
                                    </li>
                                )
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="flex flex-col gap-2 self-start sm:self-center">
                        {result.tokenCount && (
                            <div className="bg-brand-primary/50 text-brand-light text-sm p-3 rounded-lg flex items-center gap-3">
                                <TokenIcon className="w-5 h-5 text-brand-gold" />
                                <span>Report generated using <strong>{result.tokenCount.toFixed(0)}</strong> tokens.</span>
                            </div>
                        )}
                        {result.cost !== undefined && (
                            <div className="bg-brand-primary/50 text-brand-light text-sm p-3 rounded-lg flex items-center gap-3">
                                <CashIcon className="w-5 h-5 text-brand-gold" />
                                <span>Estimated Cost: <strong>${result.cost.toFixed(6)}</strong> USD</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;