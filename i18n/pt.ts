import type { TranslationKey } from './types';

export const ptMessages = {
    // Timer states
    focus: 'Foco',
    break: 'Pausa',
    session: 'Sessão #',
    timeToFocus: 'Hora de focar!',
    timeForBreak: 'Hora da pausa!',
    breakTipTitle: 'Dica para a pausa',
    breakTipStand: 'Levante-se e caminhe por alguns instantes.',
    breakTipEyes: 'Desvie o olhar da tela e foque em algo mais distante.',
    breakTipStretch: 'Relaxe suavemente os ombros, o pescoço, os pulsos e as mãos.',
    breakTipWater: 'Aproveite para beber um pouco de água.',
    breakTipBreathe: 'Faça algumas respirações lentas e confortáveis.',
    breakTipPosture: 'Mude de posição e solte tensões desnecessárias.',
    breakTipScreenFree: 'Afaste-se da tela até o fim da pausa.',
    breakTipRest: 'Deixe a mente descansar sem começar outra tarefa.',
    
    // Controls
    start: 'INICIAR',
    pause: 'PAUSAR',
    resume: 'RETOMAR',
    stop: 'PARAR',
    currentTask: 'Tarefa atual',
    taskPlaceholder: 'Em que você está trabalhando?',
    saveTask: 'Salvar tarefa',
    editTask: 'Editar tarefa',
    sessionHistory: 'Histórico de sessões',
    completedSessions: 'Sessões concluídas',
    expandHistory: 'Expandir histórico de sessões',
    collapseHistory: 'Recolher histórico de sessões',
    clearHistory: 'Limpar',
    emptyHistory: 'Conclua uma sessão de foco ou pausa para vê-la aqui.',
    minutesShort: 'min',
    
    // Presets
    classic: 'Clássico 25/5',
    quick: 'Rápido 15min',
    custom: 'Personalizado',
    timerPreset: 'Preset do timer',
    focusDuration: 'Foco',
    shortBreak: 'Pausa curta',
    longBreak: 'Pausa longa',
    
    // Playlist
    lofi: 'Lo-fi',
    classical: 'Clássica',
    silence: 'Silêncio',
    gregorian: 'Cantos Gregorianos',
    catholic: 'Cantos Gregorianos',
    musicCategory: 'Categoria de música',
    musicSessionLabel: 'Música para a sessão',
    lofiSubtitle: 'Batidas suaves para foco constante',
    classicalSubtitle: 'Foco instrumental em um ritmo mais calmo',
    catholicSubtitle: 'Cantos contemplativos para sessões longas',
    playerCollapse: 'Recolher player',
    playerExpand: 'Expandir player',
    playVideo: 'Reproduzir vídeo',
    pauseVideo: 'Pausar vídeo',
    previousTrack: 'Música anterior',
    nextTrack: 'Próxima música',
    youtubeConsentTitle: 'Consentimento do player do YouTube',
    youtubeConsentSubtitle: 'Necessário antes de carregar o player embutido',
    youtubeConsentBody: 'Esta seção usa um player embutido do YouTube. Se você continuar, o seu navegador poderá se conectar ao YouTube para carregar a mídia.',
    youtubeConsentAccept: 'Permitir player do YouTube',
    youtubeConsentDecline: 'Agora não',
    youtubeConsentReview: 'Revisar consentimento do YouTube',
    youtubeConsentInline: 'O player do YouTube fica bloqueado até você permitir mídia externa para esta seção.',
    
    // Footer
    disclaimer: 'Feito para trabalho focado com sessões temporizadas e música de fundo.',
    androidFooterNotice: 'Uma versão para Android está planejada para o futuro.',
    
    // Header
    home: 'Início',
    language: 'Idioma',
    about: 'Sobre',
    contact: 'Contato',
    settings: 'Configurações',
    settingsDescription: 'Configure presets do timer, dicas de pausa, alarmes e preferências de música.',
    close: 'Fechar',

    // Ad
    adPlaceholder: 'Espaço Publicitário',

    // Landing copy
    heroEyebrow: 'Foque mais rápido com música',
    heroTitle: 'Um timer, a música certa e foco de verdade.',
    heroDescription: 'Inicie uma sessão de foco em segundos com playlists clássicas, lo-fi ou gregorianas.',
    // Settings
    alarm: 'Alarme',
    volume: 'Volume',
    alarmVolume: 'Volume do alarme',
    musicVolume: 'Volume da música',
    startMusicWithTimer: 'Iniciar música com o timer',
    showBreakTips: 'Mostrar dicas durante as pausas',
    askForOccasionalFeedback: 'Pedir feedback ocasional',
    usefulnessQuestion: 'O Focus Beat ajudou você na sua última sessão de trabalho?',
    feedbackYes: 'Sim', feedbackPartly: 'Um pouco', feedbackNo: 'Não',
    feedbackNever: 'Não perguntar novamente', dismissFeedback: 'Dispensar feedback',
    interfaceMode: 'Modo da interface',
    simpleMode: 'Simples',
    simpleModeDescription: 'Timer, tarefa e controles essenciais de música.',
    advancedMode: 'Avançado',
    advancedModeDescription: 'Controles completos de música, configurações personalizadas do timer e histórico de sessões.',
    customPresetActiveNotice: 'Um preset personalizado está ativo. Selecione um preset padrão para substituí-lo.',

    // About
    aboutTitle: 'Por que o Focus Beat existe',
    aboutIntro: 'Este projeto combina ciclos estruturados de trabalho com música de fundo para criar um espaço de foco calmo e prático.',
    focusCycleTitle: 'Sobre o ciclo de foco',
    focusCycleDescription: 'O Focus Beat usa ciclos simples de foco e pausa para ajudar a sustentar a atenção, reduzir a fadiga mental e tornar o trabalho profundo mais consistente.',
    musicTitle: 'Música para concentração',
    lofiDescription: 'O lo-fi usa imperfeições sonoras sutis e uma atmosfera constante que pode suavizar ruídos externos e facilitar o trabalho profundo.',
    classicalDescription: 'A música clássica instrumental é muito usada para estudo porque evita distrações por letra e ajuda a manter um ritmo cognitivo mais estável.',
    gregorianDescription: 'O canto gregoriano oferece uma textura repetitiva e contemplativa que pode ajudar algumas pessoas a manter calma e foco em sessões mais longas.',
    footerCopyright: 'Focus Beat'
  } satisfies Record<TranslationKey, string>;
