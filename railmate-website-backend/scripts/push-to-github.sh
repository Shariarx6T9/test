#!/usr/bin/env bash
# ============================================================
# RailMate Website Backend – GitHub Push Script
# Run this script locally after extracting the ZIP.
#
# Usage:
#   chmod +x scripts/push-to-github.sh
#   ./scripts/push-to-github.sh
# ============================================================

set -euo pipefail

REPO_URL="https://github.com/shaheenx/test.git"
BRANCH="main"
FOLDER="railmate-website-backend"
COMMIT_MSG="feat: add production backend layer for RailMate website

- Next.js App Router API routes (contact, newsletter, waitlist,
  analytics, download-cta, business-inquiry, auth, upload)
- Supabase Auth (Email OTP + Google OAuth) helpers
- Supabase Storage upload helpers (avatars + community-photos)
- Resend email integration with HTML templates
- PostHog server-side analytics ingestion
- Zod input validation on all endpoints
- Rate limiting (Upstash Redis primary, in-memory fallback)
- Row Level Security SQL migrations (3 migration files)
- Environment variable validation with Zod (fail-fast)
- Security headers via Next.js middleware
- Structured error handling utilities
- TypeScript types for all domain entities
- .env.example, README, DEPLOYMENT guide"

echo ""
echo "🚂 RailMate Backend – GitHub Push"
echo "=================================="
echo "Repo   : $REPO_URL"
echo "Branch : $BRANCH"
echo "Folder : $FOLDER"
echo ""

# ── Validate git is available ────────────────────────────
if ! command -v git &>/dev/null; then
  echo "❌  git is not installed. Please install git and try again."
  exit 1
fi

# ── Clone the target repo ─────────────────────────────────
TMPDIR=$(mktemp -d)
echo "📥  Cloning $REPO_URL into $TMPDIR ..."
git clone "$REPO_URL" "$TMPDIR/repo"

# ── Copy backend files ────────────────────────────────────
echo "📂  Copying $FOLDER into repo ..."
mkdir -p "$TMPDIR/repo/$FOLDER"
cp -r ./* "$TMPDIR/repo/$FOLDER/"

# ── Commit and push ───────────────────────────────────────
cd "$TMPDIR/repo"
git config user.email "railmate-bot@railmate.app"
git config user.name "RailMate Bot"
git add "$FOLDER/"
git commit -m "$COMMIT_MSG"
echo "🚀  Pushing to $BRANCH ..."
git push origin "$BRANCH"

echo ""
echo "✅  Successfully pushed $FOLDER to $REPO_URL"
echo ""
rm -rf "$TMPDIR"
