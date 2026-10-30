"""Streamlit customer assistant embedded by the React storefront."""
import os
import streamlit as st
from knowledge import QUESTIONS, CONTACT, answer, catalog, business

st.set_page_config(page_title="Asistente Lirio", page_icon="🌺", layout="centered")
dark_theme = st.query_params.get("lirio_theme", "light") == "dark"
theme_mode = "dark" if dark_theme else "light"
theme_background = "#171215" if dark_theme else "#ffffff"
theme_surface = "#2c2026" if dark_theme else "#fff0f2"
theme_text = "#f7eff2" if dark_theme else "#302128"
st.markdown(f"<style>:root{{color-scheme:{theme_mode};--lirio-mode:{theme_mode};--lirio-bg:{theme_background};--lirio-surface:{theme_surface};--lirio-ink:{theme_text};}}</style>", unsafe_allow_html=True)
st.markdown("""
<style>
.stApp {background:var(--lirio-bg);color:var(--lirio-ink);color-scheme:var(--lirio-mode);}
.block-container {padding:2rem 1.4rem 6rem;max-width:740px;}
h1 {font-size:2.2rem!important;letter-spacing:-.05em;font-weight:550!important;color:var(--lirio-ink);}
.stApp :is(p,h2,h3,label) {color:var(--lirio-ink);}
[data-testid="stChatMessage"] {border:1px solid color-mix(in srgb,var(--lirio-ink) 15%,transparent);border-radius:18px;background:var(--lirio-surface);}
.stApp button {border-radius:12px;border:1px solid color-mix(in srgb,var(--lirio-ink) 20%,transparent);background:var(--lirio-bg);font-size:.8rem;min-height:44px;color:var(--lirio-ink);}
.stApp button:hover {border-color:#e62b3d;background:color-mix(in srgb,#e62b3d 12%,var(--lirio-bg));color:var(--lirio-ink);}
[data-testid="stChatInput"], [data-testid="stChatInput"] > div {border-radius:14px;background:var(--lirio-surface);}
.stApp textarea {color:var(--lirio-ink);background:var(--lirio-surface);}
.stApp textarea::placeholder {color:var(--lirio-ink);opacity:.65;}
[data-testid="stBottom"], [data-testid="stBottom"] > div, [data-testid="stBottomBlockContainer"] {background:var(--lirio-bg);}
.lirio-label {font-size:.65rem;letter-spacing:.18em;color:var(--lirio-ink);font-weight:600;margin-bottom:12px;}
.lirio-contact {padding:12px 16px;border:1px solid color-mix(in srgb,var(--lirio-ink) 15%,transparent);border-radius:14px;background:var(--lirio-surface);color:var(--lirio-ink);font-size:.78rem;margin:15px 0 22px;}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
</style>
""", unsafe_allow_html=True)
st.markdown('<div class="lirio-label">EL LIRIO · SIEMPRE CERCA</div>', unsafe_allow_html=True)
st.title("Hola, ¿en qué te ayudamos?")
st.caption("Un asistente para hacer más sencilla tu próxima compra.")
st.markdown('<div class="lirio-contact">Atención personal: <a href="tel:+51948656772">948 656 772</a> · Tu tienda, a una llamada.</div>', unsafe_allow_html=True)

@st.cache_data(ttl=30, show_spinner=False)
def public_catalog():
    return catalog()

@st.cache_data(ttl=60, show_spinner=False)
def public_business():
    return business()

if "messages" not in st.session_state:
    st.session_state.messages = [{"role":"assistant","text":"¡Qué bueno tenerte aquí! Soy el asistente de El Lirio. Elige una pregunta para empezar o dime qué necesitas."}]

def ask(question):
    # The conversation stays in this Streamlit session and is bounded in memory.
    response = answer(question, public_catalog() if any(w in question.lower() for w in ["producto","stock","precio","oferta","arroz","aceite","atún","atun","café","cafe","fideo","hay","tienen"]) else None, public_business())
    st.session_state.messages = (st.session_state.messages + [{"role":"user","text":question},{"role":"assistant","text":response}])[-40:]

st.markdown("**¿Por dónde empezamos?**")
cols = st.columns(2)
for i, question in enumerate(QUESTIONS):
    if cols[i % 2].button(question, key=f"quick_{i}", width="stretch"):
        ask(question)
for message in st.session_state.messages:
    with st.chat_message(message["role"], avatar="🌿" if message["role"] == "assistant" else "👤"):
        st.markdown(message["text"])
if prompt := st.chat_input("Escribe tu pregunta…", max_chars=500):
    ask(prompt)
    st.rerun()
if st.button("Empezar una nueva conversación", key="reset"):
    st.session_state.messages = [{"role":"assistant","text":"Empecemos de nuevo. ¿Qué necesitas para tu próxima compra?"}]
    st.rerun()
st.caption("Respuestas por reglas y catálogo público. No realiza pagos ni consulta información privada de pedidos.")
