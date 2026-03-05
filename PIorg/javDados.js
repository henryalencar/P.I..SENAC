

let currentStep = 1;
const totalSteps = 4;
const form = document.getElementById('anamneseForm');

// Função para exibir o Modal de Erro
function showModal(message) {
    document.getElementById('errorMessage').innerText = message;
    document.getElementById('errorModal').classList.remove('hidden');
}

// Função para formatar campos (CPF e Telefone)
function formatInput(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); 
        let formattedValue = '';

        if (e.target.id === 'cpf') {
            value = value.substring(0, 11);
            formattedValue = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, (match, p1, p2, p3, p4) => 
                `${p1}.${p2}.${p3}-${p4}`.slice(0, 14)
            );
        } else if (e.target.id === 'telefone' || e.target.id === 'tel_emergencia') {
            // Suporta 10 ou 11 dígitos (com DDD)
            value = value.substring(0, 11);
            formattedValue = value.replace(/(\d{2})(\d{4,5})(\d{4})/, (match, p1, p2, p3) => 
                `(${p1}) ${p2}-${p3}`
            );
        }
        e.target.value = formattedValue;
    });
}

// Inicialização dos formatadores e da exibição
document.addEventListener('DOMContentLoaded', () => {
    formatInput(document.getElementById('cpf'));
    formatInput(document.getElementById('telefone'));
    formatInput(document.getElementById('tel_emergencia'));
    updateStepDisplay();
    
    // Adiciona listener para preencher nome no Termo
    document.getElementById('nome').addEventListener('input', updateConsentimentoName);
    updateConsentimentoName(); 
});

// Atualiza o nome do cliente no Termo de Consentimento (Passo 4)
function updateConsentimentoName() {
    const nomeInput = document.getElementById('nome').value.toUpperCase() || 'CLIENTE';
    document.getElementById('consentimento_nome_placeholder').innerText = nomeInput;
}

// Função para validar campos obrigatórios da etapa atual
function validateStep(stepId) {
    const step = document.getElementById(stepId);
    const requiredFields = step.querySelectorAll('[required]');
    let isValid = true;
    
    // Remove bordas de erro de todos os campos antes de revalidar
    step.querySelectorAll('.input-error').forEach(f => f.classList.remove('input-error'));
    step.querySelectorAll('.border-red-500').forEach(e => e.classList.remove('border-red-500', 'p-1', 'p-2', 'rounded', 'rounded-lg'));

    requiredFields.forEach(field => {
        
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                // Adiciona borda de erro ao redor do contêiner do checkbox/termo
                field.closest('div').classList.add('border-red-500', 'p-1', 'rounded');
            }
        } else if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.tagName === 'SELECT') {
            // Verifica se o campo não está vazio ou se é um radio/checkbox não marcado
            if (field.type !== 'radio' && field.type !== 'checkbox' && !field.value.trim()) {
                isValid = false;
                field.classList.add('input-error');
            }
        }
        
        // Validação específica para grupos de rádio (se required, verifica se algum está checado)
        if (field.type === 'radio' && field.hasAttribute('required')) {
             const radioGroupName = field.name;
             const radioGroup = document.querySelectorAll(`input[name="${radioGroupName}"]`);
             const isChecked = Array.from(radioGroup).some(radio => radio.checked);
             
             if (!isChecked && field.checked === false) { // Apenas verifica se a validação falhou
                 isValid = false;
                 // Adiciona destaque de erro ao primeiro elemento do grupo
                 radioGroup[0].closest('div.conditional-row')?.classList.add('border-red-500', 'p-2', 'rounded-lg');
             }
        }
    });
    
    // Validação específica para Tipo de Pisada (Passo 3)
    if (stepId === 'step-3') {
        const pisadaFinalInput = document.getElementById('tipo_pisada_final');
        const pisadaContainer = document.querySelector('#step-3 .flex.justify-around'); // Seleciona o container de pisada
        
        if (!pisadaFinalInput.value) {
            isValid = false;
            pisadaContainer.classList.add('border-red-500', 'p-2', 'rounded-lg');
        } else {
            pisadaContainer.classList.remove('border-red-500', 'p-2', 'rounded-lg');
        }
    }


    if (!isValid) {
        showModal("Por favor, preencha todos os campos obrigatórios (*) para continuar.");
    }
    return isValid;
}

