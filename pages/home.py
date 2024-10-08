import folium
from streamlit_folium import st_folium
import streamlit as st

def show_home():
    st.header("Reporte de Calidad del Aire en Monterrey")

    # Add the Rerun button at the top
    col1, col2 = st.columns([9, 1])  # Allocate more space for the map, less for the button
    with col2:
        if st.button("Rerun App"):  # Place button at the right
            st.session_state['rerun_triggered'] = True

    # Ensure rerun only happens once
    if 'rerun_triggered' in st.session_state and st.session_state['rerun_triggered']:
        st.session_state['rerun_triggered'] = False  # Reset after rerun
        st.experimental_rerun()  # Rerun the app once

    # Starting location for the map (Monterrey, Nuevo Leon)
    initial_coords = [25.6866, -100.3161]  # Monterrey Coordinates

    # Create a Folium map centered at the initial coordinates
    folium_map = folium.Map(location=initial_coords, zoom_start=10)

    # List of coordinates to add markers to
    coordinates = [
        {"lat": 25.67602, "lon": -100.335847, "name": "Centro"},
        {"lat": 25.66827, "lon": -100.249580, "name": "Sureste"},
        {"lat": 25.74543, "lon": -100.255020, "name": "Noreste"},
        {"lat": 25.75712, "lon": -100.365974, "name": "Noroeste"},
        {"lat": 25.675674, "lon": -100.465018, "name": "Suroeste"},
        {"lat": 25.783456, "lon": -100.585874, "name": "Noroeste2"},
        {"lat": 25.80194, "lon": -100.343056, "name": "Norte"},
        {"lat": 25.77722, "lon": -100.188055, "name": "Noreste2"},
        {"lat": 25.64611, "lon": -100.095555, "name": "Sureste2"},
        {"lat": 25.66528, "lon": -100.412778, "name": "Suroeste2"},
        {"lat": 25.600874, "lon": -99.995298, "name": "Sureste3"},
        {"lat": 25.729787, "lon": -100.310028, "name": "Norte2"},
        {"lat": 25.575383, "lon": -100.249371, "name": "Sur"},
    ]

    # Add markers to the map
    for loc in coordinates:
        folium.Marker(
            location=[loc["lat"], loc["lon"]],
            popup=loc["name"],
        ).add_to(folium_map)

    # Display the map in Streamlit
    st_folium(folium_map, width=900, height=500)

