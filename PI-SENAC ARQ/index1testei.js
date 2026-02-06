// Importar Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

//  CONFIGURAÇÃO DO FIREBASE (substitua pelas suas credenciais)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variáveis globais
let currentStep = 1;
const form = document.getElementById("anamneseForm");

// Funções auxiliares
function showModal(msg) {
    document.getElementById("errorMessage").innerText = msg;
    document.getElementById("errorModal").classList.remove("hidden");
}
function updateStepDisplay() {
    document.querySelectorAll(".step-content").forEach(s => s.classList.add("hidden"));
    document.getElementById(`step-${currentStep}`).classList.remove("hidden");
    document.getElementById("dot-2").classList.toggle("bg-primary", currentStep >= 2);
    document.getElementById("label-2").classList.toggle("text-primary", currentStep >= 2);
}
function validateStep(stepId) {
    const step = document.getElementById(stepId);
    const required = step.querySelectorAll("[required]");
    for (const f of required) {
        if (!f.value.trim()) {
            showModal("Preencha todos os campos obrigatórios (*) para continuar.");
            return false;
        }
    }
    return true;
}

// Máscaras
function formatInput(input) {
    input.addEventListener("input", e => {
        let v = e.target.value.replace(/\D/g, "");
        let f = "";
        if (e.target.id === "cpf") {
            f = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        } else if (e.target.id === "telefone") {
            f = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        e.target.value = f;
    });
}
document.addEventListener("DOMContentLoaded", () => {
    formatInput(document.getElementById("cpf"));
    formatInput(document.getElementById("telefone"));
    updateStepDisplay();
});

// Navegação
window.nextStep = function() {
    if (currentStep === 1 && validateStep("step-1")) {
        currentStep = 2;
        updateStepDisplay();
    }
};
window.prevStep = function() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
};

// Envio de dados
form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validateStep("step-2")) return;

    const submitBtn = document.getElementById("submitButton");
    document.getElementById("submitText").innerText = "Enviando...";
    document.getElementById("loader").classList.remove("hidden");
    submitBtn.disabled = true;

    const dados = {
        nome: form.nome.value,
        nascimento: form.nascimento.value,
        cpf: form.cpf.value,
        telefone: form.telefone.value,
        email: form.email.value,
        profissao: form.profissao.value,
        observacoes: form.observacoes.value,
        enviadoEm: serverTimestamp()
    };

    try {
        await addDoc(collection(db, "anamneses"), dados);
        document.getElementById("step-2").classList.add("hidden");
        document.getElementById("step-3").classList.remove("hidden");
        document.getElementById("progress-container").classList.add("hidden");
    } catch (err) {
        console.error("Erro ao enviar:", err);
        showModal("Erro ao enviar os dados. Verifique sua conexão e tente novamente.");
    } finally {
        document.getElementById("submitText").innerText = "Enviar";
        document.getElementById("loader").classList.add("hidden");
        submitBtn.disabled = false;
    }
});
