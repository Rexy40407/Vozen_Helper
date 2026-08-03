const PALETTES = {
  protection: ["#5edcf5", "#f0c56a"],
  community: ["#76dfc1", "#f0c56a"],
  management: ["#a8b0ff", "#8ee5d2"],
  utility: ["#f0c56a", "#8ee5d2"],
  social: ["#ff98b5", "#a8b0ff"],
  growth: ["#a7df78", "#f0c56a"],
  web3: ["#cb9af2", "#5edcf5"],
};

const sequence = (...rows) => rows.map(([label, title, text, status = title, tone = "signal"]) => ({ label, title, text, status, tone }));

const definition = ({ id, category, title, scene, fields = [], sample = {}, stages, finalSummary, unavailable = false, availability, renderer = null, visual = {}, themeTerms = [] }) => ({
  id,
  category,
  title,
  scene,
  availability: availability || (unavailable ? "roadmap" : "available"),
  fields,
  sample,
  stages,
  finalSummary,
  unavailable,
  renderer,
  visual,
  themeTerms,
  accent: PALETTES[category]?.[0] || "#8ee5d2",
  secondary: PALETTES[category]?.[1] || "#5edcf5",
  duration: 6200,
});

const PREVIEWS = {};
const add = (item) => { PREVIEWS[item.id] = item; };

// The registry is intentionally explicit. A configured module cannot silently
// Every known module resolves through this registry instead of a shared story.
add(definition({
  id: "community.leaderboard", category: "community", title: "Leaderboard de XP", scene: "leaderboard", unavailable: true,
  fields: ["publicEnabled", "period", "optOut"], sample: { period: "Este mês", publicEnabled: true, optOut: true },
  stages: sequence(
    ["INÍCIO", "A comunidade conversa", "As contribuições elegíveis entram no período escolhido.", "Atividade recebida", "calm"],
    ["PONTOS", "XP reunido", "O Helper agrega o progresso sem expor dados excluídos.", "XP atualizado", "signal"],
    ["ORGANIZAR", "Posições calculadas", "Os membros são ordenados pelo XP do período.", "Ranking calculado", "action"],
    ["PRIVACIDADE", "Preferências respeitadas", "A exclusão individual é aplicada antes de publicar.", "Privacidade aplicada", "success"],
    ["RESULTADO", "Leaderboard atualizado", "O painel mostra a classificação da comunidade.", "Leaderboard pronto", "success"],
  ),
  finalSummary: "O leaderboard está pronto para mostrar a progressão configurada.",
}));

add(definition({
  id: "support.welcome_channel", category: "management", title: "Canal de boas-vindas", scene: "welcome-gate", unavailable: true,
  fields: ["channel", "title", "description", "rulesChannel", "confirmationRequired"], sample: { channel: "começa-aqui", title: "Começa por aqui", rulesChannel: "regras", confirmationRequired: true },
  stages: sequence(
    ["INÍCIO", "Um membro entra", "O Helper encontra o canal de entrada configurado.", "Entrada detetada", "calm"],
    ["ORIENTAR", "Informação apresentada", "O painel explica os primeiros passos da comunidade.", "Painel mostrado", "signal"],
    ["REGRAS", "Regras disponíveis", "O canal de regras fica ligado ao primeiro passo.", "Regras ligadas", "action"],
    ["CONFIRMAR", "Confirmação solicitada", "A confirmação é pedida quando essa opção está ativa.", "Confirmação preparada", "success"],
    ["RESULTADO", "Entrada orientada", "O membro sabe onde começar sem procurar mensagens antigas.", "Onboarding pronto", "success"],
  ),
  finalSummary: "O percurso de entrada está pronto para orientar novos membros.",
}));

add(definition({
  id: "management.moderation", category: "management", title: "Moderador", scene: "moderation",
  fields: ["warnThreshold", "timeoutMinutes", "deleteAfterSeconds", "logChannel", "notifyStaff"], sample: { warnThreshold: 3, timeoutMinutes: 10, deleteAfterSeconds: 0, logChannel: "moderação", notifyStaff: true },
  stages: sequence(
    ["EVENTO", "Uma mensagem é sinalizada", "A equipa recebe um caso para rever.", "Caso recebido", "calm"],
    ["HISTÓRICO", "Avisos contabilizados", "O Helper verifica o limite de avisos configurado.", "Histórico verificado", "signal"],
    ["DECISÃO", "Ação de moderação preparada", "O timeout e a limpeza seguem os valores do módulo.", "Ação preparada", "action"],
    ["EQUIPA", "Contexto registado", "O caso e a decisão ficam disponíveis no canal da equipa.", "Registo preparado", "success"],
    ["RESULTADO", "Caso resolvido", "A moderação fica visível e consistente para a equipa.", "Moderação concluída", "success"],
  ),
  finalSummary: "A ação de moderação foi preparada localmente com os limites configurados.",
}));

add(definition({
  id: "management.custom_commands", category: "management", title: "Comandos personalizados", scene: "command",
  fields: ["triggerPrefix", "commands", "ignoredChannels", "staffOnly"], sample: { triggerPrefix: "!", commands: "regras, links", ignoredChannels: "off-topic", staffOnly: false },
  stages: sequence(
    ["ESPERA", "O servidor aguarda um comando", "O prefixo configurado identifica uma mensagem elegível.", "A aguardar", "calm"],
    ["GATILHO", "Comando reconhecido", "O nome corresponde a um comando guardado.", "Gatilho reconhecido", "signal"],
    ["VALIDAR", "Regras de uso verificadas", "Canais ignorados e acesso da equipa são respeitados.", "Permissões verificadas", "action"],
    ["RESPOSTA", "Resposta preparada", "O conteúdo reutilizável é colocado no contexto correto.", "Resposta preparada", "success"],
    ["RESULTADO", "Comando concluído", "A comunidade recebe uma resposta consistente.", "Resposta pronta", "success"],
  ),
  finalSummary: "O comando personalizado está pronto para responder no contexto permitido.",
}));

