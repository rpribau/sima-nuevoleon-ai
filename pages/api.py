import streamlit as st

def show_api():
    st.header("Sistema de información Geográfica - Medio Ambiente")
    st.write(
        """
        En esta sección, puedes interactuar con la herramienta de monitoreo ambiental 
        proporcionada por el Gobierno de Nuevo León.
        """
    )

    # Agregar iframe con la herramienta incrustada
    st.components.v1.html(
        """
        <iframe src="https://ecolaboracion.nl.gob.mx/dmmanl/" width="100%" height="600px" frameborder="0">
        </iframe>
        """,
        height=600,
    )
