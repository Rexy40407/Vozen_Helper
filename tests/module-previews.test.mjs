import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PREVIEW_IDS, CONFIGURABLE_IDS, getPreviewDefinition } from '../site/module-previews.js';
import { renderPreviewScene } from '../site/module-preview-player.js';

const index = await readFile(new URL('../site/index.html', import.meta.url), 'utf8');
const bundleName = index.match(/assets\/(index-[^"']+\.js)/)?.[1];
assert.ok(bundleName, 'the published app bundle must be declared in site/index.html');
const bundle = await readFile(new URL(`../site/assets/${bundleName}`, import.meta.url), 'utf8');
const styles = await readFile(new URL('../site/ui-refresh.css', import.meta.url), 'utf8');
const previewStyles = await readFile(new URL('../site/module-previews.css', import.meta.url), 'utf8');

// The current panel receives schemas/defaults from the Rust API. Older bundles
// embedded a `var ie={...}` schema map; keep the legacy check for those
// bundles, but do not require frontend-owned defaults in the current one.
const legacySchemaBundle = /var ie=\{/.test(bundle);
const catalogIds = PREVIEW_IDS.filter((id) => bundle.includes(`key:\`${id}\``));
const configurableIds = legacySchemaBundle
  ? new Set([...bundle.matchAll(/"([a-z_]+\.[a-z_]+)":\[\{title:`/g)].map((match) => match[1]))
  : new Set(CONFIGURABLE_IDS.filter((id) => bundle.includes(id)));
if (legacySchemaBundle) configurableIds.add('social.twitch');
const defaults = legacySchemaBundle ? bundle.slice(bundle.indexOf('var ie={')) : '';

test('every catalog module has a semantic preview definition', () => {
  assert.deepEqual(catalogIds.sort(), [...PREVIEW_IDS].sort());
  assert.equal(PREVIEW_IDS.length, 52);
});

test('every configurable module is covered by the preview registry', () => {
  assert.deepEqual([...configurableIds].sort(), [...CONFIGURABLE_IDS].sort());
  assert.equal(CONFIGURABLE_IDS.length, 28);
});

test('preview fields stay aligned with each configurable module schema', () => {
  if (!legacySchemaBundle) return;
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const id of CONFIGURABLE_IDS) {
    const match = defaults.match(new RegExp(`"${escapeRegExp(id)}":\\{([\\s\\S]*?)\\}(?=,?[\"}])`));
    assert.ok(match, `${id} must have a schema in the app bundle`);
    const schemaFields = new Set([...match[1].matchAll(/(?:^|,)([a-zA-Z][\w]*):/g)].map((field) => field[1]));
    const missing = getPreviewDefinition(id).fields.filter((field) => !schemaFields.has(field));
    assert.deepEqual(missing, [], `${id} preview uses fields absent from its schema`);
  }
});

test('each preview has a complete, non-generic five-beat story', () => {
  for (const id of PREVIEW_IDS) {
    const preview = getPreviewDefinition(id);
    assert.ok(preview, `${id} must resolve`);
    assert.ok(preview.stages.length >= 4 && preview.stages.length <= 6, `${id} must have 4–6 stages`);
    assert.ok(preview.stages.every((stage) => stage.label && stage.title && stage.text && stage.status), `${id} has an incomplete stage`);
    assert.ok(['available', 'hidden', 'roadmap'].includes(preview.availability), `${id} has invalid availability`);
    assert.ok(preview.renderer && preview.renderer !== 'generic', `${id} must declare a specific renderer`);
    assert.ok(preview.visual && preview.themeTerms.length >= 2, `${id} must expose visual theme metadata`);
    assert.ok(!preview.stages.some((stage) => /Rules evaluated|Helper response prepared|Preview complete/i.test(`${stage.title} ${stage.text}`)), `${id} still uses the generic fallback copy`);
    assert.ok(!/Rules evaluated|Helper response prepared|Preview complete/i.test(preview.finalSummary), `${id} still uses the generic final summary`);
  }
});

test('polls describes a real poll flow and uses current settings', () => {
  const preview = getPreviewDefinition('management.polls', { allowMultiple: true, defaultDurationHours: 48 });
  assert.deepEqual(preview.stages.map((stage) => stage.title), [
    'Question prepared',
    'Poll published',
    'Members choose options',
    'Results update',
    'Poll completed',
  ]);
  assert.match(preview.stages[4].text, /final summary/i);
  assert.equal(preview.data.allowMultiple, 'yes');
});

test('all previews expose a deterministic palette and duration', () => {
  for (const id of PREVIEW_IDS) {
    const preview = getPreviewDefinition(id);
    assert.match(preview.accent, /^#[0-9a-f]{6}$/i, `${id} accent is invalid`);
    assert.match(preview.secondary, /^#[0-9a-f]{6}$/i, `${id} secondary color is invalid`);
    assert.ok(preview.duration >= 4000 && preview.duration <= 8000, `${id} duration is outside the motion budget`);
  }
});

test('English UI and safe preview controller are wired together', async () => {
  assert.match(index, /<html lang="en">/);
  assert.doesNotMatch(index, /ui-english\.js/);
  assert.match(index, /ui-localization\.js/);
  const refresh = await readFile(new URL('../site/ui-refresh.js', import.meta.url), 'utf8');
  const player = await readFile(new URL('../site/module-preview-player.js', import.meta.url), 'utf8');
  assert.match(refresh, /module-previews\.js/);
  assert.match(refresh, /module-preview-player\.js/);
  assert.match(refresh, /Unknown definition/);
  assert.doesNotMatch(refresh, /management\.workflows.*dryRun/);
  assert.match(player, /prefers-reduced-motion/);
  assert.match(player, /SAFE PREVIEW/);
  assert.match(player, /vozen-chat-thread/);
  assert.doesNotMatch(player, /PRÉ-VISUALIZAÇÃO|Reproduzir|Fechar pré-visualização/);
  assert.doesNotMatch(refresh, /SAFE PREVIEW|Preview only|Play preview/);
});

test('preview CSS is consolidated without cascade overrides', () => {
  assert.doesNotMatch(styles, /vozen-(simulation-modal|semantic-scene|scene-poll|preview-progress|scenario-step)-/);
  assert.match(previewStyles, /\.vozen-scene-poll\s*\{[\s\S]*?display:\s*grid/);
  assert.doesNotMatch(previewStyles, /!important/);
});

test('unknown modules never silently resolve to another story', () => {
  assert.equal(getPreviewDefinition('management.unknown'), null);
  assert.equal(getPreviewDefinition('management.workflows-typo'), null);
});

test('values are escaped before entering preview text', () => {
  const preview = getPreviewDefinition('management.polls');
  const unsafe = '<img src=x onerror=alert(1)>';
  const rendered = renderPreviewScene({ ...preview, stages: preview.stages.map((stage, index) => index === 1 ? { ...stage, title: unsafe } : stage) });
  assert.match(rendered, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(rendered, /<img src=x/);
});

test('tickets renders a conversation instead of a generic flow', () => {
  const preview = getPreviewDefinition('support.tickets');
  const rendered = renderPreviewScene(preview);
  assert.match(rendered, /vozen-chat-thread/);
  assert.match(rendered, /#ticket-104/);
  assert.match(rendered, /Support team assigned/);
  assert.match(rendered, /Transcript saved/);
  assert.doesNotMatch(rendered, /Atendimento|Suporte|Transcrição|Ticket resolvido/);
});
