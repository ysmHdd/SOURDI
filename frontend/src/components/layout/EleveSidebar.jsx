import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
        aria-label={open ? t("sidebar.fermerMenu") : t("sidebar.ouvrirMenu")}
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
            <span>{t("sidebar.accueil")}</span>
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
            <span>{t("sidebar.marketplace")}</span>
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
            <span>{t("sidebar.panier")}</span>
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
            <span>{t("sidebar.exercices")}</span>
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
            <span>{t("sidebar.calendrier")}</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}