import { getPreviewDefinition } from "./module-previews.js";

const one = (selector, root = document) => root.querySelector(selector);
const all = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));

const safeStage = (definition, index) => definition.stages[index] || definition.stages.at(-1) || { label: "ESTADO", title: definition.title, text: "Pré-visualização pronta.", status: "Pronto" };

const stageCard = (definition, index, className = "") => {
  const stage = safeStage(definition, index);
  return `<article class="vozen-preview-card vozen-stage-item ${className}" data-beat="${index}"><span class="vozen-semantic-kicker">${escapeHtml(stage.label)}</span><strong>${escapeHtml(stage.title)}</strong><small>${escapeHtml(stage.text)}</small></article>`;
};

const statusLine = (definition) => `<div class="vozen-stage-topline"><span class="vozen-stage-status" data-stage-status>${escapeHtml(safeStage(definition, 0).status)}</span><span class="vozen-stage-live-label">SIMULADO</span></div>`;
const shell = (definition, content, modifier = "") => `${statusLine(definition)}<div class="vozen-scene vozen-module-scene vozen-scene-${escapeHtml(definition.renderer)} ${modifier}" data-theme="${escapeHtml(definition.renderer)}"><div class="vozen-scene-grid" aria-hidden="true"></div>${content}</div>`;

function renderPoll(definition) {
  const question = definition.data.question || "Que atividade devemos preparar?";
  const channel = definition.data.channel || "decisões";
  return shell(definition, `<article class="vozen-poll-card vozen-stage-item is-complete" data-beat="0"><span class="vozen-semantic-kicker">ENQUETE · #${escapeHtml(channel)}</span><strong>${escapeHtml(question)}</strong><div class="vozen-poll-option"><span>Evento da comunidade</span><b style="--poll-width:72%"></b><small>8 votos</small></div><div class="vozen-poll-option"><span>Noite de jogos</span><b style="--poll-width:48%"></b><small>5 votos</small></div><div class="vozen-poll-option"><span>Perguntas e respostas</span><b style="--poll-width:28%"></b><small>3 votos</small></div><small class="vozen-scene-meta">${definition.data.allowMultiple === "sim" ? "Várias opções permitidas" : "Uma opção por membro"}</small></article>${stageCard(definition, 1)}${stageCard(definition, 2)}<div class="vozen-result-bars vozen-stage-item" data-beat="3"><span class="vozen-semantic-kicker">RESULTADOS</span><i style="--poll-width:72%"></i><i style="--poll-width:48%"></i><i style="--poll-width:28%"></i><strong>${escapeHtml(safeStage(definition, 3).title)}</strong></div>${stageCard(definition, 4, "vozen-semantic-result")}`, "vozen-scene-poll");
}

function renderStarboard(definition) {
  return shell(definition, `<article class="vozen-message-card vozen-stage-item is-complete" data-beat="0"><span class="vozen-avatar">D</span><div><strong>Diogo · #geral</strong><p>Uma mensagem útil para a comunidade.</p><small>Agora · conteúdo publicado</small></div></article><div class="vozen-reaction-strip vozen-stage-item" data-beat="1"><span>⭐ 7</span><span>💬 2</span><strong>${escapeHtml(safeStage(definition, 1).title)}</strong></div><div class="vozen-threshold-card vozen-stage-item" data-beat="2"><span class="vozen-semantic-icon">★</span><div><strong>${escapeHtml(safeStage(definition, 2).title)}</strong><small>Limiar de destaque alcançado.</small></div><b>7/5</b></div>${stageCard(definition, 3)}<article class="vozen-starboard-card vozen-stage-item vozen-semantic-result" data-beat="4"><span class="vozen-semantic-kicker">#STARBOARD</span><strong>${escapeHtml(safeStage(definition, 4).title)}</strong><small>${escapeHtml(safeStage(definition, 4).text)}</small><span class="vozen-star-fixed">★</span></article>`, "vozen-scene-starboard");
}

function renderSuggestion(definition) {
  return shell(definition, `<article class="vozen-suggestion-card vozen-stage-item is-complete" data-beat="0"><span class="vozen-semantic-kicker">SUGESTÃO #104</span><strong>Adicionar uma noite de jogos</strong><small>Ideia enviada pela comunidade.</small><div class="vozen-vote-row"><span>▲ 12</span><span>▼ 2</span></div></article>${stageCard(definition, 1)}<div class="vozen-vote-board vozen-stage-item" data-beat="2"><span>▲ 12</span><span>▼ 2</span><strong>${escapeHtml(safeStage(definition, 2).title)}</strong></div><div class="vozen-review-card vozen-stage-item" data-beat="3"><span class="vozen-status-badge">EM ANÁLISE</span><strong>${escapeHtml(safeStage(definition, 3).title)}</strong><small>${escapeHtml(safeStage(definition, 3).text)}</small></div>${stageCard(definition, 4, "vozen-semantic-result")}`, "vozen-scene-suggestion");
}

function renderProtection(definition, type) {
  const labels = { antispam: ["Membro", "Mensagem repetida · mensagem repetida", "3 repetições"], antiscam: ["Membro", "https://exemplo-suspeito.com", "domínio em análise"], "anti-raid": ["Novos membros", "12 entradas em 30 segundos", "janela de incidente"], "join-gate": ["Novo membro", "Avatar · conta com 7 dias", "verificação de entrada"] };
  const [actor, signal, detail] = labels[type] || labels.antispam;
  return shell(definition, `<article class="vozen-protection-event vozen-stage-item is-complete" data-beat="0"><span class="vozen-shield-mark">⌁</span><div><strong>${actor}</strong><p>${signal}</p><small>${detail}</small></div></article><div class="vozen-protection-signal vozen-stage-item" data-beat="1"><span class="vozen-signal-pulse"></span><strong>${escapeHtml(safeStage(definition, 1).title)}</strong><small>${escapeHtml(safeStage(definition, 1).text)}</small></div><div class="vozen-protection-check vozen-stage-item" data-beat="2"><span>✓</span><div><strong>${escapeHtml(safeStage(definition, 2).title)}</strong><small>${escapeHtml(safeStage(definition, 2).text)}</small></div></div><div class="vozen-protection-action vozen-stage-item" data-beat="3"><span class="vozen-action-chip">AÇÃO</span><strong>${escapeHtml(safeStage(definition, 3).title)}</strong><small>${escapeHtml(safeStage(definition, 3).text)}</small></div>${stageCard(definition, 4, "vozen-semantic-result")}`, `vozen-scene-protection vozen-scene-${type}`);
}

function renderSocial(definition, platform) {
  const labels = { twitch: ["TWITCH", "rexy40407", "Transmissão ao vivo"], youtube: ["YOUTUBE", "Vozen Helper", "Novo vídeo publicado"], rss: ["RSS", "Feed monitorizado", "Novo item no feed"], bluesky: ["BLUESKY", "perfil monitorizado", "Nova publicação"], instagram: ["INSTAGRAM", "conta monitorizada", "Nova publicação visual"], kick: ["KICK", "canal monitorizado", "Canal ficou ao vivo"], podcast: ["PODCAST", "feed monitorizado", "Novo episódio"], reddit: ["REDDIT", "comunidade monitorizada", "Nova publicação"], tiktok: ["TIKTOK", "perfil monitorizado", "Novo vídeo"], x: ["X", "conta monitorizada", "Nova publicação"] };
  const [brand, source, event] = labels[platform.replace("social-", "")] || labels.youtube;
  return shell(definition, `<article class="vozen-social-source vozen-stage-item is-complete" data-beat="0"><span class="vozen-platform-mark">${brand.slice(0, 1)}</span><div><strong>${brand} · ${source}</strong><small>Fonte monitorizada</small></div><span class="vozen-pulse-dot"></span></article><div class="vozen-social-event vozen-stage-item" data-beat="1"><span class="vozen-semantic-kicker">${brand}</span><strong>${event}</strong><small>${escapeHtml(safeStage(definition, 1).text)}</small></div><div class="vozen-social-validate vozen-stage-item" data-beat="2"><span>✓</span><strong>${escapeHtml(safeStage(definition, 2).title)}</strong><small>Origem e duplicação verificadas.</small></div><article class="vozen-social-card vozen-stage-item" data-beat="3"><div class="vozen-thumbnail" aria-hidden="true"><span>▶</span></div><div><span class="vozen-semantic-kicker">ALERTA PREPARADO</span><strong>${escapeHtml(safeStage(definition, 3).title)}</strong><small>${escapeHtml(safeStage(definition, 3).text)}</small></div></article>${stageCard(definition, 4, "vozen-semantic-result")}`, `vozen-scene-social vozen-scene-${platform}`);
}

