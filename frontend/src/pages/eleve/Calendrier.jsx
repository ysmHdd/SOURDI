import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useAuth } from "../../context/AuthContext";
import {
  getSeancesCalendrier,
  ajouterSeanceCalendrier,
  modifierSeanceCalendrier,
  supprimerSeanceCalendrier,
} from "../../api/calendrierApi";

import EleveHeader from "../../components/layout/EleveHeader";
import EleveSidebar from "../../components/layout/EleveSidebar";
import EleveFooter from "../../components/layout/EleveFooter";

import "./calendrier.css";

const Calendrier = () => {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const notifRef = useRef(null);

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [lang, setLang] = useState(localStorage.getItem("i18nextLng") || "fr");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [seances, setSeances] = useState([]);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [idSeance, setIdSeance] = useState(null);

  const [formulaire, setFormulaire] = useState({
    matiere: "",
    date: "",
    heureDebut: "",
    heureFin: "",
  });

  const enregistrerActiviteCoins = () => {};

  const chargerSeances = async () => {
    try {
      const res = await getSeancesCalendrier();
      setSeances(res.data || []);
    } catch (erreur) {
      console.error(erreur);
    }
  };

  useEffect(() => {
    chargerSeances();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("i18nextLng", lang);
  }, [lang]);

  const events = seances.map((seance) => ({
    id: seance._id,
    title: seance.matiere,
    start: `${seance.date}T${seance.heureDebut}`,
    end: `${seance.date}T${seance.heureFin}`,
    extendedProps: seance,
  }));

  const ouvrirAjout = (info) => {
    const clickedDate = info.date;

    const date = clickedDate.toISOString().slice(0, 10);

    const heureDebut = clickedDate.toTimeString().slice(0, 5);

    const endDate = new Date(clickedDate);
    endDate.setHours(endDate.getHours() + 1);

    const heureFin = endDate.toTimeString().slice(0, 5);

    setModeEdition(false);
    setIdSeance(null);

    setFormulaire({
      matiere: "",
      date,
      heureDebut,
      heureFin,
    });

    setModalOuvert(true);
  };

  const ouvrirEdition = (info) => {
    const seance = info.event.extendedProps;

    setModeEdition(true);
    setIdSeance(seance._id);
    setFormulaire({
      matiere: seance.matiere,
      date: seance.date,
      heureDebut: seance.heureDebut,
      heureFin: seance.heureFin,
    });
    setModalOuvert(true);
  };

  const changerFormulaire = (e) => {
    setFormulaire({
      ...formulaire,
      [e.target.name]: e.target.value,
    });
  };

  const enregistrerSeance = async (e) => {
    e.preventDefault();

    try {
      if (modeEdition) {
        await modifierSeanceCalendrier(idSeance, formulaire);
      } else {
        await ajouterSeanceCalendrier(formulaire);
      }

      setModalOuvert(false);
      chargerSeances();
    } catch (erreur) {
      console.error(erreur);
      alert(t("calendrier.erreurEnregistrement"));
    }
  };

  const supprimerSeance = async () => {
    try {
      await supprimerSeanceCalendrier(idSeance);
      setModalOuvert(false);
      chargerSeances();
    } catch (erreur) {
      console.error(erreur);
      alert(t("calendrier.erreurSuppression"));
    }
  };

  return (
    <div className={`acc-root ${dark ? "dark" : "light"}`}>
      <EleveHeader
        lang={lang}
        setLang={setLang}
        dark={dark}
        setDark={setDark}
        solde={0}
        streak={0}
        profil={null}
        utilisateur={utilisateur}
        notifRef={notifRef}
        notifOpen={false}
        setNotifOpen={() => {}}
        notifNonLues={0}
        notifFiltre="tout"
        setNotifFiltre={() => {}}
        notificationsAffichees={[]}
        enregistrerActiviteCoins={enregistrerActiviteCoins}
        ouvrirNotification={() => {}}
        toutMarquerLu={() => {}}
        supprimerNotification={() => {}}
        getAvatarUrl={() => ""}
        getNotificationIcon={() => "NT"}
        deconnexion={deconnexion}
        navigate={navigate}
      />

      <div className="acc-layout">
        <EleveSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          enregistrerActiviteCoins={enregistrerActiviteCoins}
        />

        <div className={`acc-page-content ${sidebarOpen ? "sidebar-open" : ""}`}>
          <main className="calendrier-page">
           
            

             

            <div className="calendrier-card">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                direction="ltr"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                dateClick={ouvrirAjout}
                eventClick={ouvrirEdition}
                height="auto"
                locale={lang}
                buttonText={{
                  today: t("calendrier.aujourdhui"),
                  month: t("calendrier.mois"),
                  week: t("calendrier.semaine"),
                  day: t("calendrier.jour"),
                }}
              />
            </div>
          </main>

          <EleveFooter />
        </div>
      </div>

      {modalOuvert && (
        <div className="modal-overlay">
          <div className="modal-calendrier">
            <div className="modal-header">
              <h2>{modeEdition ? t("calendrier.modifierSeance") : t("calendrier.ajouterSeance")}</h2>
              <button onClick={() => setModalOuvert(false)} type="button">
                ×
              </button>
            </div>

            <form onSubmit={enregistrerSeance} className="form-calendrier">
              <label>{t("calendrier.matiere")}</label>
              <input
                type="text"
                name="matiere"
                value={formulaire.matiere}
                onChange={changerFormulaire}
                placeholder={t("calendrier.placeholderMatiere")}
                required
              />

              <label>{t("calendrier.date")}</label>
              <input
                type="date"
                name="date"
                value={formulaire.date}
                onChange={changerFormulaire}
                dir="ltr"
                required
              />

              <label>{t("calendrier.heureDebut")}</label>
              <input
                type="time"
                name="heureDebut"
                value={formulaire.heureDebut}
                onChange={changerFormulaire}
                dir="ltr"
                required
              />

              <label>{t("calendrier.heureFin")}</label>
              <input
                type="time"
                name="heureFin"
                value={formulaire.heureFin}
                onChange={changerFormulaire}
                dir="ltr"
                required
              />

              <div className="modal-actions">
                {modeEdition && (
                  <button
                    type="button"
                    className="btn-supprimer"
                    onClick={supprimerSeance}
                  >
                    {t("calendrier.supprimer")}
                  </button>
                )}

                <button type="submit" className="btn-enregistrer">
                  {modeEdition ? t("calendrier.modifier") : t("calendrier.ajouter")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendrier;