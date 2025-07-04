document.addEventListener("DOMContentLoaded", () => {
  const questions = {
    start: {
      text: "🔹 Il tuo dispositivo è invasivo?",
      explanation: "Un dispositivo è invasivo se penetra nel corpo, anche solo parzialmente (es. ago, catetere, lente a contatto).",
      options: [
        { text: "Sì", next: "tipo_invasivo" },
        { text: "No", next: "software_o_attivo" }
      ]
    },
    tipo_invasivo: {
      text: "🔹 Il dispositivo è chirurgicamente invasivo?",
      explanation: "Un dispositivo è chirurgicamente invasivo se richiede un intervento medico o chirurgico per essere inserito.",
      options: [
        { text: "Sì", next: "durata_uso" },
        { text: "No", class: "Classe I o IIa", info: "Dispositivi non chirurgici invasivi sono generalmente Classe I o IIa secondo la durata." }
      ]
    },
    durata_uso: {
      text: "🔹 Quanto dura l'uso continuativo del dispositivo?",
      explanation: "Transitorio: <60 min, Breve termine: ≤30 gg, Lungo termine: >30 gg.",
      options: [
        { text: "Lungo termine (>30 giorni)", next: "impiantabile" },
        { text: "Breve termine (≤30 giorni)", next: "monitoraggio_breve" }
      ]
    },
    impiantabile: {
      text: "🔹 Il dispositivo è impiantabile e a contatto con organi vitali?",
      explanation: "Es. contatto diretto con cuore, sistema nervoso centrale, rilascio di sostanze attive.",
      options: [
        { text: "Sì", class: "Classe III", info: "Dispositivo impiantabile ad alto rischio → Classe III (Regola 8)." },
        { text: "No", class: "Classe IIb", info: "Impiantabile non critico → Classe IIb." }
      ]
    },
    monitoraggio_breve: {
      text: "🔹 Interagisce con cuore o sistema circolatorio centrale?",
      explanation: "Anche per breve durata, questa interazione aumenta il rischio.",
      options: [
        { text: "Sì", class: "Classe III", info: "Monitoraggio cardiaco anche a breve → Classe III (Regola 7)." },
        { text: "No", class: "Classe IIb", info: "Altro uso a breve termine → Classe IIb (Regola 7–8)." }
      ]
    },
    software_o_attivo: {
      text: "🔹 È un software (SaMD) o un dispositivo attivo?",
      explanation: "'Attivo' = alimentato da energia. 'SaMD' = software con funzione medica propria.",
      options: [
        { text: "Software", next: "software_tipo" },
        { text: "Dispositivo attivo", next: "attivo_tipo" },
        { text: "Nessuno dei due", class: "Classe I", info: "Dispositivi passivi e non invasivi → Classe I (Regole 1–4)." }
      ]
    },
    software_tipo: {
      text: "🔹 Qual è la funzione clinica del software?",
      explanation: "La Regola 11 distingue il rischio in base all'impatto sulla diagnosi/terapia.",
      options: [
        { text: "Supporta decisioni critiche su patologie gravi", class: "Classe III", info: "Es. supporto a diagnosi oncologica → Classe III (MDCG 2021-24)." },
        { text: "Supporta decisioni cliniche su patologie meno gravi", class: "Classe IIb", info: "Es. dosaggio farmaci → Classe IIb." },
        { text: "Supporto generico non critico", class: "Classe IIa", info: "Es. visualizzazione immagini non critiche." },
        { text: "Solo gestione dati", class: "Classe I", info: "Software non medico o a rischio minimo → Classe I." }
      ]
    },
    attivo_tipo: {
      text: "🔹 Il dispositivo attivo ha funzione terapeutica o diagnostica?",
      explanation: "Le Regole 9–10 definiscono il rischio per dispositivi attivi.",
      options: [
        { text: "Terapeutica con rilascio energia (es. laser, radiofrequenza)", class: "Classe IIb", info: "Attivo terapeutico ad alta energia → Classe IIb." },
        { text: "Diagnostica (es. imaging, monitor ECG)", class: "Classe IIa", info: "Dispositivi diagnostici attivi → Classe IIa." },
        { text: "Altro", class: "Classe I", info: "Attivo non per diagnosi/terapia → Classe I." }
      ]
    }
  };

  const toolContainer = document.getElementById("tool-container");
  const questionArea = document.getElementById("question-area");
  const explanationArea = document.getElementById("explanation-area");
  const resultArea = document.getElementById("result-area");
  const progressBar = document.getElementById("progress-bar");
  const backBtn = document.getElementById("back-btn");
  const restartBtn = document.getElementById("restart-btn");

  let history = [];
  const totalQuestions = Object.keys(questions).length;

  function showQuestion(key) {
    const q = questions[key];
    history.push(key);
    updateProgress();
    questionArea.innerHTML = `<p>${q.text}</p>` +
      q.options.map((o, i) => `<button class="option-btn" data-index="${i}">${o.text}</button>`).join("") +
      `<a class="info-toggle" onclick="toggleExplanation()">Perché questa domanda?</a>`;

    explanationArea.innerHTML = `<p><strong>Spiegazione:</strong> ${q.explanation}</p>`;
    explanationArea.classList.add("hidden");

    document.querySelectorAll(".option-btn").forEach(btn => {
      btn.addEventListener("click", handleAnswer);
    });

    backBtn.disabled = history.length <= 1;
    resultArea.classList.add("hidden");
    toolContainer.classList.remove("hidden");
  }

  function handleAnswer(e) {
    const key = history[history.length - 1];
    const selected = questions[key].options[e.target.dataset.index];
    if (selected.class) {
      showResult(selected.class, selected.info);
    } else if (selected.next) {
      showQuestion(selected.next);
    }
  }

  function showResult(className, info) {
    toolContainer.classList.add("hidden");
    resultArea.classList.remove("hidden");
    explanationArea.classList.add("hidden");
    resultArea.innerHTML = `
      <h3>✅ Classe stimata: <strong>${className}</strong></h3>
      <p>${info || ""}</p>
      <p><strong>Percorso:</strong> ${history.map(k => questions[k].text).join(" → ")}</p>
      <div class="disclaimer">
        ⚠️ Questa è una stima non vincolante. Verifica sempre con un esperto RA/QP per la classificazione ufficiale secondo MDR 2017/745 – Allegato VIII.
      </div>`;
  }

  function goBack() {
    if (history.length > 1) {
      history.pop();
      showQuestion(history.pop());
    }
  }

  function updateProgress() {
    progressBar.style.width = `${Math.min((history.length / totalQuestions) * 100, 100)}%`;
  }

  window.toggleExplanation = () => {
    explanationArea.classList.toggle("hidden");
  };

  backBtn.addEventListener("click", goBack);
  restartBtn.addEventListener("click", () => {
    history = [];
    showQuestion("start");
  });

  showQuestion("start");
});
