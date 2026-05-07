import { Link } from "react-router-dom";

const InscriptionView = ({
  theme,
  lang,
  t,
  form,
  erreur,
  succes,
  avatar,
  avatarUrl,
  avatarModalOpen,
  avatarStylesByGender,
  getPreviewAvatarUrl,
  setAvatarModalOpen,
  handleChange,
  handleSubmit,
  toggleTheme,
  changeLang,
  handleAvatarChange,
  generateRandomAvatar,
}) => {
  const AvatarPreview = ({ small = false }) => (
    <div className={small ? "avatar-preview small" : "avatar-preview"}>
      <img
        className="dicebear-avatar-img"
        src={avatarUrl}
        alt="Avatar DiceBear"
      />
    </div>
  );

  return (
    <>
      <div className={`register-bg ${theme}`}>
        <div className="stars">
          <span className="star" style={{ top: "12%", left: "8%" }}>⭐</span>
          <span className="star" style={{ top: "8%", right: "12%", animationDelay: "1.1s" }}>✨</span>
          <span className="star" style={{ bottom: "22%", left: "6%", animationDelay: "2.3s" }}>⭐</span>
          <span className="star" style={{ bottom: "16%", right: "8%", animationDelay: "0.7s" }}>✨</span>
          <span className="star" style={{ top: "42%", left: "3%", animationDelay: "1.8s" }}>🌟</span>
          <span className="star" style={{ top: "30%", right: "4%", animationDelay: "3s" }}>🌟</span>
        </div>

        <div className="register-card">
          <div className="lang-switch">
            <button className={`lang-btn ${lang === "fr" ? "active" : ""}`} onClick={() => changeLang("fr")} type="button">FR</button>
            <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => changeLang("en")} type="button">EN</button>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} type="button">
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div className="mascot-wrap">
            <div className="mascot">
              <div className="owl-body">
                <div className="owl-tummy" />
                <div className="owl-wing left" />
                <div className="owl-wing right" />
                <div className="owl-book" />
              </div>

              <div className="owl-head">
                <div className="owl-cap" />
                <div className="owl-tuft left" />
                <div className="owl-tuft right" />
                <div className="owl-eyes">
                  <div className="owl-eye-ring"><div className="owl-eye-pupil" /></div>
                  <div className="owl-eye-ring"><div className="owl-eye-pupil" /></div>
                </div>
                <div className="owl-beak" />
              </div>
            </div>
          </div>

          <h2 className="register-title">SOURDI</h2>
          <p className="register-subtitle">{t[lang].title}</p>

          {erreur && <div className="register-error"><span>😬</span> {erreur}</div>}
          {succes && <div className="register-success"><span>📧</span> {succes}</div>}

          <div className="register-form-scroll">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="full">
                  <div className="avatar-choice-card">
                    <div className="avatar-choice-info">
                      <AvatarPreview small />
                      <div>
                        <span>{t[lang].chooseAvatar}</span>
                        <p className="avatar-choice-style">
                          {avatar.gender === "male" ? "Boy" : "Girl"} · {avatarStylesByGender[avatar.gender].find((style) => style.value === avatar.style)?.label}
                        </p>
                      </div>
                    </div>
                    <button
                      className="avatar-choice-btn"
                      type="button"
                      onClick={() => setAvatarModalOpen(true)}
                    >
                      ✨ {t[lang].customizeAvatar}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="field-label">{t[lang].firstName}</label>
                  <input className="register-input" type="text" name="user_first_name" placeholder={t[lang].firstName} value={form.user_first_name} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].lastName}</label>
                  <input className="register-input" type="text" name="user_last_name" placeholder={t[lang].lastName} value={form.user_last_name} onChange={handleChange} required />
                </div>

                <div className="full">
                  <label className="field-label">{t[lang].email}</label>
                  <input className="register-input" type="email" name="user_email" placeholder="email@exemple.com" value={form.user_email} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].password}</label>
                  <input className="register-input" type="password" name="password" placeholder={t[lang].password} value={form.password} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].confirmPassword}</label>
                  <input className="register-input" type="password" name="confirmPassword" placeholder={t[lang].confirmPassword} value={form.confirmPassword} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].dob}</label>
                  <input className="register-input" type="date" name="user_dob" value={form.user_dob} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].phone}</label>
                  <input className="register-input" type="tel" name="user_phone" placeholder={t[lang].phone} value={form.user_phone} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].grade}</label>
                  <select
                    className="register-input register-select"
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- {t[lang].grade} --</option>
                    {t[lang].gradeOptions.map((gradeOption) => (
                      <option key={gradeOption.value} value={gradeOption.value}>
                        {gradeOption.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label">{t[lang].gouvernorat}</label>
                  <select
                    className="register-input register-select"
                    name="gouvernorat"
                    value={form.gouvernorat}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- {t[lang].gouvernorat} --</option>
                    <option value="Ariana">Ariana</option>
                    <option value="Beja">Béja</option>
                    <option value="Ben Arous">Ben Arous</option>
                    <option value="Bizerte">Bizerte</option>
                    <option value="Gabes">Gabès</option>
                    <option value="Gafsa">Gafsa</option>
                    <option value="Jendouba">Jendouba</option>
                    <option value="Kairouan">Kairouan</option>
                    <option value="Kasserine">Kasserine</option>
                    <option value="Kebili">Kébili</option>
                    <option value="Kef">Le Kef</option>
                    <option value="Mahdia">Mahdia</option>
                    <option value="Manouba">Manouba</option>
                    <option value="Medenine">Médenine</option>
                    <option value="Monastir">Monastir</option>
                    <option value="Nabeul">Nabeul</option>
                    <option value="Sfax">Sfax</option>
                    <option value="Sidi Bouzid">Sidi Bouzid</option>
                    <option value="Siliana">Siliana</option>
                    <option value="Sousse">Sousse</option>
                    <option value="Tataouine">Tataouine</option>
                    <option value="Tozeur">Tozeur</option>
                    <option value="Tunis">Tunis</option>
                    <option value="Zaghouan">Zaghouan</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">{t[lang].delegation}</label>
                  <input className="register-input" type="text" name="delegation" placeholder={t[lang].delegation} value={form.delegation} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].region}</label>
                  <input className="register-input" type="text" name="region" placeholder={t[lang].region} value={form.region} onChange={handleChange} required />
                </div>

                <div className="full">
                  <label className="field-label">{t[lang].school}</label>
                  <input className="register-input" type="text" name="school_name" placeholder={t[lang].school} value={form.school_name} onChange={handleChange} required />
                </div>

                <button className="register-btn" type="submit">
                  {t[lang].button}
                </button>
              </div>
            </form>
          </div>

          <div className="register-footer">
            <div className="register-divider">
              <div className="divider-line" />
              <span className="divider-text">{t[lang].divider}</span>
              <div className="divider-line" />
            </div>

            <p className="register-link-area">
              {t[lang].haveAccount} <Link to="/login">{t[lang].login}</Link>
            </p>
          </div>
        </div>

        {avatarModalOpen && (
          <div className="avatar-modal-overlay">
            <div className="avatar-modal">
              <div className="avatar-modal-header">
                <h3 className="avatar-modal-title">✨ {t[lang].customizeAvatar}</h3>
                <button className="avatar-close-btn" type="button" onClick={() => setAvatarModalOpen(false)}>×</button>
              </div>

              <div className="avatar-builder">
                <div className="avatar-preview-box">
                  <AvatarPreview />
                </div>

                <div className="avatar-controls">
                  <div className="avatar-row">
                    <label className="field-label">{t[lang].gender}</label>
                    <div className="avatar-options">
                      {[
                        { value: "female", label: "👧 Girl" },
                        { value: "male", label: "👦 Boy" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`avatar-option-btn ${avatar.gender === option.value ? "active" : ""}`}
                          onClick={() => handleAvatarChange("gender", option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="avatar-row">
                    <label className="field-label">{t[lang].avatarStyle}</label>
                    <div className="avatar-style-grid">
                      {avatarStylesByGender[avatar.gender].map((style) => (
                        <button
                          key={style.value}
                          type="button"
                          className={`avatar-style-card ${avatar.style === style.value ? "active" : ""}`}
                          onClick={() => handleAvatarChange("style", style.value)}
                        >
                          <img src={getPreviewAvatarUrl(style.value)} alt={style.label} />
                          <span>{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="avatar-row">
                    <label className="field-label">{t[lang].avatarSeed}</label>
                    <input
                      className="avatar-seed-input"
                      type="text"
                      value={avatar.seed}
                      onChange={(e) => handleAvatarChange("seed", e.target.value)}
                      placeholder="avatar-name"
                    />
                  </div>

                  <div className="avatar-row">
                    <button className="avatar-choice-btn" type="button" onClick={generateRandomAvatar}>
                      🎲 {t[lang].randomAvatar}
                    </button>
                  </div>
                </div>
              </div>

              <button className="avatar-save-btn" type="button" onClick={() => setAvatarModalOpen(false)}>
                ✨ 💜 {t[lang].saveAvatar} 💜 ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InscriptionView;