// ==================== SIMULAÇÃO DO DRONE IRRIGADOR ====================

// Elementos do DOM
const plants = document.querySelectorAll('.plant');
const droneStatus = document.getElementById('droneStatus');
const waterProgress = document.getElementById('waterProgress');
const waterText = document.getElementById('waterText');
const irrigatedCountSpan = document.getElementById('irrigatedCount');
const waterSavedSpan = document.getElementById('waterSaved');

// Variáveis de estado
let waterUsed = 0;
const maxWater = 100;
let irrigatedPlants = 0;
const waterPerIrrigation = 15;

/**
 * Atualiza a barra de progresso do reservatório
 */
function updateProgress() {
    const percent = (waterUsed / maxWater) * 100;
    waterProgress.style.width = percent + '%';
    waterProgress.textContent = Math.floor(percent) + '%';
    waterText.textContent = Math.floor(percent) + '%';
    
    if (waterUsed >= maxWater) {
        waterProgress.style.background = '#ef6c00';
        droneStatus.innerHTML = '⚠️ Drone: <strong>Reservatório vazio! Clique em "Nova Sessão" para recarregar.</strong>';
    } else {
        waterProgress.style.background = '#2196f3';
    }
}

/**
 * Atualiza as estatísticas da tela
 */
function updateStats() {
    irrigatedCountSpan.textContent = irrigatedPlants;
    const waterSavedLitros = irrigatedPlants * waterPerIrrigation;
    waterSavedSpan.textContent = waterSavedLitros;
}

/**
 * Irriga uma planta específica
 * @param {HTMLElement} plantElement - Elemento da planta a ser irrigada
 * @returns {boolean} - Sucesso ou falha da operação
 */
function irrigatePlant(plantElement) {
    // Verifica se há água no reservatório
    if (waterUsed >= maxWater) {
        alert('⚠️ Reservatório do drone está vazio! Clique em "Nova Sessão" para recarregar.');
        return false;
    }
    
    const isDry = plantElement.classList.contains('dry');
    
    if (isDry) {
        // Atualiza visual da planta
        plantElement.classList.remove('dry');
        plantElement.classList.add('wet');
        plantElement.innerHTML = '💧 Planta ' + (parseInt(plantElement.dataset.id) + 1) + '<br><small>IRRIGADA!</small>';
        
        // Consome recursos
        waterUsed += waterPerIrrigation;
        irrigatedPlants++;
        
        // Atualiza interfaces
        updateProgress();
        updateStats();
        
        // Animação do drone
        droneStatus.innerHTML = '🚁 Drone: <strong>✈️ Irrigando planta ' + (parseInt(plantElement.dataset.id) + 1) + '...</strong> <span class="drone-flying">💨💨</span>';
        setTimeout(() => {
            if (waterUsed < maxWater) {
                droneStatus.innerHTML = '🚁 Drone: <strong>✅ Em espera - Pronto para próxima irrigação!</strong>';
            }
        }, 1200);
        
        return true;
        
    } else if (plantElement.classList.contains('wet')) {
        alert('💧 Esta planta já foi irrigada hoje!');
        return false;
        
    } else if (plantElement.classList.contains('healthy')) {
        alert('🌿 Esta planta já está saudável e não precisa de irrigação.');
        return false;
    }
    
    return false;
}

/**
 * Verifica se todas as plantas estão cuidadas
 * @returns {boolean} - Missão completa ou não
 */
function checkMissionComplete() {
    const dryPlants = document.querySelectorAll('.plant.dry');
    if (dryPlants.length === 0 && waterUsed < maxWater) {
        setTimeout(() => {
            alert('🌟 Missão completa! Todas as plantas foram cuidadas pelo drone inteligente! 🌟');
        }, 500);
        return true;
    }
    return false;
}

// ==================== EVENTOS ====================

// Evento de clique nas plantas
plants.forEach(plant => {
    plant.addEventListener('click', () => {
        irrigatePlant(plant);
        checkMissionComplete();
    });
});

