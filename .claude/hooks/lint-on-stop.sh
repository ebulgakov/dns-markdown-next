#!/usr/bin/env bash
# Stop hook: lint the monorepo once when the agent is about to finish its turn,
# instead of after every Write/Edit. On lint errors it exits 2, which blocks the
# stop and feeds stderr back to Claude so it fixes them before handing back.
# Skipped when the working tree is clean (turns that only read or answer).
set -uo pipefail

input=$(cat)
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

[ -n "$(git status --porcelain 2>/dev/null)" ] || exit 0

# true when Claude is already continuing because of this hook's previous block
stop_hook_active=$(printf '%s' "$input" | python3 -c '
import json, sys
try:
    print(str(json.load(sys.stdin).get("stop_hook_active", False)).lower())
except Exception:
    print("false")
')

if output=$(bun run lint --output-style=static 2>&1); then
  exit 0
fi

report=$(printf '%s\n' "$output" | sed -E $'s/\x1b\\[[0-9;]*m//g' | grep -vE '^\s*$' | tail -80)

if [ "$stop_hook_active" = "true" ]; then
  # Second failure in a row: don't loop forever, just surface it to the user.
  printf 'bun run lint still fails:\n%s\n' "$report" >&2
  exit 1
fi

printf 'bun run lint failed. Fix these errors before finishing:\n%s\n' "$report" >&2
exit 2
