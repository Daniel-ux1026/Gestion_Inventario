import { Link } from "react-router-dom";
import { FiShoppingBag, FiArchive, FiCoffee, FiDroplet, FiArrowRight } from "react-icons/fi";
import { SectionTitle } from "./UI";

const categories = [
  { name: "Abarrotes", description: "Tu despensa, siempre lista.", Icon: FiShoppingBag },
  { name: "Conservas", description: "Ricos y prácticos para cada día.", Icon: FiArchive },
  { name: "Café y desayuno", description: "Empieza tu día con algo rico.", Icon: FiCoffee },
  { name: "Limpieza", description: "Todo para un hogar reluciente.", Icon: FiDroplet },
];

export default function HomeCategories() {
  return (
    <section className="home-categories" aria-label="Comprar por categoría">
      <SectionTitle eyebrow="ELIGE LO QUE NECESITAS" title="¿Qué llevamos hoy?" link="Ver toda la tienda" to="/tienda">
        <p className="category-intro">De lo esencial a tus favoritos, encuentra lo tuyo.</p>
      </SectionTitle>
      <div className="category-grid">
        {categories.map(({ name, description, Icon }) => (
          <Link className="category-tile" to={"/tienda?categoria=" + encodeURIComponent(name)} aria-label={"Explorar " + name} key={name}>
            <span className="category-icon" aria-hidden="true"><Icon /></span>
            <div className="category-copy">
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
            <span className="category-action">Ver productos <FiArrowRight aria-hidden="true" /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
