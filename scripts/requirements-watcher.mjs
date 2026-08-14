import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, watch, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDirectory, '..');
const requirementsPath = resolve(workspaceRoot, 'requirements/requirements.md');
const outputPath = resolve(workspaceRoot, 'automation/runs/latest-business-intake.json');
const statePath = resolve(workspaceRoot, 'automation/state/requirements.sha256');
const once = process.argv.includes('--once');

function extractRequirements(markdown) {
  const blocks = [...markdown.matchAll(/^###\s+(RQ-\d+):\s*(.+?)\s*$(.*?)(?=^###\s+RQ-\d+:|(?![\s\S]))/gms)];
  return blocks.map(([, id, title, body]) => {
    const value = (field) => body.match(new RegExp(`^- \\*\\*${field}:\\*\\*[\\t ]*(.*)$`, 'mi'))?.[1].trim() ?? '';
    const acceptanceCriteria = [...body.matchAll(/^\s*-\s*Given\s+(.+?)\s+When\s+(.+?)\s+Then\s+(.+)$/gmi)]
      .map(([, given, when, then]) => ({ given: given.trim(), when: when.trim(), then: then.trim() }));
    return {
      id,
      title: title.trim(),
      businessValue: value('Problem / business value'),
      users: value('Users / roles'),
      userJourney: value('User journey'),
      priority: value('Priority'),
      acceptanceCriteria
    };
  });
}

function validate(requirement) {
  const missing = [];
  if (!requirement.title || requirement.title.startsWith('<')) missing.push('title');
  if (!requirement.businessValue || requirement.businessValue.startsWith('<')) missing.push('business value');
  if (requirement.acceptanceCriteria.length === 0) missing.push('acceptance criteria');
  return missing;
}

function estimatePoints(requirement) {
  const criteria = requirement.acceptanceCriteria.length;
  if (criteria <= 1) return 2;
  if (criteria <= 3) return 3;
  if (criteria <= 5) return 5;
  return 8;
}

function processRequirements() {
  const markdown = readFileSync(requirementsPath, 'utf8');
  const checksum = createHash('sha256').update(markdown).digest('hex');
  const previousChecksum = existsSync(statePath) ? readFileSync(statePath, 'utf8').trim() : '';
  if (checksum === previousChecksum && !once) return false;

  const requirements = extractRequirements(markdown).map((requirement) => {
    const missing = validate(requirement);
    return {
      ...requirement,
      readiness: missing.length === 0 ? 'ready-for-business-agent' : 'blocked',
      blockers: missing,
      proposedStoryPoints: missing.length === 0 ? estimatePoints(requirement) : null,
      proposedLabels: [requirement.id.toLowerCase(), 'angular', 'node', 'e2e'].filter(Boolean),
      proposedAction: missing.length === 0 ? 'create-or-update-jira-hierarchy' : 'request-requirement-completion'
    };
  });

  const intake = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    mode: 'live',
    source: 'requirements/requirements.md',
    checksum,
    nextAgent: 'Business',
    requirements
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(intake, null, 2)}\n`);
  writeFileSync(statePath, `${checksum}\n`);
  console.log(`Business-agent intake generated: ${outputPath}`);
  return true;
}

if (!existsSync(requirementsPath)) throw new Error(`Requirement file not found: ${requirementsPath}`);
processRequirements();

if (!once) {
  console.log(`Watching ${requirementsPath}. Press Ctrl+C to stop.`);
  let timer;
  watch(requirementsPath, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { processRequirements(); } catch (error) { console.error(error); }
    }, 400);
  });
}