function renderPollLike(definition, kind) {
  const labels = {
    leaderboard: ["PÓDIO", "1.º  Diogo · 1 240 XP", "2.º  Marta · 980 XP", "3.º  Rui · 760 XP"],
    levels: ["PROGRESSO", "Nível 12", "+24 XP", "78% até ao próximo nível"],
    "role-panel": ["PAINEL DE CARGOS", "🎮 Jogos", "🎨 Criativo", "📣 Eventos"],
    event: ["EVENTO", "Sábado · 21:00", "18/20 participantes", "Lembrete ativo"],
    giveaway: ["SORTEIO", "Prémio: cargo VIP", "24 participações", "Reroll disponível"],
    achievement: ["CONQUISTA", "Distintivo bloqueado", "8/10 marcos", "Objetivo definido"],
    birthday: ["CALENDÁRIO", "Aniversário privado", "Próxima data agendada", "Mensagem preparada"],
    economy: ["CARTEIRA", "Saldo · 1 240 moedas", "+80 moedas", "Movimento registado"],
    "rank-card": ["XP CARD", "Nível 12 · 1 240 XP", "Tema aplicado", "Cartão Discord"],
  }[kind] || [definition.title, safeStage(definition, 0).title, safeStage(definition, 1).title, safeStage(definition, 2).title];
  return shell(definition, `<article class="vozen-community-hero vozen-stage-item is-complete" data-beat="0"><span class="vozen-semantic-kicker">${labels[0]}</span><strong>${escapeHtml(labels[1])}</strong><small>${escapeHtml(labels[2])}</small><b class="vozen-progress-track"><i style="--progress-width:64%"></i></b></article><div class="vozen-community-progress vozen-stage-item" data-beat="1"><span class="vozen-semantic-kicker">${escapeHtml(labels[3])}</span><div class="vozen-progress-track"><i style="--progress-width:64%"></i></div><strong>${escapeHtml(safeStage(definition, 1).title)}</strong><small>${escapeHtml(safeStage(definition, 1).text)}</small></div>${stageCard(definition, 2)}${stageCard(definition, 3)}${stageCard(definition, 4, "vozen-semantic-result")}`, `vozen-scene-${kind}`);
}

function renderData(definition, kind) {
  const cards = {
    audit: ["AUTOR", "Diogo · gestão", "ALVO", "Cargo · Moderador"],
    privacy: ["PEDIDO PRIVADO", "Exportação de dados", "RETENÇÃO", "30 dias"],
    template: ["PACOTE", "Comunidade base", "RECURSOS", "Canais · cargos · módulos"],
    stats: ["MÉTRICAS", "1 240 membros", "ATUALIZAÇÃO", "A cada 15 minutos"],
    "invite-tracker": ["CONVITE", "vozen.gg/comunidade", "ORIGEM", "Diogo · 12 entradas"],
    monetization: ["APOIO", "Nível comunidade", "BENEFÍCIO", "Cargo e acesso"],
    "crypto-stats": ["ATIVO", "ETH · mercado", "VARIAÇÃO", "+4,2%"],
    "nft-stats": ["COLEÇÃO", "Vozen Pass", "FLOOR", "1,20 ETH"],
  }[kind] || [definition.title, safeStage(definition, 0).title, "ESTADO", safeStage(definition, 1).title];
  return shell(definition, `<div class="vozen-data-summary vozen-stage-item is-complete" data-beat="0"><span><small>${cards[0]}</small><strong>${escapeHtml(cards[1])}</strong></span><span><small>${cards[2]}</small><strong>${escapeHtml(cards[3])}</strong></span></div><div class="vozen-data-visual vozen-stage-item" data-beat="1"><i style="--bar-height:38%"></i><i style="--bar-height:62%"></i><i style="--bar-height:48%"></i><i style="--bar-height:82%"></i><i style="--bar-height:70%"></i><strong>${escapeHtml(safeStage(definition, 1).title)}</strong></div>${stageCard(definition, 2)}${stageCard(definition, 3)}${stageCard(definition, 4, "vozen-semantic-result")}`, `vozen-scene-${kind}`);
}

