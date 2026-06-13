import { useState } from "react";

const STEPS = ["perfil", "contexto", "plan"];

const profileFields = [
  { key: "nombre", label: "¿Cómo te llamas?", placeholder: "Tu nombre", type: "text" },
  { key: "edad", label: "¿Cuántos años tienes?", placeholder: "Ej: 24", type: "number" },
  { key: "ciudad", label: "¿En qué ciudad vives?", placeholder: "Ej: Madrid", type: "text" },
  { key: "fisico", label: "Describe tu forma física actual", placeholder: "Ej: delgado, activo, sedentario...", type: "text" },
  { key: "hobbies", label: "¿Cuáles son tus hobbies e intereses?", placeholder: "Ej: guitarra, fútbol, lectura, gaming, dibujo...", type: "text" },
  { key: "objetivos", label: "¿Qué quieres mejorar o lograr este verano?", placeholder: "Ej: aprender inglés, ponerme en forma, leer más...", type: "text" },
  { key: "dieta", label: "¿Tienes preferencias o restricciones alimentarias?", placeholder: "Ej: vegetariano, sin gluten, me gusta cocinar...", type: "text" },
  { key: "presupuesto", label: "¿Con qué presupuesto cuentas hoy?", placeholder: "Ej: sin gastar, algo de dinero, sin límite", type: "text" },
];

const contextFields = [
  { key: "compania", label: "¿Con quién estás hoy?", placeholder: "Solo, con amigos, en familia, con pareja...", type: "text" },
  { key: "ubicacion", label: "¿Dónde estás / puedes estar?", placeholder: "En casa, en la ciudad, en la playa, en el pueblo...", type: "text" },
  { key: "energia", label: "¿Cómo tienes la energía ahora mismo?", options: ["😴 Baja, necesito calma", "😐 Normal, lo que surja", "⚡ Alta, quiero moverme", "🔥 Al máximo, a por todo"], type: "select" },
  { key: "humor", label: "¿Cómo está tu estado de ánimo?", options: ["😔 Algo bajo", "😊 Bien, tranquilo", "😄 Contento y motivado", "🤩 Eufórico, quiero vivir"], type: "select" },
  { key: "tiempo", label: "¿Cuánto tiempo libre tienes hoy?", options: ["Unas pocas horas", "Medio día", "El día entero", "El día y la noche"], type: "select" },
  { key: "ganas", label: "¿Qué tipo de día te apetece?", options: ["Relajado y tranquilo", "Productivo y de crecimiento", "Social y divertido", "Activo y aventurero", "Sorpréndeme"], type: "select" },
];

function Input({ field, value, onChange }) {
  if (field.type === "select") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {field.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(field.key, opt)}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: value === opt ? "2px solid #6C63FF" : "2px solid #2a2a3a",
              background: value === opt ? "rgba(108,99,255,0.15)" : "rgba(255,255,255,0.04)",
              color: value === opt ? "#a89fff" : "#8888aa",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "15px",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }
  return (
    <input
      type={field.type}
      placeholder={field.placeholder}
      value={value || ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: "12px",
        border: "2px solid #2a2a3a",
        background: "rgba(255,255,255,0.04)",
        color: "#e0e0f0",
        fontSize: "15px",
        outline: "none",
        fontFamily: "inherit",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
      onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")}
    />
  );
}

function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "3px",
            flex: 1,
            borderRadius: "2px",
            background: i < current ? "#6C63FF" : "#2a2a3a",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

