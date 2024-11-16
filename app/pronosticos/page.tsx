// app/page.js

export default async function Pron() {
  
    return (
      <div style={{ width: '100vw', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <iframe
        src="https://sima-widgets.streamlit.app/?embed_options=show_toolbar,light_theme&embed=true"
        style={{ width: '80%', height: '90%', border: 'none' }}
        title="Iframe de Calidad de Aire"
      />
    </div>
    );
  }
  
  