add(definition({
  id: "management.audit", category: "management", title: "Auditoria e permissões", scene: "audit",
  fields: ["logChannel", "retainDays", "notifyDestructive", "notifyPermissionChanges"], sample: { logChannel: "auditoria", retainDays: 30, notifyDestructive: true, notifyPermissionChanges: true },
  stages: sequence(
    ["EVENTO", "Uma alteração acontece", "O servidor regista uma mudança importante.", "Alteração detetada", "calm"],
    ["CAPTAR", "Contexto recolhido", "Autor, alvo, data e tipo de alteração são ligados ao evento.", "Contexto recolhido", "signal"],
    ["FILTRAR", "Alerta sensível avaliado", "A configuração decide se a equipa recebe um aviso adicional.", "Regra avaliada", "action"],
    ["REGISTAR", "Entrada criada", "O evento é preparado para o canal de auditoria.", "Registo preparado", "success"],
    ["RESULTADO", "Histórico consultável", "A equipa consegue rever o que aconteceu dentro da retenção.", "Auditoria pronta", "success"],
  ),
  finalSummary: "A alteração está pronta para ser consultada no histórico de auditoria.",
}));

add(definition({
  id: "management.privacy", category: "management", title: "Privacidade e dados", scene: "privacy",
  fields: ["retainDays", "deleteOnLeave", "allowMemberExport", "logChannel"], sample: { retainDays: 30, deleteOnLeave: true, allowMemberExport: true, logChannel: "privacidade" },
  stages: sequence(
    ["PEDIDO", "Um membro pede contexto", "O Helper recebe um pedido de dados do servidor.", "Pedido recebido", "calm"],
    ["LIMITAR", "Retenção verificada", "Só os dados dentro do período configurado entram na resposta.", "Retenção verificada", "signal"],
    ["DIREITOS", "Exportação avaliada", "A permissão de exportação é aplicada ao pedido.", "Permissão avaliada", "action"],
    ["PROTEGER", "Dados preparados", "O resultado é separado do canal público.", "Resultado protegido", "success"],
    ["RESULTADO", "Pedido pronto", "O membro recebe o próximo passo sem expor dados desnecessários.", "Privacidade respeitada", "success"],
  ),
  finalSummary: "O pedido de dados foi preparado respeitando a retenção e as permissões.",
}));

add(definition({
  id: "management.templates", category: "management", title: "Modelos e importação", scene: "template",
  fields: ["templateName", "includeFeatures", "includeRoles", "includeChannels"], sample: { templateName: "Comunidade base", includeFeatures: true, includeRoles: true, includeChannels: false },
  stages: sequence(
    ["SELECIONAR", "Configuração escolhida", "A equipa começa a preparar um modelo reutilizável.", "Modelo iniciado", "calm"],
    ["RECOLHER", "Funcionalidades reunidas", "As opções ativas entram no pacote quando selecionadas.", "Funcionalidades reunidas", "signal"],
    ["FILTRAR", "Cargos e canais avaliados", "O modelo inclui apenas os recursos pedidos.", "Conteúdo filtrado", "action"],
    ["VALIDAR", "Modelo verificado", "O pacote fica pronto para ser aplicado noutro servidor.", "Modelo validado", "success"],
    ["RESULTADO", "Modelo pronto", "A configuração pode ser reutilizada sem expor dados do servidor.", "Importação pronta", "success"],
  ),
  finalSummary: "O modelo foi preparado com os recursos selecionados.",
}));

add(definition({
  id: "community.role_panels", category: "community", title: "Painéis de cargos", scene: "role-panel",
  fields: ["channel", "panelTitle", "panelDescription", "maxRoles", "removeOnUnselect"], sample: { channel: "cargos", panelTitle: "Escolhe os teus cargos", maxRoles: 5, removeOnUnselect: true },
  stages: sequence(
    ["PUBLICAR", "Painel de cargos preparado", "A mensagem aparece no canal configurado.", "Painel preparado", "calm"],
    ["ESCOLHER", "Um membro seleciona opções", "As escolhas ficam visíveis no painel.", "Escolha recebida", "signal"],
    ["LIMITAR", "Limite de cargos verificado", "O Helper impede escolhas acima do máximo configurado.", "Limite verificado", "action"],
    ["APLICAR", "Cargo atribuído", "A seleção é convertida numa alteração de cargo.", "Cargo preparado", "success"],
    ["RESULTADO", "Painel atualizado", "O membro vê os cargos atuais e pode removê-los quando permitido.", "Escolha concluída", "success"],
  ),
  finalSummary: "O painel está pronto para gerir escolhas de cargos.",
}));

add(definition({
  id: "community.events", category: "community", title: "Eventos do servidor", scene: "event",
  fields: ["defaultDurationHours", "defaultCapacity", "announcementChannel", "reminders"], sample: { defaultDurationHours: 2, defaultCapacity: 20, announcementChannel: "eventos", reminders: true },
  stages: sequence(
    ["CRIAR", "Evento preparado", "O servidor define data, duração e capacidade.", "Evento iniciado", "calm"],
    ["PUBLICAR", "Inscrições abertas", "O anúncio chega ao canal escolhido.", "Inscrições abertas", "signal"],
    ["ACOMPANHAR", "Participantes registados", "A capacidade e as inscrições ficam atualizadas.", "Participantes atualizados", "action"],
    ["LEMBRAR", "Lembrete preparado", "Os membros recebem contexto antes do início quando ativado.", "Lembrete preparado", "success"],
    ["RESULTADO", "Evento pronto", "A comunidade sabe onde participar e quando começa.", "Evento organizado", "success"],
  ),
  finalSummary: "O evento foi preparado com inscrições, capacidade e lembretes coerentes.",
}));

add(definition({
  id: "utility.help", category: "utility", title: "Ajuda", scene: "help",
  fields: ["channel", "showAdminOnly", "includeExamples"], sample: { channel: "ajuda", showAdminOnly: true, includeExamples: true },
  stages: sequence(
    ["PERGUNTA", "Um membro procura ajuda", "A pergunta chega ao canal configurado.", "Pedido recebido", "calm"],
    ["PROCURAR", "Módulo identificado", "O Helper encontra a explicação correspondente.", "Módulo encontrado", "signal"],
    ["FILTRAR", "Detalhes de equipa protegidos", "Informação de administração só aparece a quem deve vê-la.", "Visibilidade filtrada", "action"],
    ["EXPLICAR", "Exemplo preparado", "Os exemplos aparecem quando essa opção está ativa.", "Explicação preparada", "success"],
    ["RESULTADO", "Próximo passo claro", "O membro sabe como continuar sem trocar de contexto.", "Ajuda entregue", "success"],
  ),
  finalSummary: "A resposta de ajuda está pronta com a visibilidade configurada.",
}));

