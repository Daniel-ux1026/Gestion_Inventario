"""Streamlit customer assistant embedded by the React storefront."""
import os
import streamlit as st
from knowledge import QUESTIONS, CONTACT, answer, catalog, business

st.set_page_config(page_title="Asistente Lirio", page_icon="🌿", layout="centered")
st.markdown("""
<style>
.stApp {background:linear-gradient(135deg,#f7f6ef,#e9eddf);}
.block-container {padding:2rem 1.4rem 6rem;max-width:740px;}
h1 {font-size:2.2rem!important;letter-spacing:-.05em;font-weight:550!important;color:#405735;}
[data-testid="stChatMessage"] {border:1px solid #ffffffb3;border-radius:18px;background:#ffffff70;}
.stButton button {border-radius:12px;border:1px solid #d4dec8;background:#f7f8f0;font-size:.8rem;min-height:44px;color:#5a7049;}
.stButton button:hover {border-color:#8ca077;background:#e8efdc;color:#415936;}
[data-testid="stChatInput"] {border-radius:14px;}
.lirio-label {font-size:.65rem;letter-spacing:.18em;color:#8b9979;font-weight:600;margin-bottom:12px;}
.lirio-contact {padding:12px 16px;border:1px solid #dbe3ce;border-radius:14px;background:#edf2e5;color:#75866a;font-size:.78rem;margin:15px 0 22px;}
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
