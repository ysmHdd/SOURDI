import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  getSeancesCalendrier,
  ajouterSeanceCalendrier,
  modifierSeanceCalendrier,
  supprimerSeanceCalendrier,
} from "../../api/calendrierApi";

import "./calendrier.css";

const Calendrier = () => {
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

  const events = seances.map((seance) => ({
    id: seance._id,
    title: seance.matiere,
    start: `${seance.date}T${seance.heureDebut}`,
    end: `${seance.date}T${seance.heureFin}`,
    extendedProps: seance,
  }));

  const ouvrirAjout = (info) => {
    setModeEdition(false);
    setIdSeance(null);
    setFormulaire({
      matiere: "",
      date: info.dateStr,
      heureDebut: "",
      heureFin: "",
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
      alert("Erreur lors de l'enregistrement");
    }
  };

  const supprimerSeance = async () => {
    try {
      await supprimerSeanceCalendrier(idSeance);
      setModalOuvert(false);
      chargerSeances();
    } catch (erreur) {
      console.error(erreur);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="calendrier-page">
      <div className="calendrier-header">
        <div>
          <h1>Calendrier d'étude</h1>
          <p>Planifie tes heures de révision par matière.</p>
        </div>

        <button
          className="btn-ajouter"
          onClick={() => {
            setModeEdition(false);
            setIdSeance(null);
            setFormulaire({
              matiere: "",
              date: "",
              heureDebut: "",
              heureFin: "",
            });
            setModalOuvert(true);
          }}
        >
          + Ajouter
        </button>
      </div>

      <div className="calendrier-card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          dateClick={ouvrirAjout}
          eventClick={ouvrirEdition}
          height="auto"
          locale="fr"
          buttonText={{
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
          }}
        />
      </div>

      {modalOuvert && (
        <div className="modal-overlay">
          <div className="modal-calendrier">
            <div className="modal-header">
              <h2>{modeEdition ? "Modifier la séance" : "Ajouter une séance"}</h2>
              <button onClick={() => setModalOuvert(false)}>×</button>
            </div>

            <form onSubmit={enregistrerSeance} className="form-calendrier">
              <label>Matière</label>
              <input
                type="text"
                name="matiere"
                value={formulaire.matiere}
                onChange={changerFormulaire}
                placeholder="Ex: Math, Français..."
                required
              />

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formulaire.date}
                onChange={changerFormulaire}
                required
              />

              <label>Heure début</label>
              <input
                type="time"
                name="heureDebut"
                value={formulaire.heureDebut}
                onChange={changerFormulaire}
                required
              />

              <label>Heure fin</label>
              <input
                type="time"
                name="heureFin"
                value={formulaire.heureFin}
                onChange={changerFormulaire}
                required
              />

              <div className="modal-actions">
                {modeEdition && (
                  <button
                    type="button"
                    className="btn-supprimer"
                    onClick={supprimerSeance}
                  >
                    Supprimer
                  </button>
                )}

                <button type="submit" className="btn-enregistrer">
                  {modeEdition ? "Modifier" : "Ajouter"}
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