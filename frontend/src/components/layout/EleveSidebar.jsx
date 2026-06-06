import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaBookOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import "./EleveSidebar.css";

export default function EleveSidebar({
  open,
  setOpen,
  enregistrerActiviteCoins,
}) {

  const handleClick = () => {
    if (enregistrerActiviteCoins) {
      enregistrerActiviteCoins();
    }
  };

  return (
    <>
      <button
        className={`eleve-sidebar-toggle ${open ? "open" : ""}`}
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {open ? "×" : "≡"}
      </button>

      <aside className={`eleve-sidebar ${open ? "show" : "hide"}`}>
        <nav className="eleve-sidebar-nav">
          <NavLink
            to="/eleve"
            end
            className={({ isActive }) =>
              isActive ? "eleve-sidebar-link active" : "eleve-sidebar-link"
            }
            onClick={handleClick}
          >
            <span className="eleve-sidebar-icon">
              <FaHome />
            </span>
            <span>Accueil</span>
          </NavLink>

          <NavLink
            to="/eleve/marketplace"
            className={({ isActive }) =>
              isActive ? "eleve-sidebar-link active" : "eleve-sidebar-link"
            }
            onClick={handleClick}
          >
            <span className="eleve-sidebar-icon">
              <FaShoppingBag />
            </span>
            <span>Marketplace</span>
          </NavLink>

          <NavLink
            to="/eleve/panier"
            className={({ isActive }) =>
              isActive ? "eleve-sidebar-link active" : "eleve-sidebar-link"
            }
            onClick={handleClick}
          >
            <span className="eleve-sidebar-icon">
              <FaShoppingCart />
            </span>
            <span>Panier</span>
          </NavLink>

          <NavLink
            to="/eleve/exercices"
            className={({ isActive }) =>
              isActive ? "eleve-sidebar-link active" : "eleve-sidebar-link"
            }
            onClick={handleClick}
          >
            <span className="eleve-sidebar-icon">
              <FaBookOpen />
            </span>
            <span>Exercices</span>
          </NavLink>

          <NavLink
            to="/eleve/calendrier"
            className={({ isActive }) =>
              isActive ? "eleve-sidebar-link active" : "eleve-sidebar-link"
            }
            onClick={handleClick}
          >
            <span className="eleve-sidebar-icon">
              <FaCalendarAlt />
            </span>
            <span>Calendrier</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}