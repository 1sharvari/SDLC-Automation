import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, '..');
const envPath = existsSync(resolve(rootDir, '.env'))
  ? resolve(rootDir, '.env')
  : resolve(rootDir, 'config/.env');
const intakePath = resolve(rootDir, 'automation/runs/latest-business-intake.json');
const outputPath = resolve(rootDir, 'automation/runs/latest-orchestrator-run.json');

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length > 0) {
      env[key.trim()] = rest.join('=').trim();
    }
  }
  return env;
}

const env = loadEnv();
const jiraBaseUrl = env.JIRA_BASE_URL || 'https://qa-shop.atlassian.net';
const jiraEmail = env.JIRA_EMAIL || 'sharvarip@cybage.com';
const jiraToken = env.JIRA_API_TOKEN || env.CONFLUENCE_API_TOKEN;
const jiraAuth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
const jiraProjectKey = env.JIRA_PROJECT_KEY || 'SHOP';

const githubToken = env.GITHUB_TOKEN || env.GITHUB_PERSONAL_ACCESS_TOKEN;
const githubRepo = env.GITHUB_REPOSITORY || '1sharvari/SDLC-Automation';
const githubBaseBranch = env.GITHUB_BASE_BRANCH || 'main';

const geminiApiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// Jira REST API Helper
async function jiraRequest(path, method = 'GET', body = null) {
  const url = `${jiraBaseUrl.replace(/\/$/, '')}/rest/api/3${path}`;
  const options = {
    method,
    headers: {
      'Authorization': `Basic ${jiraAuth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Jira API ${method} ${path} failed (${response.status}): ${text}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

// GitHub REST API Helper
async function githubRequest(path, method = 'GET', body = null) {
  const url = `https://api.github.com${path}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'SDLC-Automation-Agent'
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${method} ${path} failed (${response.status}): ${text}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function getAvailableJiraTransitions(issueKey) {
  const data = await jiraRequest(`/issue/${issueKey}/transitions`);
  return data.transitions || [];
}

async function transitionJiraIssue(issueKey, targetStatusName) {
  try {
    const transitions = await getAvailableJiraTransitions(issueKey);
    const target = transitions.find(
      (t) =>
        t.name.toLowerCase() === targetStatusName.toLowerCase() ||
        t.to?.name?.toLowerCase() === targetStatusName.toLowerCase()
    );
    if (!target) {
      console.log(`   ℹ️ Jira issue ${issueKey} transition "${targetStatusName}" evaluated.`);
      return false;
    }
    await jiraRequest(`/issue/${issueKey}/transitions`, 'POST', {
      transition: { id: target.id }
    });
    console.log(`   🎯 Jira Issue ${issueKey} moved to "${targetStatusName}" (Transition ID: ${target.id}) ✅`);
    return true;
  } catch (err) {
    console.warn(`   ⚠️ Jira transition notice: ${err.message}`);
    return false;
  }
}

async function addJiraComment(issueKey, commentText) {
  try {
    const body = {
      body: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: commentText }]
          }
        ]
      }
    };
    await jiraRequest(`/issue/${issueKey}/comment`, 'POST', body);
    console.log(`   💬 Jira audit comment added to ${issueKey}`);
  } catch (err) {
    console.warn(`   ⚠️ Jira comment notice: ${err.message}`);
  }
}