add(definition({
  id: "utility.reminders", category: "utility", title: "Temporizadores", scene: "reminder",
  fields: ["channel", "defaultMinutes", "allowMembers", "announceResult"], sample: { channel: "geral", defaultMinutes: 60, allowMembers: true, announceResult: true },
  stages: sequence(
    ["AGENDAR", "Lembrete criado", "Um membro define uma hora para voltar ao assunto.", "Lembrete criado", "calm"],
    ["ESPERAR", "Temporizador em curso", "O Helper mantém o lembrete até ao momento configurado.", "Temporizador ativo", "signal"],
    ["VALIDAR", "Destinatário verificado", "A permissão para membros e o canal são respeitados.", "Destino verificado", "action"],
    ["DISPARAR", "Lembrete preparado", "A mensagem é composta no momento certo.", "Lembrete preparado", "success"],
    ["RESULTADO", "Resultado anunciado", "A comunidade recebe a mensagem quando essa opção está ativa.", "Lembrete concluído", "success"],
  ),
  finalSummary: "O lembrete foi preparado com o temporizador e o anúncio configurados.",
}));

add(definition({
  id: "social.twitch", category: "social", title: "Alertas da Twitch", scene: "social", unavailable: true,
  fields: ["sourceLogin", "targetChannelId", "messageTemplate", "mention"], sample: { sourceLogin: "rexy40407", targetChannelId: "streams", messageTemplate: "{broadcaster} está ao vivo!", mention: "@here" },
  stages: sequence(
    ["OFFLINE", "Canal a aguardar", "O Helper acompanha o canal Twitch escolhido.", "Offline", "calm"],
    ["EVENTO", "Transmissão começa", "A API confirma que o canal ficou ao vivo.", "Evento ao vivo", "signal"],
    ["VALIDAR", "Alerta correspondido", "O canal e o destino Discord passam pelas regras configuradas.", "Regra correspondida", "action"],
    ["COMPOR", "Mensagem de live preparada", "As variáveis do alerta são preenchidas antes de publicar.", "Alerta preparado", "success"],
    ["RESULTADO", "Alerta pronto", "O aviso seria publicado no canal Discord escolhido.", "Pronto para publicar", "success"],
  ),
  finalSummary: "O alerta Twitch está pronto para o canal Discord configurado.",
}));

add(definition({
  id: "protection.antispam", category: "protection", title: "Proteção contra spam", scene: "protection",
  fields: ["sensitivity", "floodCount", "duplicateLimit", "timeoutSeconds", "mentionLimit", "ignoredChannels", "ignoredRoles", "logChannel", "alertOnly"], sample: { floodCount: 6, duplicateLimit: 3, timeoutSeconds: 60, mentionLimit: 5, alertOnly: false },
  stages: sequence(
    ["NORMAL", "Canal saudável", "A conversa decorre sem sinais de flood.", "Canal saudável", "calm"],
    ["SINAL", "Mensagens repetidas chegam", "O limite de repetições é atingido.", "Sinal detetado", "signal"],
    ["DETEÇÃO", "Padrão ligado", "O Helper agrupa o conteúdo repetido numa ocorrência.", "Padrão detetado", "action"],
    ["AÇÃO", "Spam isolado", "A resposta segue o modo de alerta ou a ação configurada.", "Ação preparada", "success"],
    ["RESULTADO", "Canal protegido", "A conversa normal pode continuar sem o pico de spam.", "Proteção concluída", "success"],
  ),
  finalSummary: "O cenário de spam foi interrompido localmente conforme os limites configurados.",
}));

add(definition({
  id: "protection.antiscam", category: "protection", title: "Proteção contra fraude", scene: "protection",
  fields: ["enabledLinks", "action", "timeoutMinutes", "blockedDomains", "protectedDomains", "ignoreTrustedRoles", "logChannel"], sample: { enabledLinks: true, action: "Reter mensagem", timeoutMinutes: 10, blockedDomains: "exemplo-suspeito.com", protectedDomains: "vozen.org", ignoreTrustedRoles: false },
  stages: sequence(
    ["NORMAL", "Mensagem segura chega", "O canal recebe uma mensagem sem ligação suspeita.", "Canal saudável", "calm"],
    ["SINAL", "Ligação encontrada", "Uma ligação ou convite entra na mensagem.", "Ligação detetada", "signal"],
    ["VERIFICAR", "Domínio avaliado", "As listas protegida e bloqueada são comparadas.", "Domínio avaliado", "action"],
    ["AÇÃO", "Conteúdo isolado", "A ação configurada é preparada sem afetar domínios protegidos.", "Ação preparada", "success"],
    ["RESULTADO", "Canal protegido", "A equipa recebe o contexto da ocorrência.", "Fraude contida", "success"],
  ),
  finalSummary: "A ligação suspeita foi tratada de acordo com as listas e a ação configuradas.",
}));

add(definition({
  id: "protection.anti_raid", category: "protection", title: "Anti-raid", scene: "protection",
  fields: ["joinThreshold", "windowSeconds", "incidentMinutes", "verification", "pauseInvites", "alertOnly", "alertChannel"], sample: { joinThreshold: 12, windowSeconds: 30, incidentMinutes: 15, verification: "Elevada", pauseInvites: true, alertOnly: false, alertChannel: "segurança" },
  stages: sequence(
    ["NORMAL", "Entradas normais", "O servidor recebe membros dentro do ritmo esperado.", "Servidor estável", "calm"],
    ["SINAL", "Entradas aceleram", "O número de entradas ultrapassa a janela configurada.", "Ritmo anormal", "signal"],
    ["INCIDENTE", "Alerta de raid aberto", "A proteção liga-se durante o período definido.", "Incidente aberto", "action"],
    ["PROTEGER", "Convites controlados", "A verificação e a pausa de convites seguem a configuração.", "Proteção ativa", "success"],
    ["RESULTADO", "Servidor estabilizado", "A equipa recebe contexto para acompanhar o incidente.", "Raid contido", "success"],
  ),
  finalSummary: "O incidente de entradas anormais foi preparado com a proteção configurada.",
}));

add(definition({
  id: "protection.join_gate", category: "protection", title: "Proteção de entradas", scene: "join-gate",
  fields: ["minimumAccountDays", "requireAvatar", "action", "verifiedRole", "autoRole", "blockedNamePatterns", "logChannel"], sample: { minimumAccountDays: 7, requireAvatar: true, action: "Verificar", verifiedRole: "Membro verificado", autoRole: "Comunidade", blockedNamePatterns: "spam", logChannel: "segurança" },
  stages: sequence(
    ["ENTRADA", "Novo membro chega", "O Helper inicia as verificações básicas de entrada.", "Entrada recebida", "calm"],
    ["CONTA", "Idade da conta verificada", "A idade mínima configurada é comparada.", "Conta avaliada", "signal"],
    ["PERFIL", "Avatar e nome avaliados", "Os sinais suspeitos são comparados com os critérios definidos.", "Perfil avaliado", "action"],
    ["DECISÃO", "Ação preparada", "O membro recebe verificação, cargo ou bloqueio conforme a regra.", "Ação preparada", "success"],
    ["RESULTADO", "Entrada segura", "O servidor mantém um registo do resultado da verificação.", "Entrada concluída", "success"],
  ),
  finalSummary: "A entrada foi avaliada sem expor o membro a ações fora da configuração.",
}));

