// app/page.js

export default async function Home() {
    const response = await fetch('http://aire.nl.gob.mx:81/SIMA2017reportes/pages/Parametros.json?1728427544575');
    const data = await response.json();
  
    return (
      <div>
        <h1>Parámetros</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }
  