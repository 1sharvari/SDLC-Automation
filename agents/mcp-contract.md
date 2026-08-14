# External tool contract

Agents need these capabilities through configured MCP servers. The desired connection policy is in `config/mcp.json`; the Codex-level server and OAuth authorization are not stored in this repository.

| System | Required operations |
| --- | --- |
| Jira | Search/read/create/update issues; estimate; label; link; comment; transition; board status lookup |
| GitHub | Read repository; create branch; commit/push; create/read/review pull request; status checks |

Validate access with read-only calls before live writes. Use `config/workflow.yml` as the only status-name mapping. Use an approved connector's OAuth flow; never paste personal access tokens into this repository or this document.