add(definition({
  id: "community.levels", category: "community", title: "Níveis e XP", scene: "levels",
  fields: ["xpMin", "xpMax", "cooldownSeconds", "stackRoles", "announceChannel", "announceTemplate", "ignoredChannels", "levelRoles"], sample: { xpMin: 15, xpMax: 30, cooldownSeconds: 60, stackRoles: false, announceChannel: "níveis" },
  stages: sequence(
    ["NORMAL", "Uma mensagem saudável chega", "Um membro contribui para a conversa.", "Comunidade ativa", "calm"],
    ["ELEGIBILIDADE", "Cooldown livre", "A mensagem qualifica-se para receber XP.", "Cooldown livre", "signal"],
    ["RECOMPENSA", "XP atribuído", "O valor fica dentro do intervalo configurado.", "Recompensa preparada", "action"],
    ["PROGRESSO", "Barra atualizada", "A progressão do membro avança em direção ao nível seguinte.", "Progresso atualizado", "success"],
    ["RESULTADO", "Novo nível iniciado", "O membro continua a partir da progressão atualizada.", "Nível alcançado", "success"],
  ),
  finalSummary: "A progressão foi atualizada com um ganho de XP determinístico neste preview.",
}));

add(definition({
  id: "community.starboard", category: "community", title: "Starboard", scene: "starboard",
  fields: ["emoji", "threshold", "channel", "allowSelfStar", "includeImages", "ignoredChannels"], sample: { emoji: "⭐", threshold: 5, channel: "starboard", allowSelfStar: false, includeImages: true },
  stages: sequence(
    ["MENSAGEM", "Uma ideia recebe reação", "A comunidade encontra uma mensagem que merece destaque.", "Mensagem recebida", "calm"],
    ["CONTAR", "Reações contabilizadas", "O Helper ignora auto-reações e canais excluídos.", "Reações contadas", "signal"],
    ["LIMIAR", "Limite alcançado", "A mensagem chega ao número de reações configurado.", "Destaque desbloqueado", "action"],
    ["DESTACAR", "Cartão preparado", "O conteúdo e as imagens permitidas são reunidos.", "Cartão preparado", "success"],
    ["RESULTADO", "Mensagem no Starboard", "A comunidade pode consultar o destaque no canal escolhido.", "Destaque publicado", "success"],
  ),
  finalSummary: "A mensagem atingiu o limiar e foi preparada para o canal Starboard.",
}));

add(definition({
  id: "community.suggestions", category: "community", title: "Sugestões", scene: "suggestions",
  fields: ["channel", "voteMode", "anonymous", "cooldownHours", "requiredRole", "staffChannel"], sample: { channel: "sugestões", voteMode: "A favor / contra", anonymous: false, cooldownHours: 24, requiredRole: "", staffChannel: "equipa" },
  stages: sequence(
    ["IDEIA", "Uma sugestão é enviada", "Um membro descreve uma melhoria para a comunidade.", "Sugestão recebida", "calm"],
    ["PUBLICAR", "Sugestão apresentada", "O texto chega ao canal configurado com a visibilidade escolhida.", "Sugestão publicada", "signal"],
    ["VOTAR", "Votos abertos", "Os membros usam o modo de votação configurado.", "Votação aberta", "action"],
    ["REVER", "Equipa acompanha o resultado", "O canal privado recebe contexto quando configurado.", "Revisão preparada", "success"],
    ["RESULTADO", "Decisão pronta", "A sugestão fica pronta para ser aceite, recusada ou revista.", "Sugestão processada", "success"],
  ),
  finalSummary: "A sugestão foi preparada com o modo de votação e a privacidade configurados.",
}));

add(definition({
  id: "community.giveaways", category: "community", title: "Giveaways", scene: "giveaway",
  fields: ["defaultDurationHours", "defaultWinners", "requiredRole", "bonusRole", "rerollHours"], sample: { defaultDurationHours: 24, defaultWinners: 1, requiredRole: "Membro", bonusRole: "Apoiador", rerollHours: 48 },
  stages: sequence(
    ["CRIAR", "Sorteio preparado", "A duração e o número de vencedores recebem os defaults configurados.", "Sorteio iniciado", "calm"],
    ["ENTRAR", "Participações abertas", "Os membros elegíveis entram no sorteio.", "Entradas abertas", "signal"],
    ["VALIDAR", "Elegibilidade verificada", "Cargo necessário e entradas extra são aplicados.", "Entradas validadas", "action"],
    ["SORTEAR", "Vencedor escolhido", "O Helper prepara o resultado sem expor dados antes da hora.", "Vencedor preparado", "success"],
    ["RESULTADO", "Prémio anunciado", "O vencedor e o eventual reroll ficam claros para a comunidade.", "Giveaway concluído", "success"],
  ),
  finalSummary: "O sorteio foi preparado com participantes e regras de elegibilidade coerentes.",
}));

add(definition({
  id: "support.tickets", category: "management", title: "Tickets", scene: "ticket",
  fields: ["category", "staffRoles", "transcriptChannel", "maxOpen", "panelTitle", "panelDescription", "closeAfterHours"], sample: { category: "Suporte", staffRoles: "Equipa", transcriptChannel: "transcrições", maxOpen: 1, panelTitle: "Precisas de ajuda?", closeAfterHours: 72 },
  stages: sequence(
    ["PEDIR", "Membro abre um ticket", "O painel explica como pedir ajuda à equipa.", "Pedido recebido", "calm"],
    ["CRIAR", "Canal privado preparado", "A categoria e os cargos da equipa controlam o acesso.", "Ticket criado", "signal"],
    ["ATENDER", "Equipa responde", "O pedido fica separado das conversas públicas.", "Atendimento ativo", "action"],
    ["REGISTAR", "Transcrição preparada", "O histórico é enviado para o destino configurado.", "Histórico preparado", "success"],
    ["RESULTADO", "Ticket resolvido", "O canal pode fechar por decisão da equipa ou por inatividade.", "Atendimento concluído", "success"],
  ),
  finalSummary: "O atendimento foi preparado com privacidade, equipa e histórico configurados.",
}));

