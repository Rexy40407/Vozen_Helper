import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PREVIEW_IDS, CONFIGURABLE_IDS, getPreviewDefinition } from '../site/module-previews.js';

const index = await readFile(new URL('../site/index.html', import.meta.url), 'utf8');
const bundleName = index.match(/assets\/(index-[^"']+\.js)/)?.[1];
assert.ok(bundleName, 'the published app bundle must be declared in site/index.html');
const bundle = await readFile(new URL(`../site/assets/${bundleName}`, import.meta.url), 'utf8');
const styles = await readFile(new URL('../site/ui-refresh.css', import.meta.url), 'utf8');

const catalogIds = [...bundle.matchAll(/\{key:`([^`]+)`,label:`[^`]+`,description:`[^`]+`,category:/g)].map((match) => match[1]);
const configurableIds = new Set([...bundle.matchAll(/"([a-z_]+\.[a-z_]+)":\[\{title:`/g)].map((match) => match[1]));
configurableIds.add('social.twitch');

test('every catalog module has a semantic preview definition', () => {
  const missing = [...new Set(catalogIds)].filter((id) => !PREVIEW_IDS.includes(id));
  assert.deepEqual(missing, []);
  assert.equal(PREVIEW_IDS.length, 52);
});

test('every configurable module is covered by the preview registry', () => {
  assert.deepEqual([...configurableIds].sort(), [...CONFIGURABLE_IDS].sort());
  assert.equal(CONFIGURABLE_IDS.length, 28);
});

test('each preview has a complete, non-generic five-beat story', () => {
  for (const id of PREVIEW_IDS) {
    const preview = getPreviewDefinition(id);
    assert.ok(preview, `${id} must resolve`);
    assert.ok(preview.stages.length >= 4 && preview.stages.length <= 6, `${id} must have 4–6 stages`);
    assert.ok(preview.stages.every((stage) => stage.label && stage.title && stage.text && stage.status), `${id} has an incomplete stage`);
    assert.ok(!preview.stages.some((stage) => /Rules evaluated|Helper response prepared|Preview complete/i.test(`${stage.title} ${stage.text}`)), `${id} still uses the generic fallback copy`);
    assert.ok(!/Rules evaluated|Helper response prepared|Preview complete/i.test(preview.finalSummary), `${id} still uses the generic final summary`);
  }
});

test('polls describes a real poll flow and uses current settings', () => {
  const preview = getPreviewDefinition('management.polls', { allowMultiple: true, defaultDurationHours: 48 });
  assert.deepEqual(preview.stages.map((stage) => stage.title), [
    'Question prepared',
    'Poll published',
    'Members choose',
    'Results counted',
    'Poll completed',
  ]);
  assert.match(preview.stages[4].text, /privacy/);
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

test('English overlay and preview controller are wired together', async () => {
  assert.match(index, /ui-english\.js/);
  const refresh = await readFile(new URL('../site/ui-refresh.js', import.meta.url), 'utf8');
  assert.match(refresh, /module-previews\.js/);
  assert.match(refresh, /prefers-reduced-motion/);
  assert.match(refresh, /Close simulation preview/);
});

test('poll scene uses content-driven flow instead of overlapping absolute cards', () => {
  assert.match(styles, /\.vozen-scene-poll\s*\{[\s\S]*?display:\s*grid/);
  assert.match(styles, /\.vozen-scene-poll \.vozen-poll-card,[\s\S]*?position:\s*relative !important/);
});