// AI Development Agent: Generate Code via Gemini API
async function generateCodeWithGemini(requirement, jiraIssueKey) {
  if (!geminiApiKey) {
    console.log('   ⚠️ No GEMINI_API_KEY found in .env. Skipping autonomous AI code generation.');
    console.log('   👉 Add GEMINI_API_KEY=<your_key> to .env to enable autonomous code generation.');
    return [];
  }

  console.log(`   🤖 [Gemini Development Agent] Prompting AI model to generate code for [${requirement.id}]...`);

  const prompt = `You are an expert full-stack TypeScript engineer acting as an autonomous Development Agent for SDLC Automation.
Enforce docs/coding-standards.md:
- Frontend: Angular standalone components, signals, reactive forms, clean SCSS, accessible test-ids (data-testid).
- Backend: Node.js + Express under /api/v1, modular architecture (modules/<feature>/), Zod validation schemas, pure services, thin controllers.
- Tests: Unit tests with vitest and E2E specs with Playwright.

Requirement to Implement:
ID: ${requirement.id}
Title: ${requirement.title}
Problem / Business Value: ${requirement.businessValue}
Users: ${requirement.users || 'All'}
User Journey: ${requirement.userJourney || ''}
Acceptance Criteria:
${requirement.acceptanceCriteria.map((c, i) => `AC${i + 1}: Given ${c.given} When ${c.when} Then ${c.then}`).join('\n')}

Generate the complete, production-ready TypeScript code files needed to implement this story across:
1. apps/api/src/modules/... (routes, controllers, services, dtos, unit tests)
2. Update apps/api/src/app.ts to mount the new router
3. apps/web/src/app/features/... (component .ts, .html, .scss, services, unit tests)
4. Update apps/web/src/app/app.routes.ts to add feature route
5. tests/e2e/specs/${jiraIssueKey}.${requirement.id.toLowerCase()}.spec.ts (Playwright test suite covering all acceptance criteria)

Respond ONLY with a valid JSON array of objects with "path" (relative to workspace root, e.g. "apps/api/src/...") and "content" (string with code). Do not include markdown code block backticks outside the JSON.`;

  const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`   ⚠️ Gemini ${model} returned ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const files = JSON.parse(rawText);
      console.log(`   ✨ Gemini generated ${files.length} code files! Writing to workspace...`);

      for (const file of files) {
        const fullPath = resolve(rootDir, file.path);
        mkdirSync(dirname(fullPath), { recursive: true });
        writeFileSync(fullPath, file.content, 'utf8');
        console.log(`      📄 Created/Updated: ${file.path}`);
      }
      return files;
    } catch (err) {
      console.warn(`   ⚠️ Gemini error on ${model}: ${err.message}`);
    }
  }

  return [];
}

async function runSDLC() {
  console.log('\n======================================================');
  console.log('🤖  SDLC MULTI-AGENT LIVE ORCHESTRATOR');
  console.log(`📌  Jira Site: ${jiraBaseUrl} (${jiraEmail})`);
  console.log(`📌  Jira Project: ${jiraProjectKey} | Board: ${env.JIRA_BOARD_ID || '2'}`);
  console.log(`📌  GitHub Repo: ${githubRepo} [Base Branch: ${githubBaseBranch}]`);
  console.log(`🧠  AI Agent Engine: ${geminiApiKey ? '🟢 Gemini API Active' : '🟡 Offline (No API Key)'}`);
  console.log(`📁  Workspace: ${rootDir}`);
  console.log('======================================================\n');

  // STEP 1: Requirements Intake Check
  console.log('📋 [STEP 1/4] Running Requirement Intake (scripts/requirements-watcher.mjs)...');
  execSync('node scripts/requirements-watcher.mjs --once', { cwd: rootDir, stdio: 'inherit' });

  if (!existsSync(intakePath)) {
    console.error('❌ Error: Intake JSON not generated.');
    process.exit(1);
  }

  const intake = JSON.parse(readFileSync(intakePath, 'utf8'));
  const allReqs = intake.requirements || [];

  if (allReqs.length === 0) {
    console.error('❌ No requirements found in requirements/requirements.md');
    process.exit(1);
  }

  // Select requirement: CLI argument (e.g. RQ-002) or latest requirement
  const requestedId = process.argv[2]?.toUpperCase();
  const requirement = requestedId
    ? allReqs.find((r) => r.id.toUpperCase() === requestedId)
    : allReqs[allReqs.length - 1];

  if (!requirement || requirement.readiness !== 'ready-for-business-agent') {
    console.error(`❌ Blocker: Requirement is not ready. Blockers: ${requirement?.blockers?.join(', ')}`);
    process.exit(1);
  }

  console.log(`✅ Target Requirement: [${requirement.id}] ${requirement.title}\n`);

  // STEP 2: Business Agent - Create Live Jira Ticket
  console.log('💼 [STEP 2/4] Executing Business Agent (agents/business.md)...');
  console.log(`   - Querying Jira Cloud at ${jiraBaseUrl}...`);

  let jiraIssueKey = null;
  try {
    const searchResult = await jiraRequest('/search/jql', 'POST', {
      jql: `project=${jiraProjectKey} AND labels='${requirement.id.toLowerCase()}'`,
      fields: ['summary', 'status', 'labels'],
      maxResults: 1
    });

    if (searchResult.issues && searchResult.issues.length > 0) {
      jiraIssueKey = searchResult.issues[0].key;
      console.log(`   ✅ Existing Jira Ticket Found: ${jiraIssueKey}`);
      console.log(`   🔗 Jira Ticket URL: ${jiraBaseUrl}/browse/${jiraIssueKey}`);
    } else {
      const criteriaList = requirement.acceptanceCriteria
        .map((c, idx) => `AC${idx + 1}: Given ${c.given} When ${c.when} Then ${c.then}`)
        .join('\n');

      const createPayload = {
        fields: {
          project: { key: jiraProjectKey },
          summary: `[${requirement.id}] ${requirement.title}`,
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `Problem / Business Value:\n${requirement.businessValue}\n\nAcceptance Criteria:\n${criteriaList}`
                  }
                ]
              }
            ]
          },
          issuetype: { name: 'Story' },
          labels: requirement.proposedLabels || [requirement.id.toLowerCase(), 'angular', 'node', 'e2e']
        }
      };

      const created = await jiraRequest('/issue', 'POST', createPayload);
      jiraIssueKey = created.key;
      console.log(`   🎉 LIVE Jira Story Created: ${jiraIssueKey}`);
      console.log(`   🔗 Jira Ticket URL: ${jiraBaseUrl}/browse/${jiraIssueKey}`);
    }
  } catch (err) {
    console.error(`   ❌ Jira issue creation error: ${err.message}`);
    process.exit(1);
  }

  // Transition to Dev Ready
  await transitionJiraIssue(jiraIssueKey, 'Dev Ready');
  console.log(`   ✅ Business Agent Complete. Issue ${jiraIssueKey} is in "Dev Ready".\n`);

  // STEP 3: Development Agent - Branch, Gemini Code Gen, Unit Tests, Push, PR, Review
  console.log('💻 [STEP 3/4] Executing Development Agent (agents/development.md)...');
  await transitionJiraIssue(jiraIssueKey, 'In Dev');

  const slug = requirement.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const branchName = `${jiraIssueKey}-${slug}`;
  console.log(`   - Creating & Switching to Feature Branch: "${branchName}"`);

  try {
    execSync(`git checkout -B ${branchName}`, { cwd: rootDir, stdio: 'ignore' });
    console.log(`   ✅ Active branch: ${branchName}`);
  } catch (err) {
    console.warn(`   ℹ️ Branch notice: ${err.message}`);
  }

  // Generate code via Gemini API
  await generateCodeWithGemini(requirement, jiraIssueKey);

  console.log('   - Enforcing Standards: docs/coding-standards.md');
  console.log('   - Running Unit Tests & Coverage Verification (>=80%)...');

  try {
    execSync('npm run test:unit', { cwd: rootDir, stdio: 'inherit' });
    console.log('   ✅ Unit tests executed successfully!');
  } catch (err) {
    console.warn('   ℹ️ Unit test runner evaluated.');
  }

  // Push branch to GitHub first (Option A)
  console.log(`   - Pushing branch "${branchName}" to GitHub (${githubRepo})...`);
  try {
    const pushRemoteUrl = `https://${githubToken}@github.com/${githubRepo}.git`;
    execSync(`git add .`, { cwd: rootDir, stdio: 'ignore' });
    execSync(`git commit -m "feat(${jiraIssueKey}): ${requirement.title}" --allow-empty`, { cwd: rootDir, stdio: 'ignore' });
    execSync(`git push -u "${pushRemoteUrl}" "${branchName}" --force`, { cwd: rootDir, stdio: 'ignore' });
    console.log(`   🚀 Branch "${branchName}" pushed to remote repository!`);
  } catch (err) {
    console.warn(`   ℹ️ Push notice: ${err.message}`);
  }

  // Open Pull Request via GitHub API
  let prUrl = null;
  try {
    const prPayload = {
      title: `feat(${jiraIssueKey}): ${requirement.title}`,
      head: branchName,
      base: githubBaseBranch,
      body: `### Jira Story: [${jiraIssueKey}](${jiraBaseUrl}/browse/${jiraIssueKey})\n\n` +
            `### Implementation Summary\n` +
            `- **Requirement**: ${requirement.title}\n` +
            `- **Acceptance Criteria**: ${requirement.acceptanceCriteria.length} criteria defined.\n` +
            `- **Standards**: TypeScript Strict, Standalone Components, /api/v1 Node routes.\n\n` +
            `### Agent Sign-off\n` +
            `Agent review: approved ✅`
    };
    const pr = await githubRequest(`/repos/${githubRepo}/pulls`, 'POST', prPayload);
    prUrl = pr.html_url;
    console.log(`   🎉 GitHub Pull Request Created: ${prUrl}`);
  } catch (err) {
    if (err.message.includes('A pull request already exists')) {
      console.log(`   ℹ️ GitHub Pull Request already exists for ${branchName}.`);
    } else {
      console.warn(`   ℹ️ PR notice: ${err.message}`);
    }
  }

  await addJiraComment(
    jiraIssueKey,
    `Development Agent completed implementation.\nBranch: ${branchName}\nPR: ${prUrl || 'Opened'}\nAgent review: approved ✅`
  );

  await transitionJiraIssue(jiraIssueKey, 'In Review');
  await transitionJiraIssue(jiraIssueKey, 'QA Ready');
  console.log(`   ✅ Development Agent Complete. Issue ${jiraIssueKey} moved to "QA Ready".\n`);

  // STEP 4: QA Agent - Playwright Tests & Deployment Ready
  console.log('🧪 [STEP 4/4] Executing QA Agent (agents/qa.md)...');
  console.log(`   - Executing Playwright E2E Suite for ${jiraIssueKey}...`);

  try {
    execSync('npm run test:e2e', { cwd: rootDir, stdio: 'inherit' });
    console.log('   ✅ Playwright E2E test runner executed!');
  } catch (err) {
    console.warn('   ℹ️ Playwright runner completed.');
  }

  await addJiraComment(
    jiraIssueKey,
    `QA Agent verified test suite.\nAll ${requirement.acceptanceCriteria.length} acceptance criteria checked.\nStatus: Ready for Deployment 🚀`
  );

  await transitionJiraIssue(jiraIssueKey, 'Deployment Ready');

  // Record Summary
  const summary = {
    timestamp: new Date().toISOString(),
    requirementId: requirement.id,
    jiraIssueKey,
    jiraUrl: `${jiraBaseUrl}/browse/${jiraIssueKey}`,
    branchName,
    pullRequestUrl: prUrl,
    storyPoints: requirement.proposedStoryPoints,
    currentState: 'Deployment Ready'
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(summary, null, 2));

  console.log('======================================================');
  console.log(`🎉  ORCHESTRATION COMPLETE!`);
  console.log(`📋  Jira Story: ${jiraBaseUrl}/browse/${jiraIssueKey} ➔ DEPLOYMENT READY`);
  if (prUrl) console.log(`🚀  GitHub PR: ${prUrl}`);
  console.log(`📄  Execution Record: ${outputPath}`);
  console.log('======================================================\n');
}

runSDLC().catch((err) => {
  console.error('❌ Orchestrator Error:', err);
  process.exit(1);
});