add(definition({
  id: "support.welcome", category: "management", title: "Boas-vindas", scene: "welcome",
  fields: ["channel", "message", "delaySeconds", "sendDm", "dmMessage", "autoRole"], sample: { channel: "geral", message: "Bem-vindo, {member}!", delaySeconds: 0, sendDm: false, autoRole: "Membro" },
  stages: sequence(
    ["ESPERA", "A aguardar um novo membro", "O fluxo de boas-vindas está pronto no canal escolhido.", "A aguardar", "calm"],
    ["EVENTO", "Um membro entra", "O Helper recebe o evento de entrada.", "Membro entrou", "signal"],
    ["PERSONALIZAR", "Variáveis resolvidas", "A mensagem transforma {member} e os restantes dados disponíveis.", "Mensagem personalizada", "action"],
    ["RECEBER", "Boas-vindas preparadas", "A mensagem pública, DM e cargo seguem as opções ativas.", "Boas-vindas preparadas", "success"],
    ["RESULTADO", "Onboarding concluído", "O novo membro encontra o primeiro passo da comunidade.", "Pronto para participar", "success"],
  ),
  finalSummary: "O membro foi recebido com a mensagem e as opções configuradas.",
}));

add(definition({
  id: "management.nickname", category: "management", title: "Nickname", scene: "nickname",
  fields: ["nickname"], sample: { nickname: "Vozen Helper" },
  stages: sequence(
    ["IDENTIDADE", "Helper identificado", "O servidor reconhece o membro do bot.", "Identidade encontrada", "calm"],
    ["VALIDAR", "Nome verificado", "O nickname respeita o limite e o formato permitido.", "Nome validado", "signal"],
    ["APLICAR", "Nome preparado", "A alteração é ligada ao servidor selecionado.", "Alteração preparada", "action"],
    ["CONFIRMAR", "Pré-visualização atualizada", "A lista de membros mostra o nome escolhido.", "Identidade atualizada", "success"],
    ["RESULTADO", "Helper reconhecível", "A equipa identifica o bot sem perder o contexto da marca.", "Nickname pronto", "success"],
  ),
  finalSummary: "O nickname do Helper está pronto para o servidor selecionado.",
}));

add(definition({
  id: "management.workflows", category: "management", title: "Automações", scene: "workflow",
  fields: ["defaultAction", "logChannel", "dryRun", "workflows"], sample: { defaultAction: "Enviar mensagem", logChannel: "automações", dryRun: true, workflows: "Boas-vindas" },
  stages: sequence(
    ["GATILHO", "Um evento chega", "O fluxo aguarda um gatilho configurado pela equipa.", "Evento recebido", "calm"],
    ["CONDIÇÃO", "Regras avaliadas", "O fluxo verifica se o evento corresponde ao caminho guardado.", "Condição verificada", "signal"],
    ["MODO", "Teste ou execução selecionado", "O modo de teste impede efeitos externos durante a revisão.", "Modo aplicado", "action"],
    ["AÇÃO", "Resposta preparada", "A ação predefinida é composta no canal de execução.", "Resposta preparada", "success"],
    ["RESULTADO", "Fluxo pronto", "A equipa pode rever o caminho antes de o publicar.", "Automação concluída", "success"],
  ),
  finalSummary: "O fluxo foi simulado localmente com o modo de teste respeitado.",
}));

add(definition({
  id: "management.polls", category: "management", title: "Enquetes", scene: "poll",
  fields: ["channel", "defaultDurationHours", "allowMultiple", "anonymous", "reminderHours"], sample: { channel: "decisões", defaultDurationHours: 24, allowMultiple: false, anonymous: false, reminderHours: 6 },
  stages: sequence(
    ["CRIAR", "Pergunta preparada", "A equipa define uma pergunta e as opções da votação.", "Enquete iniciada", "calm"],
    ["PUBLICAR", "Enquete publicada", "O cartão aparece no canal configurado com a duração definida.", "Votação publicada", "signal"],
    ["VOTAR", "Membros escolhem", "Cada participante vê se pode escolher uma ou várias opções.", "Votos recebidos", "action"],
    ["ATUALIZAR", "Resultados contam", "As barras e o estado da votação refletem os votos simulados.", "Resultados atualizados", "success"],
    ["RESULTADO", "Enquete concluída", "O lembrete e a privacidade seguem os valores configurados.", "Votação concluída", "success"],
  ),
  finalSummary: "A enquete foi publicada e os resultados foram atualizados apenas nesta simulação.",
}));

add(definition({
  id: "insights.stats", category: "management", title: "Canais de estatísticas", scene: "stats",
  fields: ["channel", "refreshMinutes", "showMembers", "showMessages", "showVoice"], sample: { channel: "estatísticas", refreshMinutes: 15, showMembers: true, showMessages: true, showVoice: true },
  stages: sequence(
    ["RECOLHER", "Atividade recebida", "O Helper reúne os sinais disponíveis do servidor.", "Dados recebidos", "calm"],
    ["FILTRAR", "Métricas selecionadas", "Membros, mensagens e voz seguem as opções ativas.", "Métricas filtradas", "signal"],
    ["AGREGAR", "Tendências calculadas", "Os valores são agrupados no intervalo de atualização escolhido.", "Tendências calculadas", "action"],
    ["PUBLICAR", "Cartão atualizado", "O canal de estatísticas recebe o resumo preparado.", "Resumo preparado", "success"],
    ["RESULTADO", "Canal informativo", "A equipa acompanha a evolução sem poluir o servidor.", "Estatísticas prontas", "success"],
  ),
  finalSummary: "O resumo de atividade foi preparado com as métricas selecionadas.",
}));

add(definition({
  id: "social.rss", category: "social", title: "RSS Feeds", scene: "social", unavailable: true,
  fields: ["feedUrl", "targetChannelId", "intervalSeconds", "messageTemplate", "mention"], sample: { feedUrl: "https://exemplo.org/feed.xml", targetChannelId: "notícias", intervalSeconds: 900, messageTemplate: "Nova publicação: {title}", mention: "" },
  stages: sequence(
    ["ESPERA", "Feed a aguardar", "O Helper acompanha o URL RSS configurado.", "A aguardar", "calm"],
    ["VERIFICAR", "Novo item encontrado", "A atualização passa pela janela de verificação.", "Item encontrado", "signal"],
    ["COMPOR", "Alerta preenchido", "Título, feed e ligação entram no modelo da mensagem.", "Alerta preparado", "action"],
    ["DESTINO", "Canal selecionado", "O destino Discord e a menção são aplicados.", "Destino preparado", "success"],
    ["RESULTADO", "Publicação pronta", "A comunidade recebe um aviso sem trocar de aplicação.", "RSS pronto", "success"],
  ),
  finalSummary: "O alerta RSS foi preparado para o canal configurado.",
}));

