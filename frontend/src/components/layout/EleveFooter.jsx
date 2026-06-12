import { useTranslation } from "react-i18next";
import "./eleveFooter.css";

export default function EleveFooter() {
  const { t } = useTranslation();

  return (
    <footer className="eleve-footer">
      <div className="eleve-footer-brand">
        <h3>SOURDI</h3>
      </div>

      <div className="eleve-footer-center">
        <span>{t("footer.description")}</span>
      </div>

      <div className="eleve-footer-info">
        <span>{t("footer.copyright")}</span>
      </div>
    </footer>
  );
}