// Função principal para atualizar a visualização das etapas
function updateStepDisplay() {
    document.querySelectorAll('.step-content').forEach(step => step.classList.add('hidden'));
    document.getElementById(`step-${currentStep}`).classList.remove('hidden');

    // Atualiza os indicadores de progresso (Dots e Labels)
    for (let i = 1; i <= totalSteps; i++) {
        const dot = document.getElementById(`dot-${i}`);
        const label = document.getElementById(`label-${i}`);
        
        dot.classList.remove('bg-primary', 'bg-gray-300', 'text-white', 'text-gray-500');
        label.classList.remove('text-primary', 'text-gray-500', 'font-semibold');

        if (i <= currentStep) {
            dot.classList.add('bg-primary', 'text-white');
            label.classList.add('text-primary', 'font-semibold');
        } else {
            dot.classList.add('bg-gray-300', 'text-gray-500');
            label.classList.add('text-gray-500', 'font-medium');
        }
    }
}

// Função para avançar a etapa
function nextStep() {
    if (validateStep(`step-${currentStep}`)) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Função para voltar a etapa
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// expõe as funções para o onclick no HTML
window.nextStep = nextStep;
window.prevStep = prevStep;
window.toggleDetail = toggleDetail;
window.toggleMultiDetail = toggleMultiDetail;
window.selectPisada = selectPisada;


// Função para mostrar/esconder campos detalhe para radio buttons (Sim/Não)
function toggleDetail(id, show) {
    const detailElement = document.getElementById(id);
    const input = detailElement.querySelector('input, textarea');
    
    if (show) {
        detailElement.classList.remove('hidden');
        if(input) input.setAttribute('required', 'required');
    } else {
        detailElement.classList.add('hidden');
        if(input) {
            input.removeAttribute('required');
            input.value = '';
            input.classList.remove('input-error');
        }
    }
}

// Função para mostrar/esconder campo detalhe para múltiplos checkboxes (Lesões)
function toggleMultiDetail() {
    const checkboxes = document.querySelectorAll('#step-3 input[name="lesoes_pes"]');
    const detailArea = document.getElementById('lesoes-detail-area');
    const detailTextarea = document.getElementById('lesoes_detalhe');
    let anyChecked = false;
    
    checkboxes.forEach(cb => {
        if (cb.checked) {
            anyChecked = true;
        }
    });

    if (anyChecked) {
        detailArea.classList.remove('hidden');
        detailTextarea.setAttribute('required', 'required'); 
    } else {
        detailArea.classList.add('hidden');
        detailTextarea.removeAttribute('required');
        detailTextarea.value = '';
        detailTextarea.classList.remove('input-error');
    }
}

// Função para selecionar a pisada visualmente (CORRIGIDA)
function selectPisada(type) {
    // Note: O radio button ID deve ser 'radio-supinada', 'radio-neutra', etc.
    const radio = document.getElementById(`radio-${type.toLowerCase()}`);
    
    // 1. Marca o radio button correspondente
    if (radio) {
        radio.checked = true;
    }
    
    // 2. Remove a seleção visual (borda/destaque) de todos os ícones
    const icons = document.querySelectorAll('.pisada-icon');
    icons.forEach(icon => icon.classList.remove('selected'));
    
    // 3. Adiciona a seleção visual (borda/destaque) ao ícone clicado
    const iconToSelect = document.getElementById(`pisada-${type.toLowerCase()}`);
    if (iconToSelect) {
        iconToSelect.classList.add('selected');
    }
    
    // 4. Atualiza o valor do campo oculto para validação
    document.getElementById('tipo_pisada_final').value = type;

    // Remove a borda de erro do container de seleção (se a validação falhou antes)
    const pisadaContainer = iconToSelect.closest('div.flex.justify-around');
    if (pisadaContainer) {
        pisadaContainer.classList.remove('border-red-500', 'p-2', 'rounded-lg');
    }
}


// Manipulador do Submit do Formulário
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (validateStep('step-4')) {
        const submitButton = document.getElementById('submitButton');
        document.getElementById('submitText').innerText = 'Enviando...';
        document.getElementById('loader').classList.remove('hidden');
        submitButton.disabled = true;

        // --- LÓGICA DE ENVIO REAL ---
        
        // Simulação de delay de envio (2 segundos)
        setTimeout(() => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log("--- Dados Finais Coletados ---");
            console.log(data);
            
            // Exibir a etapa de sucesso
            document.getElementById('step-4').classList.add('hidden');
            document.getElementById('step-5').classList.remove('hidden');
            // Esconder o indicador de progresso após a conclusão
            document.querySelector('.flex.justify-between.items-start.mb-8').classList.add('hidden');

        }, 2000);
    }
});