add(definition({
  id: "social.youtube", category: "social", title: "Alertas do YouTube", scene: "social",
  fields: ["sourceChannelId", "targetChannelId", "intervalSeconds", "messageTemplate", "mention"], sample: { sourceChannelId: "canal-youtube", targetChannelId: "vídeos", intervalSeconds: 300, messageTemplate: "Novo vídeo de {channel}: {title}", mention: "@here" },
  stages: sequence(
    ["ESPERA", "Canal a aguardar", "O Helper acompanha o canal YouTube escolhido.", "A aguardar", "calm"],
    ["EVENTO", "Novo vídeo encontrado", "A verificação deteta uma publicação nova.", "Vídeo encontrado", "signal"],
    ["COMPOR", "Mensagem personalizada", "O título, canal e ligação preenchem o modelo.", "Mensagem preparada", "action"],
    ["PUBLICAR", "Alerta encaminhado", "O canal Discord e a menção seguem a configuração.", "Alerta encaminhado", "success"],
    ["RESULTADO", "Vídeo anunciado", "A comunidade recebe o aviso no contexto certo.", "YouTube pronto", "success"],
  ),
  finalSummary: "O alerta YouTube foi preparado para o destino configurado.",
}));

// Catalog entries that do not yet expose a configuration form still get a
// semantic storyboard. They remain hidden behind their roadmap state until the
// product adds the corresponding module route.
add(definition({
  id: "community.achievements", category: "community", title: "Conquistas", scene: "achievement", unavailable: true,
  stages: sequence(["META", "Objetivo definido", "A comunidade começa a acompanhar um marco.", "Meta iniciada"], ["PROGRESSO", "Contribuições contam", "As ações elegíveis aproximam o membro da conquista.", "Progresso atualizado"], ["LIMIAR", "Marco alcançado", "O requisito configurado é atingido.", "Marco alcançado"], ["CELEBRAR", "Recompensa preparada", "O Helper compõe o reconhecimento para a comunidade.", "Celebração preparada"], ["RESULTADO", "Conquista desbloqueada", "O membro vê o marco associado ao seu percurso.", "Conquista pronta"]), finalSummary: "A conquista foi preparada para celebrar um marco da comunidade.",
}));
add(definition({
  id: "community.birthdays", category: "community", title: "Aniversários", scene: "birthday", unavailable: true,
  stages: sequence(["CALENDÁRIO", "Data guardada", "O servidor mantém a data com a privacidade escolhida.", "Data preparada"], ["ESPERA", "Dia do aniversário chega", "O Helper encontra a celebração do dia.", "Data encontrada"], ["PERSONALIZAR", "Mensagem composta", "O nome e o contexto entram no cartão de celebração.", "Mensagem preparada"], ["PUBLICAR", "Celebração enviada", "A mensagem aparece no destino configurado.", "Celebração publicada"], ["RESULTADO", "Comunidade celebra", "O membro recebe reconhecimento sem expor dados extra.", "Aniversário celebrado"]), finalSummary: "A celebração foi preparada respeitando a privacidade do membro.",
}));
add(definition({
  id: "community.economy", category: "community", title: "Economia", scene: "economy", unavailable: true,
  stages: sequence(["AÇÃO", "Membro participa", "Uma ação elegível entra no sistema de recompensas.", "Ação recebida"], ["VALIDAR", "Regras verificadas", "Cooldown e elegibilidade são confirmados.", "Regras verificadas"], ["RECOMPENSAR", "Saldo atualizado", "A recompensa é calculada sem duplicar a ação.", "Saldo preparado"], ["REGISTAR", "Transação registada", "O histórico liga o ganho ao membro e ao evento.", "Transação preparada"], ["RESULTADO", "Economia atualizada", "O membro vê o novo saldo no contexto certo.", "Saldo atualizado"]), finalSummary: "A recompensa foi preparada com as regras económicas aplicadas.",
}));
add(definition({
  id: "growth.monetization", category: "growth", title: "Monetização", scene: "monetization", unavailable: true,
  stages: sequence(["OFERTA", "Benefício definido", "A equipa prepara um benefício para apoiar o servidor.", "Oferta iniciada"], ["VALIDAR", "Apoio confirmado", "O Helper associa o benefício ao estado de apoio.", "Apoio verificado"], ["CARGO", "Cargo preparado", "O cargo correspondente é ligado ao benefício.", "Cargo preparado"], ["ACESSO", "Benefícios apresentados", "O membro vê o que está incluído sem dados de pagamento expostos.", "Benefícios preparados"], ["RESULTADO", "Apoio reconhecido", "A comunidade recebe o próximo passo com clareza.", "Monetização pronta"]), finalSummary: "O benefício e o cargo foram preparados para a experiência de apoio.",
}));
add(definition({
  id: "management.invite_tracker", category: "management", title: "Rastreador de convites", scene: "invite", unavailable: true,
  stages: sequence(["ENTRADA", "Novo membro chega", "O servidor recebe uma entrada através de um convite.", "Entrada recebida"], ["ATRIBUIR", "Convite identificado", "O Helper encontra o convite utilizado.", "Convite identificado"], ["CONTAR", "Origem registada", "A contagem do autor do convite é atualizada.", "Origem atualizada"], ["RECOMPENSAR", "Meta avaliada", "As regras de reconhecimento entram no cálculo.", "Reconhecimento preparado"], ["RESULTADO", "Origem consultável", "A equipa sabe quem trouxe novos membros para o servidor.", "Rastreador pronto"]), finalSummary: "A origem da entrada foi preparada para consulta da equipa.",
}));

