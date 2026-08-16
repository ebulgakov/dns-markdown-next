#!/usr/bin/env bash
# PreToolUse hook for EnterWorktree: always keep the agent on the current
# branch/checkout instead of switching into a git worktree. If a worktree for
# this repo already exists, warn that another agent's work may still be
# sitting there and should be closed out first.
set -euo pipefail

# Fail closed: if anything below errors (e.g. python3 missing), Claude Code
# only treats exit code 2 as a block — any other non-zero exit is silently
# non-blocking and would let EnterWorktree through. Trap ERR so a broken hook
# still denies instead of failing open.
fail_closed() {
  printf '%s\n' "block-worktree.sh failed before it could evaluate the policy; denying EnterWorktree to fail closed." >&2
  exit 2
}
trap fail_closed ERR

cd "${CLAUDE_PROJECT_DIR:-.}"

worktree_lines=$(git worktree list --porcelain 2>/dev/null | grep -c '^worktree ' || true)

if [ "${worktree_lines:-0}" -gt 1 ]; then
  reason="Another git worktree already exists for this repo — it looks like a previous agent session may still have work in progress there. Please finish, merge, or close that worktree first (see 'git worktree list'), then continue directly in the current branch. Per project policy this session will not create a new worktree."
else
  reason="Project policy: never switch into a git worktree — work directly in the current branch/checkout. If isolation is genuinely needed, ask the user to confirm explicitly first."
fi

python3 -c '
import json, sys
print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": sys.argv[1],
    }
}))
' "$reason"
