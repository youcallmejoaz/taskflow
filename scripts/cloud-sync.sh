#!/usr/bin/env bash
# Refresh this folder from the cloud working branch.
#
# Runs from a Claude Code SessionStart hook, so it must never surprise anyone:
# every unexpected condition is a silent no-op. It only ever fast-forwards, and
# it refuses to touch a dirty tree. Nothing here can discard local work.

set -uo pipefail

BRANCH="cloud-wip"

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$ROOT" || exit 0

if ! git fetch --quiet origin 2>/dev/null; then
  echo "cloud-sync: could not reach origin (offline?) — folder left as is."
  exit 0
fi

git show-ref --verify --quiet "refs/remotes/origin/$BRANCH" || exit 0

if [ -n "$(git status --porcelain)" ]; then
  echo "cloud-sync: uncommitted local changes — fetched, but not merged."
  exit 0
fi

current=$(git rev-parse --abbrev-ref HEAD)
if [ "$current" != "$BRANCH" ]; then
  echo "cloud-sync: on '$current', not '$BRANCH' — leaving it alone."
  exit 0
fi

local_sha=$(git rev-parse HEAD)
remote_sha=$(git rev-parse "origin/$BRANCH")
[ "$local_sha" = "$remote_sha" ] && exit 0

# --ff-only: if history diverged, this fails and changes nothing.
if git merge --ff-only "origin/$BRANCH" --quiet 2>/dev/null; then
  echo "cloud-sync: updated $BRANCH to $(git rev-parse --short HEAD)"
else
  echo "cloud-sync: local '$BRANCH' has diverged from origin — resolve by hand."
fi
