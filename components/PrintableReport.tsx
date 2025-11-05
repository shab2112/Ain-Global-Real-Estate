import React from 'react';
import { MarketReportResult } from '../types';
import { brandingConfig } from '../data/branding';
import MarkdownRenderer from './MarkdownRenderer';

interface PrintableReportProps {
  report: MarketReportResult;
  primaryCity: string;
}

const PrintableReport: React.FC<PrintableReportProps> = ({ report, primaryCity }) => {
  return (
    <div style={{
      width: '595pt', // A4 width in points
      minHeight: '842pt', // A4 height
      backgroundColor: 'white',
      color: '#111',
      fontFamily: 'Times, serif',
      fontSize: '11pt',
      lineHeight: 1.5
    }}>
      <div style={{ padding: '40pt' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #D4AF37', paddingBottom: '12pt', marginBottom: '24pt' }}>
          <div>
            <h1 style={{ color: '#0D1117', fontSize: '24pt', fontWeight: 'bold', margin: 0 }}>Lockwood & Carter</h1>
            <p style={{ color: '#30363D', fontSize: '10pt', margin: '4pt 0 0 0' }}>Elite Real Estate Intelligence</p>
          </div>
          <img src={brandingConfig.logoUrl} alt="Lockwood & Carter Logo" style={{ width: '60pt', height: '60pt', objectFit: 'contain' }} />
        </header>

        {/* Report Body */}
        <main>
          <MarkdownRenderer content={report.report} />
        </main>

        {/* Sources */}
        {report.sources && report.sources.length > 0 && (
          <section style={{ marginTop: '24pt', pageBreakBefore: 'auto' }}>
            <h2 style={{ fontSize: '16pt', fontWeight: 'bold', color: '#0D1117', borderBottom: '1px solid #ccc', paddingBottom: '4pt', marginBottom: '8pt' }}>
              Data Sources
            </h2>
            <ul style={{ listStyle: 'disc', paddingLeft: '20pt', margin: 0, fontSize: '10pt' }}>
              {report.sources.map((source, index) => (
                source.web && (
                  <li key={index} style={{ marginBottom: '4pt' }}>
                    <a href={source.web.uri} target="_blank" rel="noopener noreferrer" style={{ color: '#0000EE', textDecoration: 'none' }}>
                      {source.web.title || source.web.uri}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </section>
        )}

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #ccc', paddingTop: '8pt', marginTop: '32pt', fontSize: '9pt', color: '#666', textAlign: 'center' }}>
          <p>This report was generated on {new Date().toLocaleDateString()} by the Lucra AI platform for Lockwood & Carter.</p>
          <p>All data is sourced from publicly available information and is intended for informational purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default PrintableReport;