function renderFlow(definition, kind) {
  const labels = {
    moderation: ["CASO", "Aviso 2/3", "AÇÃO", "Timeout preparado"],
    "custom-command": ["MENSAGEM", "!regras", "RESPOSTA", "Conteúdo preparado"],
    workflow: ["GATILHO", "Mensagem recebida", "AÇÃO", "Adicionar cargo"],
    help: ["PEDIDO", "/ajuda", "TÓPICOS", "Comandos encontrados"],
    reminder: ["LEMBRETE", "60 min", "DESTINO", "#geral"],
    nickname: ["MEMBRO", "Nome atual", "ALTERAÇÃO", "Novo nickname"],
    ticket: ["TICKET", "#ticket-104", "EQUIPA", "Suporte associado"],
    welcome: ["MEMBRO", "Novo membro", "DESTINO", "#boas-vindas"],
    "welcome-channel": ["ENTRADA", "#começa-aqui", "REGRAS", "Confirmação pendente"],
    "temporary-channel": ["VOZ", "Sala de Diogo", "ESTADO", "Canal ativo"],
    embed: ["EDITOR", "Título e texto", "CARTÃO", "Embed Discord"],
    emoji: ["GALERIA", "😀 🎉 ✅", "SELEÇÃO", "Emoji válido"],
    search: ["CONSULTA", "canais de ajuda", "RESULTADOS", "3 referências"],
  }[kind] || [definition.title, safeStage(definition, 0).title, "RESULTADO", safeStage(definition, 1).title];
  return shell(definition, `<div class="vozen-flow-source vozen-stage-item is-complete" data-beat="0"><span class="vozen-flow-icon">⌁</span><div><span class="vozen-semantic-kicker">${labels[0]}</span><strong>${escapeHtml(labels[1])}</strong></div></div><div class="vozen-flow-connector" aria-hidden="true"><i></i><i></i><i></i></div><div class="vozen-flow-node vozen-stage-item" data-beat="1"><span class="vozen-semantic-kicker">${escapeHtml(safeStage(definition, 1).label)}</span><strong>${escapeHtml(safeStage(definition, 1).title)}</strong><small>${escapeHtml(safeStage(definition, 1).text)}</small></div><div class="vozen-flow-node vozen-stage-item" data-beat="2"><span class="vozen-semantic-kicker">${labels[2]}</span><strong>${escapeHtml(labels[3])}</strong><small>${escapeHtml(safeStage(definition, 2).text)}</small></div>${stageCard(definition, 3)}${stageCard(definition, 4, "vozen-semantic-result")}`, `vozen-scene-${kind}`);
}

function renderWeb3(definition, kind) {
  const labels = { "crypto-query": ["ATIVO", "ETH / BTC", "PREÇO", "1 240,00 €"], "gas-tracker": ["REDE", "Ethereum", "TAXA", "Média · 24 Gwei"], "token-gate": ["CARTEIRA", "0x7A…42", "ACESSO", "Coleção confirmada"], "nft-query": ["COLEÇÃO", "Vozen Pass", "REDE", "Ethereum"], "nft-sale": ["EVENTO", "Vozen Pass #104", "PREÇO", "1,20 ETH"], "nft-stats": ["COLEÇÃO", "Vozen Pass", "VOLUME", "42,8 ETH"] }[kind] || ["REDE", definition.title, "DADOS", safeStage(definition, 1).title];
  return shell(definition, `<div class="vozen-chain-card vozen-stage-item is-complete" data-beat="0"><span class="vozen-chain-orbit">◈</span><div><span class="vozen-semantic-kicker">${labels[0]}</span><strong>${escapeHtml(labels[1])}</strong></div><span class="vozen-chain-state">●</span></div><div class="vozen-chain-metrics vozen-stage-item" data-beat="1"><span><small>${labels[2]}</small><strong>${escapeHtml(labels[3])}</strong></span><span><small>ATUALIZAÇÃO</small><strong>agora</strong></span></div><div class="vozen-chain-proof vozen-stage-item" data-beat="2"><span>✓</span><strong>${escapeHtml(safeStage(definition, 2).title)}</strong><small>${escapeHtml(safeStage(definition, 2).text)}</small></div>${stageCard(definition, 3)}${stageCard(definition, 4, "vozen-semantic-result")}`, `vozen-scene-${kind}`);
}

export function renderPreviewScene(definition) {
  if (!definition?.renderer) return "";
  const renderer = definition.renderer;
  if (renderer === "poll") return renderPoll(definition);
  if (renderer === "starboard") return renderStarboard(definition);
  if (renderer === "suggestion") return renderSuggestion(definition);
  if (["antispam", "antiscam", "anti-raid", "join-gate"].includes(renderer)) return renderProtection(definition, renderer);
  if (renderer.startsWith("social-")) return renderSocial(definition, renderer);
  if (["leaderboard", "levels", "role-panel", "event", "giveaway", "achievement", "birthday", "economy", "rank-card"].includes(renderer)) return renderPollLike(definition, renderer);
  if (["audit", "privacy", "template", "stats", "invite-tracker", "monetization", "crypto-stats", "nft-stats"].includes(renderer)) return renderData(definition, renderer);
  if (["crypto-query", "gas-tracker", "token-gate", "nft-query", "nft-sale"].includes(renderer)) return renderWeb3(definition, renderer);
  return renderFlow(definition, renderer);
}