// Botão de irrigação automática
document.getElementById('autoIrrigateBtn').addEventListener('click', () => {
    const dryPlants = document.querySelectorAll('.plant.dry');
    
    if (dryPlants.length === 0) {
        alert('🎉 Parabéns! Todas as plantas já estão saudáveis ou irrigadas! Missão cumprida!');
        return;
    }
    
    if (waterUsed >= maxWater) {
        alert('⚠️ Reservatório vazio! Clique em "Nova Sessão" para continuar a missão.');
        return;
    }
    
    let irrigated = 0;
    const interval = setInterval(() => {
        const stillDry = document.querySelector('.plant.dry');
        
        if (stillDry && waterUsed + waterPerIrrigation <= maxWater) {
            irrigatePlant(stillDry);
            irrigated++;
        } else if (waterUsed + waterPerIrrigation > maxWater && document.querySelector('.plant.dry')) {
            clearInterval(interval);
            alert('💧 Reservatório insuficiente para continuar! Clique em "Nova Sessão" para recarregar e finalizar.');
        } else {
            clearInterval(interval);
            
            if (irrigated > 0) {
                droneStatus.innerHTML = '🚁 Drone: <strong>🎉 Irrigação automática concluída! Missão realizada com sucesso!</strong> ✅';
                setTimeout(() => {
                    if (waterUsed < maxWater) {
                        droneStatus.innerHTML = '🚁 Drone: <strong>✅ Em espera</strong>';
                    }
                }, 2500);
            }
            
            checkMissionComplete();
        }
    }, 800);
});

// Botão de reset (nova sessão)
document.getElementById('resetBtn').addEventListener('click', () => {
    // Reseta variáveis
    waterUsed = 0;
    irrigatedPlants = 0;
    
    // Atualiza interfaces
    updateProgress();
    updateStats();
    
    // Dados das plantas
    const plantsData = [
        { id: 0, status: 'dry', name: 'Planta 1', emoji: '🌾' },
        { id: 1, status: 'healthy', name: 'Planta 2', emoji: '🌿' },
        { id: 2, status: 'dry', name: 'Planta 3', emoji: '🌾' },
        { id: 3, status: 'healthy', name: 'Planta 4', emoji: '🌿' },
        { id: 4, status: 'dry', name: 'Planta 5', emoji: '🌾' }
    ];
    
    // Reseta visual das plantas
    plants.forEach((plant, idx) => {
        plant.classList.remove('dry', 'wet', 'healthy');
        
        if (plantsData[idx].status === 'dry') {
            plant.classList.add('dry');
            plant.innerHTML = plantsData[idx].emoji + ' ' + plantsData[idx].name + '<br><small class="badge">SECA</small>';
        } else {
            plant.classList.add('healthy');
            plant.innerHTML = plantsData[idx].emoji + ' ' + plantsData[idx].name + '<br><small>Saudável</small>';
        }
    });
    
    // Atualiza status do drone
    droneStatus.innerHTML = '🚁 Drone: <strong>✅ Recarregado e pronto para nova missão!</strong>';
    waterProgress.style.background = '#2196f3';
    
    // Efeito visual no botão
    const btn = document.getElementById('resetBtn');
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        alert('🔄 Nova sessão iniciada! O drone está com 100 litros de água. Clique nas plantas secas (laranjas) para irrigar!');
    }, 100);
});

// ==================== INICIALIZAÇÃO ====================

/**
 * Inicializa a simulação ao carregar a página
 */
function init() {
    console.log('🚁 Projeto Agrinho 2026 - Drones Irrigadores Inteligentes carregado com sucesso!');
    updateProgress();
    updateStats();
    droneStatus.innerHTML = '🚁 Drone: <strong>✅ Sistema online! Clique nas plantas secas para iniciar a irrigação.</strong>';
}

// Executa a inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);