import folium
from streamlit_folium import st_folium
import streamlit as st
import pandas as pd

def show_home():
    st.header("Reporte de Calidad del Aire en Monterrey.")

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

    # Metrics for each station (sample data)
    station_metrics = {
        "Centro": {'CO': 1.2, 'NO': 0.5, 'NO2': 0.7, 'NOX': 1.1, 'O3': 0.9, 'PM10': 45, 'PM2.5': 30, 'PRS': 1015, 'RAINF': 0.0, 'RH': 60, 'SO2': 0.02},
        "Sureste": {'CO': 1.1, 'NO': 0.4, 'NO2': 0.6, 'NOX': 1.0, 'O3': 1.0, 'PM10': 40, 'PM2.5': 25, 'PRS': 1013, 'RAINF': 0.1, 'RH': 55, 'SO2': 0.03},
        "Noreste": {'CO': 1.0, 'NO': 0.6, 'NO2': 0.8, 'NOX': 1.2, 'O3': 0.8, 'PM10': 50, 'PM2.5': 35, 'PRS': 1016, 'RAINF': 0.0, 'RH': 58, 'SO2': 0.01},
        # Add other stations and their metrics here
    }

    # Create two columns: one for the map and one for the metrics
        # Create two columns: one for the map and one for the metrics
    map_col, metrics_col = st.columns([1, 1])

    # Add markers to the map before displaying it
    for loc in coordinates:
        folium.Marker(
            location=[loc["lat"], loc["lon"]],
            popup=loc["name"],
        ).add_to(folium_map)

    # Display the map in the left column
    with map_col:
        st_folium(folium_map, width=800, height=500)


    # Add a selection box for stations and display the metrics in the right column
    with metrics_col:
        selected_station = st.selectbox("Selecciona una estación", [loc["name"] for loc in coordinates])

        if selected_station in station_metrics:
            st.write(f"**Métricas para la estación {selected_station}:**")
            metrics = station_metrics[selected_station]

            # Create a DataFrame from the metrics
            # Create a DataFrame from the metrics without showing the index
            # Create a DataFrame from the metrics without showing the index
            df = pd.DataFrame(list(metrics.items()), columns=['Métrica', 'Valor']).reset_index(drop=True)
            # Display the dataframe without the index
            st.dataframe(df, height=370, width=800, hide_index=True)
    
    st.header("Pronostico de la semana.")




# Run the app
if __name__ == "__main__":
    show_home()
