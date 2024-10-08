import os
import streamlit as st
from streamlit_navigation_bar import st_navbar
import pages as pg


st.set_page_config(initial_sidebar_state="collapsed", layout="wide")

pages = ["Pronosticos", "Cambio Climatico", "Medio Ambiente", "GitHub"]
parent_dir = os.path.dirname(os.path.abspath(__file__))
logo_path = os.path.join(parent_dir, "logoNL.svg")
urls = {"GitHub": "https://github.com/alternativeprogrammer/simaNL-AI"}
styles = {
    "nav": {
        "background-color": "#236241",
        "justify-content": "left",
    },
    "img": {
        "padding-right": "24px",
    },
    "span": {
        "color": "white",
        "padding": "20px",
    },
    "active": {
        "background-color": "white",
        "color": "var(--text-color)",
        "font-weight": "normal",
        "padding": "24px",
    }
}
options = {
    "show_menu": False,
    "show_sidebar": False,
}

page = st_navbar(
    pages,
    logo_path=logo_path,
    urls=urls,
    styles=styles,
    options=options,
)

functions = {
    "Home": pg.show_home,
    "Pronosticos": pg.show_install,
    "Cambio Climatico": pg.show_user_guide,
    "Medio Ambiente": pg.show_api,
}
go_to = functions.get(page)
if go_to:
    go_to()