function PlanBlock({ emoji, titulo, contenido }) {
  const [open, setOpen] = useState(true);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid #2a2a3a",
        borderRadius: "16px",
        marginBottom: "12px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#e0e0f0",
          fontFamily: "inherit",
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: "22px" }}>{emoji}</span>
        <span style={{ flex: 1, textAlign: "left" }}>{titulo}</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          style={{
            padding: "4px 20px 20px 20px",
            color: "#aaaacc",
            fontSize: "14px",
            lineHeight: "1.7",
            whiteSpace: "pre-wrap",
          }}
        >
          {contenido}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("inicio");
  const [profileStep, setProfileStep] = useState(0);
  const [contextStep, setContextStep] = useState(0);
  const [perfil, setPerfil] = useState({});
  const [contexto, setContexto] = useState({});
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [savedProfile, setSavedProfile] = useState(null);

  const updateField = (setter) => (key, value) => setter((prev) => ({ ...prev, [key]: value }));

  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `Eres un coach de vida experto, creativo y muy personal. Tu misión es diseñar el DÍA PERFECTO para esta persona hoy, ${today}.

PERFIL DE LA PERSONA:
- Nombre: ${perfil.nombre || "No especificado"}
- Edad: ${perfil.edad || "No especificada"} años
- Ciudad: ${perfil.ciudad || "No especificada"}
- Forma física actual: ${perfil.fisico || "No especificada"}
- Hobbies e intereses: ${perfil.hobbies || "No especificados"}
- Objetivos del verano: ${perfil.objetivos || "No especificados"}
- Dieta/alimentación: ${perfil.dieta || "Sin restricciones"}
- Presupuesto hoy: ${perfil.presupuesto || "No especificado"}

CONTEXTO DE HOY:
- Compañía: ${contexto.compania || "Solo"}
- Ubicación disponible: ${contexto.ubicacion || "Su ciudad"}
- Nivel de energía: ${contexto.energia || "Normal"}
- Estado de ánimo: ${contexto.humor || "Bien"}
- Tiempo libre disponible: ${contexto.tiempo || "El día entero"}
- Tipo de día que quiere: ${contexto.ganas || "Sorpréndeme"}

Diseña un plan completo y muy detallado para HOY. Sé específico, práctico y motivador. Adapta TODO al perfil y contexto real de la persona. El plan debe incluir exactamente estas secciones en formato JSON:

{
  "saludo": "Un saludo personalizado y motivador de 2-3 frases para arrancar el día, mencionando su nombre y algo específico de su situación hoy",
  "bloques": [
    {
      "emoji": "🌅",
      "titulo": "Mañana — Arranca el día",
      "contenido": "Plan detallado de la mañana con horarios específicos, actividades concretas adaptadas a su energía y hobbies. Incluye rutina física si procede, desayuno ideal para su dieta, etc."
    },
    {
      "emoji": "☀️",
      "titulo": "Mediodía — A tope",
      "contenido": "Plan del mediodía: actividad principal del día, comida concreta y receta o lugar donde comer, cómo aprovechar el tiempo según dónde está y con quién"
    },
    {
      "emoji": "🌤️",
      "titulo": "Tarde — Crece y disfruta",
      "contenido": "Tarde dedicada a crecimiento personal, hobby, aprendizaje o aventura. Sé creativo y específico según sus intereses. Incluye algo nuevo o retador."
    },
    {
      "emoji": "🌙",
      "titulo": "Noche — Cierra el día bien",
      "contenido": "Plan nocturno: cena saludable y apetecible, actividad de relax o social, rutina de cierre, reflexión del día y preparación para mañana"
    },
    {
      "emoji": "🍽️",
      "titulo": "Menú del día completo",
      "contenido": "Desayuno, media mañana, comida, merienda y cena detallados. Adapta a su dieta y presupuesto. Incluye ideas concretas de recetas o lugares."
    },
    {
      "emoji": "💪",
      "titulo": "Reto del día",
      "contenido": "Un reto específico y alcanzable para hoy que le haga crecer. Relacionado con sus objetivos. Explica por qué hacerlo hoy y cómo empezar."
    },
    {
      "emoji": "🎯",
      "titulo": "Tip del día — Potencia tu mejor yo",
      "contenido": "Un consejo profundo y personalizado sobre cómo maximizar este día específico, con técnicas concretas adaptadas a su perfil, energía y objetivos."
    }
  ],
  "cierre": "Frase final motivadora y personal para ${perfil.nombre || "el usuario"} sobre lo que puede conseguir hoy"
}

Responde SOLO con el JSON, sin markdown, sin explicaciones extra. Sé muy específico, creativo y personal en cada sección.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content.map((i) => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPlan(parsed);
      setStep("plan");
    } catch (err) {
      setError("Algo salió mal generando tu plan. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const styles = {
    app: {
      minHeight: "100vh",
      background: "#0d0d1a",
      color: "#e0e0f0",
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 0 60px 0",
    },
    header: {
      width: "100%",
      padding: "20px 24px",
      background: "rgba(108,99,255,0.08)",
      borderBottom: "1px solid #1a1a2e",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxSizing: "border-box",
    },
    logo: {
      fontSize: "18px",
      fontWeight: 700,
      background: "linear-gradient(135deg, #6C63FF, #a89fff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    card: {
      width: "100%",
      maxWidth: "520px",
      padding: "32px 24px",
      boxSizing: "border-box",
    },
    title: {
      fontSize: "26px",
      fontWeight: 800,
      marginBottom: "8px",
      lineHeight: 1.2,
    },
    subtitle: {
      color: "#7777aa",
      fontSize: "14px",
      marginBottom: "28px",
      lineHeight: 1.5,
    },
    label: {
      display: "block",
      fontSize: "15px",
      fontWeight: 600,
      marginBottom: "10px",
      color: "#c0c0e0",
    },
    btn: {
      width: "100%",
      padding: "16px",
      borderRadius: "14px",
      border: "none",
      background: "linear-gradient(135deg, #6C63FF, #9B8FFF)",
      color: "white",
      fontSize: "16px",
      fontWeight: 700,
      cursor: "pointer",
      marginTop: "20px",
      transition: "opacity 0.2s",
      fontFamily: "inherit",
    },
    btnSecondary: {
      background: "transparent",
      border: "2px solid #2a2a3a",
      color: "#7777aa",
      marginTop: "10px",
    },
    pill: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      background: "rgba(108,99,255,0.15)",
      color: "#a89fff",
      fontSize: "12px",
      fontWeight: 600,
      marginBottom: "16px",
    },
  };

  // INICIO
  if (step === "inicio") {
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <span style={styles.logo}>✦ Mi Día Perfecto</span>
          <span style={{ fontSize: "12px", color: "#555" }}>{today}</span>
        </div>
        <div style={styles.card}>
          <div style={{ textAlign: "center", paddingTop: "40px" }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🌟</div>
            <h1 style={{ ...styles.title, fontSize: "30px", marginBottom: "16px" }}>
              Tu coach de vida diario
            </h1>
            <p style={{ ...styles.subtitle, fontSize: "16px", maxWidth: "360px", margin: "0 auto 32px" }}>
              Cada día te pregunto cómo estás, con quién y dónde. Yo te diseño el plan perfecto para que no pierdas ni un momento.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", textAlign: "left" }}>
              {["🧠 Planes adaptados a ti cada día", "🍽️ Menú, ejercicio, hobbies y crecimiento", "⚡ Generado por IA en segundos"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#8888aa", fontSize: "14px" }}>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            {savedProfile ? (
              <>
                <button style={styles.btn} onClick={() => setStep("contexto")}>
                  ¡Buenos días, {perfil.nombre || "campeón"}! → Planificar hoy
                </button>
                <button
                  style={{ ...styles.btn, ...styles.btnSecondary }}
                  onClick={() => { setSavedProfile(null); setPerfil({}); setStep("perfil"); setProfileStep(0); }}
                >
                  Cambiar perfil
                </button>
              </>
            ) : (
              <button style={styles.btn} onClick={() => setStep("perfil")}>
                Empezar — Crear mi perfil
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PERFIL
  if (step === "perfil") {
    const field = profileFields[profileStep];
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <button onClick={() => profileStep === 0 ? setStep("inicio") : setProfileStep(p => p - 1)} style={{ background: "none", border: "none", color: "#7777aa", cursor: "pointer", fontSize: "20px" }}>←</button>
          <span style={styles.logo}>✦ Tu perfil</span>
          <span style={{ fontSize: "12px", color: "#555" }}>{profileStep + 1}/{profileFields.length}</span>
        </div>
        <div style={styles.card}>
          <ProgressBar current={profileStep + 1} total={profileFields.length} />
          <div style={{ marginTop: "32px" }}>
            <span style={styles.pill}>Sobre ti</span>
            <h2 style={{ ...styles.title, fontSize: "22px" }}>{field.label}</h2>
            <div style={{ marginTop: "20px" }}>
              <Input field={field} value={perfil[field.key]} onChange={updateField(setPerfil)} />
            </div>
            <button
              style={{ ...styles.btn, opacity: !perfil[field.key] ? 0.5 : 1 }}
              disabled={!perfil[field.key]}
              onClick={() => {
                if (profileStep < profileFields.length - 1) {
                  setProfileStep(p => p + 1);
                } else {
                  setSavedProfile(true);
                  setStep("contexto");
                }
              }}
            >
              {profileStep < profileFields.length - 1 ? "Continuar →" : "¡Perfil listo! Planificar hoy →"}
            </button>
            {profileStep > 0 && (
              <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={() => setProfileStep(p => p - 1)}>
                ← Anterior
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CONTEXTO
  if (step === "contexto") {
    const field = contextFields[contextStep];
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <button onClick={() => contextStep === 0 ? setStep("inicio") : setContextStep(p => p - 1)} style={{ background: "none", border: "none", color: "#7777aa", cursor: "pointer", fontSize: "20px" }}>←</button>
          <span style={styles.logo}>✦ ¿Cómo está el día?</span>
          <span style={{ fontSize: "12px", color: "#555" }}>{contextStep + 1}/{contextFields.length}</span>
        </div>
        <div style={styles.card}>
          <ProgressBar current={contextStep + 1} total={contextFields.length} />
          <div style={{ marginTop: "32px" }}>
            <span style={styles.pill}>Contexto de hoy</span>
            <h2 style={{ ...styles.title, fontSize: "22px" }}>{field.label}</h2>
            <div style={{ marginTop: "20px" }}>
              <Input field={field} value={contexto[field.key]} onChange={updateField(setContexto)} />
            </div>
            <button
              style={{ ...styles.btn, opacity: !contexto[field.key] ? 0.5 : 1 }}
              disabled={!contexto[field.key]}
              onClick={() => {
                if (contextStep < contextFields.length - 1) {
                  setContextStep(p => p + 1);
                } else {
                  generatePlan();
                }
              }}
            >
              {contextStep < contextFields.length - 1 ? "Siguiente →" : "✨ Generar mi plan del día"}
            </button>
            {contextStep > 0 && (
              <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={() => setContextStep(p => p - 1)}>
                ← Anterior
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div style={{ ...styles.app, justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "60px", marginBottom: "24px", animation: "spin 2s linear infinite" }}>⚡</div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Diseñando tu día perfecto...</h2>
          <p style={{ color: "#7777aa", fontSize: "14px" }}>Analizando tu perfil y contexto</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // PLAN
  if (step === "plan" && plan) {
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <span style={styles.logo}>✦ Mi Día Perfecto</span>
          <span style={{ fontSize: "12px", color: "#555" }}>{today}</span>
        </div>
        <div style={styles.card}>
          <div style={{ marginBottom: "24px", padding: "20px", background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(155,143,255,0.08))", borderRadius: "16px", border: "1px solid rgba(108,99,255,0.3)" }}>
            <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#c0c0e0", margin: 0 }}>
              {plan.saludo}
            </p>
          </div>

          {plan.bloques?.map((bloque, i) => (
            <PlanBlock key={i} emoji={bloque.emoji} titulo={bloque.titulo} contenido={bloque.contenido} />
          ))}

          <div style={{ padding: "20px", background: "rgba(108,99,255,0.08)", borderRadius: "16px", border: "1px solid rgba(108,99,255,0.2)", marginTop: "8px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#a89fff", margin: 0, fontStyle: "italic", lineHeight: 1.6 }}>
              {plan.cierre}
            </p>
          </div>

          {error && <p style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "12px" }}>{error}</p>}

          <button
            style={{ ...styles.btn, marginTop: "24px" }}
            onClick={() => { setContexto({}); setContextStep(0); setStep("contexto"); setPlan(null); }}
          >
            🔄 Nuevo plan para hoy
          </button>
          <button
            style={{ ...styles.btn, ...styles.btnSecondary }}
            onClick={() => { setPerfil({}); setContexto({}); setProfileStep(0); setContextStep(0); setSavedProfile(null); setStep("inicio"); setPlan(null); }}
          >
            Cambiar perfil
          </button>
        </div>
      </div>
    );
  }

  return null;
}