const focusableSelector = "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function closeModulePreview() {
  const modal = one("#vozen-simulation-modal");
  if (!modal) return;
  modal._previewCleanup?.();
  document.body.classList.remove("vozen-modal-open");
  const trigger = modal._previewTrigger;
  modal.remove();
  trigger?.focus?.();
}

export function openModulePreview({ moduleId, values = {}, definition = getPreviewDefinition(moduleId, values), title, trigger } = {}) {
  if (!definition) {
    console.error(`[Vozen preview] Definição desconhecida: ${moduleId || "sem ID"}`);
    return null;
  }
  closeModulePreview();
  const heading = title || definition.title || "Módulo";
  const modal = document.createElement("div");
  modal.id = "vozen-simulation-modal";
  modal.className = "vozen-simulation-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "vozen-simulation-title");
  modal.setAttribute("aria-describedby", "vozen-simulation-description");
  modal._previewTrigger = trigger || document.activeElement;
  modal.innerHTML = `<div class="vozen-simulation-backdrop" data-simulation-close="true"></div><section class="vozen-simulation-dialog" role="document" style="--preview-accent:${escapeHtml(definition.accent)};--preview-secondary:${escapeHtml(definition.secondary)}"><header class="vozen-simulation-header"><div><span class="vozen-eyebrow">PRÉ-VISUALIZAÇÃO SEGURA</span><h2 id="vozen-simulation-title">${escapeHtml(heading)}</h2><p id="vozen-simulation-description">Vê o que esta configuração faria antes de publicar.</p></div><button type="button" class="vozen-simulation-close" aria-label="Fechar pré-visualização">×</button></header><div class="vozen-simulation-badge"><span aria-hidden="true">●</span> Apenas pré-visualização · Nenhuma ação real será enviada</div><div class="vozen-simulation-content"><ol class="vozen-scenario-rail" aria-label="Etapas da pré-visualização">${definition.stages.map((stage, index) => `<li class="vozen-scenario-step ${index === 0 ? "is-active" : ""}" data-rail-beat="${index}"><span>${index + 1}</span><div><strong>${escapeHtml(stage.label)}</strong><small>${escapeHtml(stage.title)}</small></div></li>`).join("")}</ol><div class="vozen-signal-column"><div class="vozen-signal-stage" data-scene="${escapeHtml(definition.renderer)}">${renderPreviewScene(definition)}</div><p class="vozen-live-preview-note">Exemplo visual. Nada é enviado para o Discord ou para serviços externos.</p></div></div><p class="vozen-preview-sr-summary" aria-live="polite">Pré-visualização pronta.</p><footer class="vozen-simulation-footer"><div class="vozen-preview-progress-wrap"><div class="vozen-preview-progress" role="progressbar" aria-label="Progresso da pré-visualização" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-preview-progress></span></div><span data-preview-state>Pronta</span></div><div class="vozen-preview-controls"><button type="button" class="vozen-preview-replay" aria-label="Repetir pré-visualização">Repetir</button><button type="button" class="primary vozen-preview-playback" aria-label="Reproduzir pré-visualização">Reproduzir</button><button type="button" class="secondary vozen-simulation-done">Fechar pré-visualização</button></div></footer></section>`;
  document.body.append(modal);
  document.body.classList.add("vozen-modal-open");
  const playback = { status: "idle", elapsed: 0, startedAt: 0, raf: 0, timeout: 0, beat: 0, observer: null };
  const progress = one("[data-preview-progress]", modal);
  const progressTrack = one(".vozen-preview-progress", modal);
  const stateLabel = one("[data-preview-state]", modal);
  const playbackButton = one(".vozen-preview-playback", modal);
  const replayButton = one(".vozen-preview-replay", modal);
  const srSummary = one(".vozen-preview-sr-summary", modal);
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const beatForTime = (elapsed) => Math.min(definition.stages.length - 1, Math.floor((elapsed / definition.duration) * definition.stages.length));
  const renderBeat = (beat) => {
    playback.beat = beat;
    all("[data-rail-beat]", modal).forEach((item) => { const itemBeat = Number(item.dataset.railBeat); item.classList.toggle("is-active", itemBeat === beat); item.classList.toggle("is-complete", itemBeat < beat || playback.status === "completed"); });
    all("[data-beat]", modal).forEach((item) => { const itemBeat = Number(item.dataset.beat); item.classList.toggle("is-active", itemBeat === beat); item.classList.toggle("is-complete", itemBeat < beat || playback.status === "completed"); });
    const status = one("[data-stage-status]", modal); if (status) status.textContent = safeStage(definition, beat).status;
  };
  const setStatus = (status) => {
    playback.status = status; modal.dataset.playback = status;
    const labels = { idle: ["Reproduzir", "Reproduzir pré-visualização", false, "Pronta"], playing: ["Pausar", "Pausar pré-visualização", false, "A reproduzir"], paused: ["Continuar", "Continuar pré-visualização", false, "Em pausa"], replaying: ["A preparar…", "Repetir pré-visualização", true, "A repetir"], completed: ["Repetir", "Repetir pré-visualização", false, "Concluída"] };
    const [label, aria, disabled, state] = labels[status] || labels.idle;
    if (playbackButton) { playbackButton.textContent = label; playbackButton.setAttribute("aria-label", aria); playbackButton.disabled = disabled; }
    if (replayButton) replayButton.disabled = disabled;
    if (stateLabel) stateLabel.textContent = state;
    if (status === "completed" && srSummary) srSummary.textContent = `Pré-visualização concluída. ${definition.finalSummary}`;
    if (status === "paused" && srSummary) srSummary.textContent = `Pré-visualização em pausa na etapa ${safeStage(definition, playback.beat).label}.`;
  };
  const updateProgress = () => { const percentage = Math.round((playback.elapsed / definition.duration) * 100); if (progress) progress.style.width = `${percentage}%`; if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(percentage)); };
  const render = () => { if (playback.status !== "playing") return; playback.elapsed = Math.min(definition.duration, performance.now() - playback.startedAt); renderBeat(beatForTime(playback.elapsed)); updateProgress(); if (playback.elapsed >= definition.duration) { setStatus("completed"); renderBeat(definition.stages.length - 1); updateProgress(); return; } playback.raf = window.requestAnimationFrame(render); };
  const start = () => { playback.startedAt = performance.now() - playback.elapsed; setStatus("playing"); playback.raf = window.requestAnimationFrame(render); };
  const pause = () => { if (playback.status !== "playing") return; window.cancelAnimationFrame(playback.raf); playback.elapsed = Math.min(definition.duration, performance.now() - playback.startedAt); setStatus("paused"); renderBeat(beatForTime(playback.elapsed)); updateProgress(); };
  const replay = () => { window.cancelAnimationFrame(playback.raf); window.clearTimeout(playback.timeout); playback.elapsed = 0; updateProgress(); setStatus("replaying"); renderBeat(0); playback.timeout = window.setTimeout(() => start(), reduceMotion ? 0 : 180); };
  const togglePlayback = () => { if (playback.status === "playing") pause(); else if (playback.status === "paused") start(); else replay(); };
  const close = () => closeModulePreview();
  const onKeyDown = (event) => { if (event.key === "Escape") { event.preventDefault(); close(); return; } if (event.key !== "Tab") return; const items = all(focusableSelector, modal); if (!items.length) return; const first = items[0]; const last = items.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } };
  const onVisibility = () => { if (document.hidden) pause(); };
  modal._previewCleanup = () => { window.cancelAnimationFrame(playback.raf); window.clearTimeout(playback.timeout); document.removeEventListener("keydown", onKeyDown); document.removeEventListener("visibilitychange", onVisibility); playback.observer?.disconnect(); };
  document.addEventListener("keydown", onKeyDown); document.addEventListener("visibilitychange", onVisibility);
  one(".vozen-simulation-close", modal)?.addEventListener("click", close); one(".vozen-simulation-done", modal)?.addEventListener("click", close); one("[data-simulation-close]", modal)?.addEventListener("click", close); playbackButton?.addEventListener("click", togglePlayback); replayButton?.addEventListener("click", replay);
  playback.observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => { if (!entries[0]?.isIntersecting) pause(); }) : null; playback.observer?.observe(modal);
  renderBeat(0); setStatus("idle");
  if (reduceMotion) { playback.elapsed = definition.duration; renderBeat(definition.stages.length - 1); updateProgress(); setStatus("completed"); } else playback.timeout = window.setTimeout(() => start(), 300);
  window.requestAnimationFrame(() => one(".vozen-simulation-close", modal)?.focus());
  return modal;
}