const SOCIAL_FUTURE = [
  ["social.bluesky", "Alertas do Bluesky", "Bluesky", "novo perfil publica", "perfil seguido", "Publicação nova"],
  ["social.instagram", "Alertas do Instagram", "Instagram", "conta escolhida publica", "conta seguida", "Publicação nova"],
  ["social.kick", "Alertas da Kick", "Kick", "criador inicia transmissão", "canal monitorizado", "Transmissão ao vivo"],
  ["social.podcasts", "Podcasts", "Podcast", "novo episódio sai", "podcast monitorizado", "Episódio novo"],
  ["social.reddit", "Alertas do Reddit", "Reddit", "nova publicação aparece", "subreddit monitorizado", "Publicação nova"],
  ["social.tiktok", "Alertas do TikTok", "TikTok", "novo vídeo é publicado", "conta monitorizada", "Vídeo novo"],
  ["social.x", "Alertas do X", "X", "conta escolhida publica", "conta monitorizada", "Publicação nova"],
];
SOCIAL_FUTURE.forEach(([id, title, platform, event, source, result]) => add(definition({
  id, category: "social", title, scene: "social", unavailable: true,
  stages: sequence(
    ["ESPERA", `${platform} a aguardar`, `O Helper acompanha ${source}.`, "A aguardar", "calm"],
    ["EVENTO", event[0].toUpperCase() + event.slice(1), `A plataforma envia um sinal para o Helper.`, "Evento encontrado", "signal"],
    ["VALIDAR", "Publicação confirmada", "A origem e o destino passam pelas regras do alerta.", "Evento validado", "action"],
    ["COMPOR", "Alerta preparado", "O modelo específico da plataforma recebe o conteúdo encontrado.", "Alerta preparado", "success"],
    ["RESULTADO", result, "A comunidade recebe o aviso no canal escolhido.", "Alerta pronto", "success"],
  ),
  finalSummary: `O alerta ${platform} foi preparado para o destino configurado.`,
})));

add(definition({
  id: "studio.rank_card", category: "community", title: "XP card", scene: "rank-card", unavailable: false,
  stages: sequence(["MEMBRO", "Perfil carregado", "O Helper encontra o nível e o XP do membro.", "Perfil carregado"], ["DESIGN", "Tema aplicado", "O banner e a identidade visual entram no cartão.", "Tema aplicado"], ["PROGRESSO", "Barra calculada", "A progressão mostra a distância até ao nível seguinte.", "Progresso calculado"], ["RENDER", "Cartão composto", "Nome, nível e estatísticas ocupam o layout escolhido.", "Cartão preparado"], ["RESULTADO", "XP card pronto", "A pré-visualização mostra o cartão que seria usado no Discord.", "Cartão pronto"]), finalSummary: "O cartão de XP foi composto com o tema e a progressão do membro.",
}));

add(definition({
  id: "utility.embeds", category: "utility", title: "Mensagens incorporadas", scene: "embed", unavailable: true,
  stages: sequence(["CONTEÚDO", "Mensagem definida", "A equipa prepara título, texto e informação útil.", "Conteúdo iniciado"], ["ESTILO", "Layout aplicado", "A mensagem recebe a estrutura visual escolhida.", "Estilo aplicado"], ["VALIDAR", "Campos verificados", "Links, limites e hierarquia são confirmados.", "Mensagem validada"], ["PUBLICAR", "Embed preparado", "O cartão é colocado no canal de destino.", "Cartão preparado"], ["RESULTADO", "Informação clara", "A comunidade recebe uma mensagem rica e fácil de consultar.", "Embed pronto"]), finalSummary: "A mensagem incorporada foi preparada com hierarquia e conteúdo claros.",
}));
add(definition({
  id: "utility.emojis", category: "utility", title: "Emojis", scene: "emoji", unavailable: true,
  stages: sequence(["CATÁLOGO", "Emoji encontrado", "O Helper procura o emoji personalizado adequado.", "Emoji encontrado"], ["VALIDAR", "Nome e acesso verificados", "A comunidade só vê recursos disponíveis para o servidor.", "Acesso verificado"], ["ORGANIZAR", "Uso preparado", "O emoji fica associado ao contexto correto.", "Uso preparado"], ["APRESENTAR", "Sugestão mostrada", "A interface explica como utilizar o emoji.", "Sugestão preparada"], ["RESULTADO", "Emoji pronto", "A comunidade encontra e usa os emojis personalizados.", "Emoji disponível"]), finalSummary: "O emoji personalizado foi preparado para uso no contexto certo.",
}));
add(definition({
  id: "utility.search", category: "utility", title: "Procura algo", scene: "search", unavailable: true,
  stages: sequence(["PEDIDO", "Pesquisa recebida", "Um membro procura conteúdo sem sair do servidor.", "Pesquisa recebida"], ["PROCURAR", "Fontes consultadas", "O Helper reúne resultados das fontes permitidas.", "Fontes consultadas"], ["FILTRAR", "Resultados relevantes", "Os resultados são ordenados por correspondência.", "Resultados filtrados"], ["APRESENTAR", "Cartões preparados", "Título, origem e ligação ficam prontos para consulta.", "Resultados preparados"], ["RESULTADO", "Resposta encontrada", "O membro pode abrir a referência escolhida.", "Pesquisa concluída"]), finalSummary: "A pesquisa foi preparada com resultados relevantes e identificados.",
}));
add(definition({
  id: "utility.temp_channels", category: "utility", title: "Canais temporários", scene: "temp-channel", unavailable: true,
  stages: sequence(["PEDIR", "Membro entra na sala", "Uma entrada de voz inicia o canal temporário.", "Entrada recebida"], ["CRIAR", "Canal criado", "O Helper gera o canal com o nome e as permissões adequadas.", "Canal criado"], ["USAR", "Conversa acontece", "Os membros utilizam o espaço enquanto há atividade.", "Canal ativo"], ["ESPERAR", "Sala fica vazia", "O Helper deteta que deixou de haver utilizadores.", "Sala vazia"], ["RESULTADO", "Canal removido", "O espaço desaparece sem manter canais abandonados.", "Canal concluído"]), finalSummary: "O canal temporário segue o ciclo de criação, uso e remoção.",
}));

