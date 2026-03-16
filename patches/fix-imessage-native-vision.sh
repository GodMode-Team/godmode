#!/bin/bash
# Patches OC core to allow iMessage attachment paths in the native vision image loader.
#
# Problem: When a model supports native vision (input: ["text", "image"]), OC skips
# Media Understanding and uses detectAndLoadPromptImages instead. This function calls
# loadWebMedia → assertLocalMediaAllowed with getDefaultMediaLocalRoots(), which only
# includes ~/.openclaw/{media,agents,workspace,sandboxes}. iMessage attachments live
# in ~/Library/Messages/Attachments/ — not in the allowed list — so image loading fails
# with "Local media path is not under an allowed directory".
#
# Fix: Extend getDefaultMediaLocalRoots() to include the iMessage Attachments directory.
# The Media Understanding pipeline already does this via resolveMediaAttachmentLocalRoots(),
# but the native vision path doesn't call that function.
#
# This patch should be removed once OC core properly threads localRoots through the
# native vision image loader pipeline (detectAndLoadPromptImages → loadImageFromRef → loadWebMedia).

set -euo pipefail

OC_DIST="node_modules/openclaw/dist"

# Find the active local-roots file (imported by ir-B9Vab0HN.js)
for roots_file in "$OC_DIST"/local-roots-*.js; do
  if grep -q 'function getDefaultMediaLocalRoots' "$roots_file"; then
    # Check if already patched
    if grep -q 'iMessage attachment roots' "$roots_file"; then
      echo "[patch] $roots_file already patched, skipping"
      continue
    fi

    # Replace the simple function with one that includes iMessage roots
    sed -i '' 's/function getDefaultMediaLocalRoots() {/function getDefaultMediaLocalRoots() { \/\/ patched for iMessage/g' "$roots_file"
    sed -i '' '/function getDefaultMediaLocalRoots.*patched/,/^}/ {
      /^}/i\
	\/\/ Patch: include iMessage attachment roots for native vision image loading\
	const home = process.env.HOME || process.env.USERPROFILE || "";\
	if (home) { const imsgRoot = path.join(home, "Library\/Messages\/Attachments"); if (!roots.includes(imsgRoot)) roots.push(imsgRoot); }
    }' "$roots_file"

    # Also need to change "return buildMediaLocalRoots" to capture into variable
    sed -i '' 's/return buildMediaLocalRoots(resolveStateDir());/const roots = buildMediaLocalRoots(resolveStateDir()); return roots;/g' "$roots_file"

    echo "[patch] Patched $roots_file with iMessage attachment roots"
  fi
done

echo "[patch] Done. iMessage images should now load via native vision."
