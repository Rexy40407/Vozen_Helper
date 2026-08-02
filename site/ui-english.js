(() => {
  "use strict";

  const translations = {
    "SERVIDOR ATUAL": "CURRENT SERVER",
    "As alterações ficam isoladas neste servidor.": "Changes stay isolated to this server.",
    "Painel": "Dashboard",
    "Visão geral": "Overview",
    "Configuração guiada": "Guided setup",
    "Funcionalidades": "Modules",
    "Configurar módulos": "Configure modules",
    "Atividade": "Activity",
    "Histórico do servidor": "Server history",
    "Níveis e identidade": "Levels and identity",
    "Sincronizado com Rust": "Synced with Rust",
    "Tudo sincronizado": "All synced",
    "REXY.PLACE · HELPER": "REXY.PLACE · HELPER",
    "Escolhe um tópico para abrir a configuração completa.": "Choose a module to open its full configuration.",
    "CATÁLOGO DO HELPER": "HELPER MODULES",
    "Escolhe o que o teu servidor precisa": "Choose what your server needs",
    "Configura os módulos úteis para o teu servidor.": "Configure the useful modules for your server.",
    "Abre um tópico para veres opções essenciais, definições avançadas e uma simulação segura.": "Open a module to see core options, advanced settings and a safe simulation.",
    "Abre um tópico para veres opções essenciais.": "Open a module to see its essential options.",
    "PESQUISAR MÓDULOS": "SEARCH MODULES",
    "Pesquisar funcionalidade…": "Search modules…",
    "Ativos": "Active",
    "Disponível": "Available",
    "Disponíveis": "Available",
    "Beta": "Beta",
    "Planeada": "Planned",
    "Planeadas": "Planned",
    "Bloqueada": "Blocked",
    "Bloqueados": "Blocked",
    "Roadmap": "Roadmap",
    "CATEGORIA": "CATEGORY",
    "Categoria": "Category",
    "Todas": "All",
    "Proteção": "Protection",
    "Comunidade": "Community",
    "Gestão": "Management",
    "Utilidades": "Utilities",
    "Alertas sociais": "Social alerts",
    "Crescimento": "Growth",
    "Configurar": "Configure",
    "Personalizar": "Customize",
    "Ver plano": "View plan",
    "Proteção contra spam": "Spam protection",
    "Deteta flood, mensagens repetidas e excesso de menções.": "Detects flooding, repeated messages and excessive mentions.",
    "Deteta flood e excesso de menções.": "Detects flooding and excessive mentions.",
    "Proteção contra fraude": "Fraud protection",
    "Bloqueia links suspeitos, convites e padrões de phishing.": "Blocks suspicious links, invites and phishing patterns.",
    "Bloqueia links suspeitos e convites.": "Blocks suspicious links and invites.",
    "Anti-raid": "Anti-raid",
    "Responde a entradas anormais e protege o servidor.": "Responds to unusual joins and protects the server.",
    "Proteção de entradas": "Join protection",
    "Aplica verificações básicas a novos membros.": "Applies basic checks to new members.",
    "Níveis e XP": "Levels & XP",
    "Recompensa conversa saudável com XP e níveis.": "Rewards healthy conversation with XP and levels.",
    "Leaderboard de XP": "XP leaderboard",
    "Mostra a progressão da comunidade com privacidade configurável.": "Shows community progress with configurable privacy.",
    "Starboard": "Starboard",
    "Destaca mensagens populares da comunidade.": "Highlights popular community messages.",
    "Sugestões": "Suggestions",
    "Recolhe ideias e deixa a comunidade votar.": "Collects ideas and lets the community vote.",
    "Giveaways": "Giveaways",
    "Cria sorteios com entradas rastreáveis.": "Creates giveaways with trackable entries.",
    "Tickets": "Tickets",
    "Organiza pedidos de suporte num só lugar.": "Organizes support requests in one place.",
    "Boas-vindas": "Welcome messages",
    "Recebe novos membros com uma mensagem guiada.": "Welcomes new members with a guided message.",
    "Canal de boas-vindas": "Welcome channel",
    "Organiza regras, informação e primeiros passos para quem chega.": "Organizes rules, information and first steps for new members.",
    "Nickname": "Nickname",
    "Define o nome que o Helper mostra neste servidor.": "Sets the name the Helper displays in this server.",
    "Automações": "Automations",
    "Liga um gatilho a uma resposta sem código.": "Connects a trigger to a no-code response.",
    "Enquetes": "Polls",
    "Publica votações simples para decisões rápidas.": "Publishes simple polls for quick decisions.",
    "Canais de estatísticas": "Statistics channels",
    "Acompanha atividade e tendências do servidor.": "Tracks server activity and trends.",
    "XP card": "XP card",
    "Personaliza a carta de nível mostrada no Discord.": "Personalizes the level card shown in Discord.",
    "Moderador": "Moderator",
    "Centraliza regras, avisos e ações de moderação do servidor.": "Centralizes server rules, notices and moderation actions.",
    "Comandos personalizados": "Custom commands",
    "Cria respostas reutilizáveis para perguntas e rotinas da comunidade.": "Creates reusable responses for community questions and routines.",
    "Auditoria e permissões": "Audit and permissions",
    "Acompanha alterações importantes e mantém a equipa alinhada.": "Tracks important changes and keeps the team aligned.",
    "Privacidade e dados": "Privacy and data",
    "Consulta, exporta e elimina os dados do teu servidor com segurança.": "Safely view, export and delete your server data.",
    "Modelos e importação": "Templates and import",
    "Guarda uma configuração e reutiliza-a noutro servidor.": "Saves a configuration so you can reuse it on another server.",
    "Painéis de cargos": "Role panels",
    "Deixa os membros escolherem cargos através de painéis simples.": "Lets members choose roles through simple panels.",
    "Eventos do servidor": "Server events",
    "Cria eventos, inscrições e check-ins sem sair do painel.": "Creates events, sign-ups and check-ins without leaving the panel.",
    "Conquistas": "Achievements",
    "Cria metas e celebra marcos da comunidade.": "Creates goals and celebrates community milestones.",
    "Rastreador de convites": "Invite tracker",
    "Percebe quem trouxe novos membros para o servidor.": "Shows who brought new members to the server.",
    "Ajuda": "Help",
    "Explica os módulos e mostra o próximo passo para cada equipa.": "Explains modules and shows the next step for each team.",
    "Temporizadores": "Timers",
    "Agenda lembretes para mensagens, tarefas e eventos.": "Schedules reminders for messages, tasks and events.",
    "Emojis": "Emojis",
    "Organiza e melhora a utilização de emojis personalizados.": "Organizes and improves custom emoji usage.",
    "Mensagens incorporadas": "Embeds",
    "Cria mensagens ricas para regras, anúncios e informação útil.": "Creates rich messages for rules, announcements and useful information.",
    "Procura algo": "Search something",
    "Pesquisa conteúdos, vídeos e referências sem trocar de aplicação.": "Searches content, videos and references without leaving the app.",
    "Canais temporários": "Temporary channels",
    "Cria canais de voz que desaparecem quando deixam de ser usados.": "Creates voice channels that disappear when no longer used.",
    "Alertas da Twitch": "Twitch alerts",
    "Publica um aviso quando um canal começa uma transmissão.": "Posts an alert when a channel starts streaming.",
    "Alertas do YouTube": "YouTube alerts",
    "Notifica o servidor quando sai um vídeo novo.": "Notifies the server when a new video is published.",
    "Notifica quando sai um novo vídeo.": "Notifies when a new video is published.",
    "Notifica quando sai um vídeo novo.": "Notifies when a new video is published.",
    "Alertas do Instagram": "Instagram alerts",
    "Acompanha novas publicações de contas escolhidas.": "Tracks new posts from selected accounts.",
    "Alertas do Reddit": "Reddit alerts",
    "Envia avisos quando aparece uma nova publicação.": "Sends alerts when a new post appears.",
    "Alertas do X": "X alerts",
    "Acompanha publicações de contas importantes para a comunidade.": "Tracks posts from important community accounts.",
    "Alertas do TikTok": "TikTok alerts",
    "Notifica o servidor sobre novos vídeos.": "Notifies the server about new videos.",
    "RSS Feeds": "RSS feeds",
    "Transforma qualquer feed RSS numa atualização automática.": "Turns any RSS feed into an automatic update.",
    "Podcasts": "Podcasts",
    "Avisa quando sai um novo episódio dos teus podcasts.": "Alerts you when a new podcast episode is published.",
    "Alertas da Kick": "Kick alerts",
    "Notifica quando um criador começa uma transmissão.": "Notifies when a creator starts streaming.",
    "Alertas do Bluesky": "Bluesky alerts",
    "Acompanha novas publicações de perfis escolhidos.": "Tracks new posts from selected profiles.",
    "Aniversários": "Birthdays",
    "Celebra aniversários automaticamente, com privacidade configurável.": "Celebrates birthdays automatically with configurable privacy.",
    "Economia": "Economy",
    "Cria uma economia virtual com recompensas e progressão.": "Creates a virtual economy with rewards and progression.",
    "Monetização": "Monetization",
    "Prepara benefícios e cargos para apoiar o servidor.": "Prepares benefits and roles to support the server.",
    "Estatísticas NFT": "NFT statistics",
    "Mostra dados de coleções NFT para a comunidade.": "Shows NFT collection data to the community.",
    "Consultas NFT": "NFT lookups",
    "Consulta coleções NFT diretamente no servidor.": "Looks up NFT collections directly in the server.",
    "Vendas e listagens NFT": "NFT sales and listings",
    "Acompanha vendas e listagens de coleções escolhidas.": "Tracks sales and listings from selected collections.",
    "Estatísticas de cripto": "Crypto statistics",
    "Acompanha indicadores de moedas digitais.": "Tracks digital currency indicators.",
    "Consultas de criptomoedas": "Cryptocurrency lookups",
    "Consulta informação de criptomoedas dentro do servidor.": "Looks up cryptocurrency information inside the server.",
    "Gas tracker": "Gas tracker",
    "Mostra as taxas de rede atuais para a comunidade.": "Shows current network fees to the community.",
    "Gating": "Gating",
    "Controla acesso e cargos com base em coleções verificadas.": "Controls access and roles based on verified collections.",
    "CENTRO DE COMANDO": "COMMAND CENTER",
    "O teu servidor, sob controlo.": "Your server, under control.",
    "Vê o que precisa de atenção e configura o Helper por etapas simples. Cada alteração fica ligada ao teu servidor.": "See what needs attention and configure the Helper in simple steps. Every change stays tied to your server.",
    "Continuar setup": "Continue setup",
    "Proteger o servidor": "Protect the server",
    "funcionalidades ativas": "active modules",
    "casos de moderação": "moderation cases",
    "eventos recentes": "recent events",
    "Receber novos membros": "Welcome new members",
    "Mensagem e cargo inicial": "Message and starter role",
    "Dar vida à comunidade": "Bring the community to life",
    "Níveis, sugestões, sorteios e starboard.": "Levels, suggestions, giveaways and starboard.",
    "Criar identidade": "Create an identity",
    "Escolhe cores, tipografia e um banner seguro.": "Choose colors, typography and a safe banner.",
    "O que queres fazer primeiro?": "What do you want to do first?",
    "Ver tudo →": "View all →",
    "LIMITE DO PLANO": "PLAN LIMITS",
    "Usa o Helper com espaço para crescer": "Room to grow",
    "O plano atual mostra os limites antes de uma ação ficar bloqueada.": "Your current plan shows limits before an action is blocked.",
    "Prepara o essencial por etapas curtas, com revisão antes de publicar.": "Set up the essentials in short steps, with a review before publishing.",
    "CONFIGURAÇÃO GUIADA · 2–4 MIN": "GUIDED SETUP · 2–4 MIN",
    "Põe o essencial a funcionar.": "Get the essentials running.",
    "Escolhe as bases do teu servidor. O Vozen mostra cada alteração antes de a aplicar e guarda o progresso por servidor.": "Choose your server foundations. Vozen shows every change before applying it and saves progress per server.",
    "Servidor:": "Server:",
    "Permissões verificadas": "Permissions verified",
    "Agora não": "Not now",
    "Preparar servidor →": "Prepare server →",
    "Configura o essencial do servidor.": "Set up your server essentials.",
    "Aplicamos uma etapa de cada vez. Voltar não desfaz alterações já publicadas.": "We apply one step at a time. Going back will not undo published changes.",
    "Sair por agora": "Exit for now",
    "ETAPA": "STEP",
    "Mensagem recomendada": "Recommended message",
    "Personalizar": "Customize",
    "Desativar": "Disable",
    "CONFIGURAÇÃO": "CONFIGURATION",
    "Voltar às funcionalidades": "Back to modules",
    "Ativa": "Active",
    "Desativada": "Inactive",
    "O Helper aplica esta configuração no servidor.": "The Helper applies this configuration to the server.",
    "ANTES DE PUBLICAR": "BEFORE PUBLISHING",
    "Confere sem risco": "Review safely",
    "Usa a simulação para veres o que aconteceria. Ela nunca apaga mensagens nem castiga membros.": "Use the simulation to see what would happen. It never deletes messages or punishes members.",
    "Simular configuração": "Simulate configuration",
    "Precisas de ajuda?": "Need help?",
    "Os campos avançados estão fechados para manter o primeiro passo simples.": "Advanced fields stay closed to keep the first step simple.",
    "Guardar alterações": "Save changes",
    "Descartar": "Discard",
    "A guardar…": "Saving…",
    "TRANSPARÊNCIA": "TRANSPARENCY",
    "Atividade recente": "Recent activity",
    "Cada ação mostra o que aconteceu sem esconder detalhes importantes.": "Every action shows what happened without hiding important details.",
    "Ação": "Action",
    "Alvo / ator": "Target / actor",
    "Estado": "Status",
    "Data": "Date",
    "Ainda não há atividade para mostrar.": "No activity to show yet.",
    "PRÉ-VISUALIZAÇÃO AO VIVO": "LIVE PREVIEW",
    "Assim aparece no Discord": "This is how it appears in Discord",
    "ao vivo": "live",
    "EDITOR SEGURO": "SAFE EDITOR",
    "Identidade do XP card": "XP card identity",
    "Usa apenas banners curados pelo Vozen ou uma cor sólida.": "Use only Vozen-curated banners or a solid color.",
    "Fonte": "Font",
    "Cor principal": "Primary color",
    "Cor do texto": "Text color",
    "Opacidade do overlay": "Overlay opacity",
    "Fundo do XP card": "XP card background",
    "Banner curado": "Curated banner",
    "Cor sólida": "Solid color",
    "Escolhe uma cor de fundo": "Choose a background color",
    "Banners": "Banners",
    "Restaurar": "Restore",
    "ACESSO SEGURO": "SECURE ACCESS",
    "Entra no teu painel": "Enter your dashboard",
    "Usa a tua conta Discord para gerir o Helper e configurar os teus servidores.": "Use your Discord account to manage the Helper and configure your servers.",
    "Continuar com Discord": "Continue with Discord",
    "A ligar ao Discord…": "Connecting to Discord…",
    "O acesso é protegido e só mostra servidores onde tens permissão de gestão.": "Access is protected and only shows servers where you have management permissions.",
    "A carregar configuração…": "Loading configuration…",
    "Servidor demo": "Demo server",
    "A configuração rápida continua disponível na barra lateral.": "Quick setup is still available in the sidebar.",
    "A preparar o teu espaço de trabalho…": "Preparing your workspace…",
    "Não foi possível carregar o painel.": "Could not load the dashboard.",
    "Não encontrámos funcionalidades com esse filtro.": "No modules match this filter.",
    "Simulação concluída — nenhuma ação real foi aplicada.": "Simulation complete — no real action was applied.",
  };

  const patterns = [
    [/^Servidor:\s*/, "Server: "],
    [/^ETAPA\s+/, "STEP "],
    [/^CONFIGURAÇÃO\s*·\s*/, "CONFIGURATION · "],
    [/^QUICK SETUP\s*·\s*/, "QUICK SETUP · "],
    [/^ROADMAP\s*·\s*/, "ROADMAP · "],
    [/^Última publicação:\s*/, "Last published: "],
    [/^A guardar/, "Saving"],
    [/^Não foi possível/, "Could not"],
  ];

  const translate = (raw) => {
    const leading = String(raw).match(/^\s*/)?.[0] || "";
    const trailing = String(raw).match(/\s*$/)?.[0] || "";
    const value = String(raw).trim();
    if (!value) return raw;
    if (Object.prototype.hasOwnProperty.call(translations, value)) return `${leading}${translations[value]}${trailing}`;
    for (const [pattern, replacement] of patterns) {
      if (pattern.test(value)) return `${leading}${value.replace(pattern, replacement)}${trailing}`;
    }
    return raw;
  };

  function applyTranslations() {
    document.documentElement.lang = "en";
    document.title = "Vozen Helper — Dashboard";
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach((textNode) => {
      const parent = textNode.parentElement;
      if (!parent || /^(SCRIPT|STYLE|TEXTAREA)$/i.test(parent.tagName)) return;
      const next = translate(textNode.nodeValue);
      if (next !== textNode.nodeValue) textNode.nodeValue = next;
    });
    document.querySelectorAll("[placeholder], [aria-label], [title]").forEach((element) => {
      ["placeholder", "aria-label", "title"].forEach((attribute) => {
        if (element.hasAttribute(attribute)) {
          const current = element.getAttribute(attribute);
          const next = translate(current);
          if (next !== current) element.setAttribute(attribute, next);
        }
      });
    });
  }

  function boot() {
    applyTranslations();
    const root = document.querySelector("#root");
    if (root) {
      let scheduled = 0;
      const observer = new MutationObserver(() => {
        window.clearTimeout(scheduled);
        scheduled = window.setTimeout(applyTranslations, 40);
      });
      observer.observe(root, { childList: true, subtree: true, characterData: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