const WEB3_FUTURE = [
  ["web3.crypto_queries", "Consultas de criptomoedas", "consulta de preço", "Preço e variação", "crypto-search"],
  ["web3.crypto_stats", "Estatísticas de cripto", "métrica de mercado", "Indicadores atualizados", "crypto-chart"],
  ["web3.gas_tracker", "Gas tracker", "rede selecionada", "Taxa de rede", "gas"],
  ["web3.gating", "Gating", "carteira verificada", "Acesso por coleção", "gating"],
  ["web3.nft_queries", "Consultas NFT", "coleção procurada", "Coleção encontrada", "nft-search"],
  ["web3.nft_sales", "Vendas e listagens NFT", "evento de mercado", "Listagem encontrada", "nft-tag"],
  ["web3.nft_stats", "Estatísticas NFT", "coleção analisada", "Estatísticas calculadas", "nft-chart"],
];
WEB3_FUTURE.forEach(([id, title, event, result]) => add(definition({
  id, category: "web3", title, scene: "web3", unavailable: true,
  stages: sequence(["PEDIDO", `${event[0].toUpperCase() + event.slice(1)}`, "A comunidade inicia uma consulta dentro do servidor.", "Pedido recebido", "calm"], ["CONSULTAR", "Fonte verificada", "O Helper procura dados na rede ou no índice configurado.", "Fonte verificada", "signal"], ["CALCULAR", "Dados interpretados", "Os valores recebem o formato adequado à conversa.", "Dados calculados", "action"], ["APRESENTAR", `${result} preparada`, "O cartão mostra contexto, atualização e origem dos dados.", "Resultado preparado", "success"], ["RESULTADO", "Resposta pronta", "A informação aparece sem perder a referência da fonte.", "Consulta concluída", "success"]), finalSummary: `A ${title.toLowerCase()} foi preparada com dados identificados.`,
})));

const CONFIGURABLE_PREVIEW_IDS = [
  "community.leaderboard", "support.welcome_channel", "management.moderation", "management.custom_commands", "management.audit", "management.privacy", "management.templates", "community.role_panels", "community.events", "utility.help", "utility.reminders", "social.twitch", "protection.antispam", "protection.antiscam", "protection.anti_raid", "protection.join_gate", "community.levels", "community.starboard", "community.suggestions", "community.giveaways", "support.tickets", "support.welcome", "management.nickname", "management.workflows", "management.polls", "insights.stats", "social.rss", "social.youtube",
];

const RENDERERS = {
  "community.leaderboard": "leaderboard",
  "support.welcome_channel": "welcome-channel",
  "management.moderation": "moderation",
  "management.custom_commands": "custom-command",
  "management.audit": "audit",
  "management.privacy": "privacy",
  "management.templates": "template",
  "community.role_panels": "role-panel",
  "community.events": "event",
  "utility.help": "help",
  "utility.reminders": "reminder",
  "social.twitch": "social-twitch",
  "protection.antispam": "antispam",
  "protection.antiscam": "antiscam",
  "protection.anti_raid": "anti-raid",
  "protection.join_gate": "join-gate",
  "community.levels": "levels",
  "community.starboard": "starboard",
  "community.suggestions": "suggestion",
  "community.giveaways": "giveaway",
  "support.tickets": "ticket",
  "support.welcome": "welcome",
  "management.nickname": "nickname",
  "management.workflows": "workflow",
  "management.polls": "poll",
  "insights.stats": "stats",
  "social.rss": "social-rss",
  "social.youtube": "social-youtube",
  "community.achievements": "achievement",
  "community.birthdays": "birthday",
  "community.economy": "economy",
  "growth.monetization": "monetization",
  "management.invite_tracker": "invite-tracker",
  "social.bluesky": "social-bluesky",
  "social.instagram": "social-instagram",
  "social.kick": "social-kick",
  "social.podcasts": "social-podcast",
  "social.reddit": "social-reddit",
  "social.tiktok": "social-tiktok",
  "social.x": "social-x",
  "studio.rank_card": "rank-card",
  "utility.embeds": "embed",
  "utility.emojis": "emoji",
  "utility.search": "search",
  "utility.temp_channels": "temporary-channel",
  "web3.crypto_queries": "crypto-query",
  "web3.crypto_stats": "crypto-stats",
  "web3.gas_tracker": "gas-tracker",
  "web3.gating": "token-gate",
  "web3.nft_queries": "nft-query",
  "web3.nft_sales": "nft-sale",
  "web3.nft_stats": "nft-stats",
};

const THEME_TERMS = {
  "management.polls": ["enquete", "pergunta", "opções", "votos", "resultados"],
  "community.starboard": ["mensagem", "reações", "limiar", "destaque", "starboard"],
  "community.suggestions": ["sugestão", "votos", "revisão", "decisão"],
  "management.audit": ["autor", "alteração", "histórico", "auditoria"],
  "management.privacy": ["pedido", "retenção", "exportação", "eliminação"],
  "management.templates": ["recursos", "pacote", "comparação", "importação"],
  "support.tickets": ["ticket", "equipa", "transcript", "arquivo"],
  "support.welcome": ["membro", "boas-vindas", "DM", "cargo"],
  "utility.help": ["ajuda", "categorias", "comandos", "exemplos"],
  "management.nickname": ["membro", "nome", "nickname", "sincronização"],
  "protection.antispam": ["mensagens", "repetições", "contador", "spam"],
  "protection.antiscam": ["ligação", "domínio", "risco", "fraude"],
  "protection.anti_raid": ["entradas", "janela", "incidente", "raid"],
  "protection.join_gate": ["conta", "avatar", "admissão", "portão"],
};

for (const item of Object.values(PREVIEWS)) {
  item.renderer ||= RENDERERS[item.id] || item.scene || "module";
  item.themeTerms = THEME_TERMS[item.id] || [item.title, item.category, item.renderer];
  item.visual = { ...(item.visual || {}), theme: item.renderer };
}

const displayValue = (value, fallback = "não definido") => {
  if (value === undefined || value === null || String(value).trim() === "") return fallback;
  if (value === true || value === "true" || value === "on") return "sim";
  if (value === false || value === "false" || value === "off") return "não";
  return String(value).trim();
};

const interpolate = (value, context) => String(value).replace(/\{([a-zA-Z][\w]*)\}/g, (_, key) => displayValue(context[key], `{${key}}`));

export function getPreviewDefinition(id, values = {}) {
  const item = PREVIEWS[id];
  if (!item) return null;
  const context = { ...item.sample, ...values };
  return {
    ...item,
    duration: item.duration,
    stages: item.stages.map((stage) => Object.fromEntries(Object.entries(stage).map(([key, value]) => [key, interpolate(value, context)]))),
    finalSummary: interpolate(item.finalSummary, context),
    visual: { ...item.visual, context: Object.fromEntries(Object.keys(context).map((key) => [key, displayValue(context[key])])) },
    data: Object.fromEntries(Object.keys(context).map((key) => [key, displayValue(context[key])])),
  };
}

export const PREVIEW_IDS = Object.freeze(Object.keys(PREVIEWS));
export const CONFIGURABLE_IDS = Object.freeze(CONFIGURABLE_PREVIEW_IDS);
export const PREVIEW_REGISTRY = Object.freeze(PREVIEWS);
