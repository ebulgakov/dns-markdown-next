#!/usr/bin/env bash
# PreToolUse hook for ExitPlanMode: if the agent is about to leave plan mode
# while still on `main`, auto-create + switch to a gitflow-style branch
# (feature/|fix/|chore/|refactor/) derived from the plan just written, so
# execution never lands directly on main. No-op on any other branch.
# Fails open: any error here just skips branch creation, never blocks
# ExitPlanMode.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

allow() {
  python3 -c '
import json, sys
print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "allow",
        "permissionDecisionReason": sys.argv[1],
    }
}))
' "$1"
  exit 0
}

current_branch=$(git branch --show-current 2>/dev/null || true)
[ "$current_branch" = "main" ] || allow "Not on main, leaving branch as-is."

stdin_json=$(cat)

branch_name=$(python3 - "$stdin_json" <<'PYEOF'
import json, re, sys, os, glob

def slugify(text, max_words=6):
    words = re.findall(r"[a-zA-Z0-9]+", text.lower())[:max_words]
    return "-".join(words) if words else ""

def pick_type(text):
    t = text.lower()
    if re.search(r"\b(fix|bug|broken|error)\b", t):
        return "fix"
    if re.search(r"\brefactor\b", t):
        return "refactor"
    if re.search(r"\b(chore|ci|deps?|docs?|tooling)\b", t):
        return "chore"
    return "feature"

try:
    data = json.loads(sys.argv[1])
    transcript_path = data.get("transcript_path", "")
except Exception:
    transcript_path = ""

plan_path = ""
if transcript_path and os.path.exists(transcript_path):
    try:
        with open(transcript_path) as f:
            for line in f:
                try:
                    entry = json.loads(line)
                except Exception:
                    continue
                blocks = entry.get("message", {}).get("content", [])
                if isinstance(blocks, list):
                    for b in blocks:
                        if (isinstance(b, dict) and b.get("type") == "tool_use"
                                and b.get("name") == "Write"):
                            fp = b.get("input", {}).get("file_path", "")
                            if "/.claude/plans/" in fp and fp.endswith(".md"):
                                plan_path = fp  # keep last match = most recent
    except Exception:
        pass

if not plan_path:
    candidates = glob.glob(os.path.expanduser("~/.claude/plans/*.md"))
    if candidates:
        plan_path = max(candidates, key=os.path.getmtime)

slug = ""
type_ = "feature"
if plan_path and os.path.exists(plan_path):
    try:
        with open(plan_path) as f:
            content = f.read()
        heading = re.search(r"^#{1,2}\s+(.+)$", content, re.MULTILINE)
        title = heading.group(1) if heading else ""
        slug = slugify(title)
        type_ = pick_type(content)
    except Exception:
        pass

if not slug and plan_path:
    slug = os.path.splitext(os.path.basename(plan_path))[0]

if not slug:
    import time
    slug = f"plan-{int(time.time())}"

print(f"{type_}/{slug}")
PYEOF
)

[ -n "$branch_name" ] || allow "Could not derive a branch name; staying on main."

final_name="$branch_name"
n=2
while git rev-parse --verify --quiet "refs/heads/$final_name" >/dev/null 2>&1; do
  final_name="${branch_name}-${n}"
  n=$((n + 1))
done

if git checkout -b "$final_name" >/dev/null 2>&1; then
  allow "Created and switched to '$final_name' (main is protected from direct execution)."
else
  allow "Branch creation failed; staying on main."
fi
