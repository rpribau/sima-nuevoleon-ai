import React from 'react';

const IframePage = () => {
  return (
    <div style={{ width: '100vw', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <iframe
        src="https://ecolaboracion.nl.gob.mx/dmmanl/"
        style={{ width: '80%', height: '80%', border: 'none' }}
        title="Iframe de Calidad de Aire"
      />
    </div>
  );
};

export default IframePage;
