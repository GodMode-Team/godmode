#!/usr/bin/env python3
"""
GodMode Cleaner - Autonomous maintenance for GodMode
"Clean My Mac, but for GodMode"

Deduplicates files, archives old content, removes cruft, keeps system lean.
"""

import os
import json
import shutil
import hashlib
import argparse
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict

# Paths
GODMODE_ROOT = Path(__file__).resolve().parents[2]
ARCHIVE_DIR = GODMODE_ROOT / "memory/archive"
MAINTENANCE_DIR = GODMODE_ROOT / "memory/maintenance"
CONFIG_FILE = GODMODE_ROOT / "skills/godmode-cleaner/config.json"

# Ensure dirs exist
ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
MAINTENANCE_DIR.mkdir(parents=True, exist_ok=True)

# Load config
DEFAULT_CONFIG = {
    "archive_after_days": 30,
    "archive_location": "memory/archive",
    "safe_to_delete_patterns": [
        "*.bak",
        "*.old",
        "*.tmp",
        "*.deprecated",
        "*_old.*",
        "*_backup.*"
    ],
    "protected_files": [
        "memory/logs/actions.jsonl",
        "memory/state/*.json",
        ".env",
        "private/.env"
    ],
    "max_log_size_mb": 100
}

def load_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE) as f:
            return json.load(f)
    return DEFAULT_CONFIG

CONFIG = load_config()


class CleanupReport:
    """Track what was cleaned and report statistics"""

    def __init__(self):
        self.deduped_count = 0
        self.deduped_size = 0
        self.archived_count = 0
        self.archived_size = 0
        self.deleted_count = 0
        self.deleted_size = 0
        self.empty_dirs_removed = 0
        self.operations = []

    def add_dedup(self, filepath, size):
        self.deduped_count += 1
        self.deduped_size += size
        self.operations.append({
            "type": "dedup",
            "file": str(filepath),
            "size": size,
            "timestamp": datetime.now().isoformat()
        })

    def add_archive(self, filepath, archive_path, size):
        self.archived_count += 1
        self.archived_size += size
        self.operations.append({
            "type": "archive",
            "source": str(filepath),
            "destination": str(archive_path),
            "size": size,
            "timestamp": datetime.now().isoformat()
        })

    def add_delete(self, filepath, size):
        self.deleted_count += 1
        self.deleted_size += size
        self.operations.append({
            "type": "delete",
            "file": str(filepath),
            "size": size,
            "timestamp": datetime.now().isoformat()
        })

    def add_empty_dir(self, dirpath):
        self.empty_dirs_removed += 1
        self.operations.append({
            "type": "empty_dir",
            "path": str(dirpath),
            "timestamp": datetime.now().isoformat()
        })

    def total_saved(self):
        return self.deduped_size + self.archived_size + self.deleted_size

    def save(self):
        """Save report to maintenance log"""
        report_file = MAINTENANCE_DIR / f"cleanup-{datetime.now().strftime('%Y-%m-%d-%H%M%S')}.json"

        report = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "deduped": {"count": self.deduped_count, "size_mb": self.deduped_size / (1024*1024)},
                "archived": {"count": self.archived_count, "size_mb": self.archived_size / (1024*1024)},
                "deleted": {"count": self.deleted_count, "size_mb": self.deleted_size / (1024*1024)},
                "empty_dirs": self.empty_dirs_removed,
                "total_saved_mb": self.total_saved() / (1024*1024)
            },
            "operations": self.operations
        }

        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

        # Also append to history log
        history_file = MAINTENANCE_DIR / "cleanup-history.jsonl"
        with open(history_file, 'a') as f:
            f.write(json.dumps(report) + '\n')

        return report_file

    def print_summary(self):
        """Print human-readable summary"""
        print("\n" + "=" * 60)
        print("✅ Cleanup complete!")
        print(f"   Total space saved: {self.total_saved() / (1024*1024):.1f} MB")
        print(f"   Files deduped: {self.deduped_count}")
        print(f"   Files archived: {self.archived_count}")
        print(f"   Files deleted: {self.deleted_count}")
        print(f"   Empty dirs removed: {self.empty_dirs_removed}")
        print()


def get_file_hash(filepath):
    """Get MD5 hash of file content"""
    try:
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None


def deduplicate_bookmarks(dry_run=False):
    """Remove duplicate bookmark notes across all brains"""
    print("\n📋 Deduplication Check")

    # Paths to check
    godmode = GODMODE_ROOT / "knowledge/product"
    personal = Path.home() / "Library/Mobile Documents/iCloud~md~obsidian/Documents/04-Resources/X-Bookmarks"
    workspaces_dir = Path.home() / ".godmode/workspaces"

    # Find all markdown files and hash them
    hashes = defaultdict(list)

    # Build search paths: core dirs + all client workspaces
    search_paths = [(godmode, "godmode"), (personal, "personal")]
    if workspaces_dir.exists():
        for ws in workspaces_dir.iterdir():
            knowledge = ws / "knowledge"
            if knowledge.exists():
                search_paths.append((knowledge, f"workspace:{ws.name}"))

    for base_path, name in search_paths:
        if not base_path.exists():
            continue
        for md_file in base_path.rglob("*.md"):
            file_hash = get_file_hash(md_file)
            if file_hash:
                hashes[file_hash].append((name, md_file))

    # Find duplicates
    duplicates = {h: files for h, files in hashes.items() if len(files) > 1}

    if not duplicates:
        print("   ✅ No duplicates found")
        return []

    print(f"   Found {len(duplicates)} duplicate groups")

    removed = []
    total_size = 0

    for file_hash, files in duplicates.items():
        # Keep priority: personal > godmode > first workspace
        brains = {brain: path for brain, path in files}

        if "personal" in brains:
            keep = ("personal", brains["personal"])
        elif "godmode" in brains:
            keep = ("godmode", brains["godmode"])
        else:
            # Keep first workspace copy found
            keep = files[0]

        # Remove all others
        for brain, filepath in files:
            if (brain, filepath) == keep:
                continue

            size = filepath.stat().st_size
            total_size += size

            if not dry_run:
                filepath.unlink()

            removed.append((filepath, size))

    print(f"   Removed {len(removed)} duplicate files")
    print(f"   Space saved: {total_size / (1024*1024):.1f} MB")

    return removed


def archive_old_files(archive_after_days=30, dry_run=False):
    """Archive old log and session files"""
    print(f"\n📦 Archive Old Files (>{archive_after_days} days)")

    cutoff = datetime.now() - timedelta(days=archive_after_days)
    archived = []
    total_size = 0

    # Archive old logs (except actions.jsonl)
    logs_dir = GODMODE_ROOT / "memory/logs"
    if logs_dir.exists():
        for log_file in logs_dir.glob("*.log"):
            mtime = datetime.fromtimestamp(log_file.stat().st_mtime)
            if mtime < cutoff:
                size = log_file.stat().st_size
                archive_path = ARCHIVE_DIR / "logs" / log_file.name

                if not dry_run:
                    archive_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(log_file), str(archive_path))

                archived.append((log_file, archive_path, size))
                total_size += size

        for log_file in logs_dir.glob("*.jsonl"):
            if log_file.name == "actions.jsonl":
                continue  # Never archive permanent action log

            mtime = datetime.fromtimestamp(log_file.stat().st_mtime)
            if mtime < cutoff:
                size = log_file.stat().st_size
                archive_path = ARCHIVE_DIR / "logs" / log_file.name

                if not dry_run:
                    archive_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(log_file), str(archive_path))

                archived.append((log_file, archive_path, size))
                total_size += size

    # Archive old session files
    sessions_dir = GODMODE_ROOT / "memory/sessions"
    if sessions_dir.exists():
        for session_file in sessions_dir.glob("*.md"):
            # Skip special files
            if "agent-" in session_file.name or "mandatory" in session_file.name:
                continue

            mtime = datetime.fromtimestamp(session_file.stat().st_mtime)
            if mtime < cutoff:
                size = session_file.stat().st_size
                archive_path = ARCHIVE_DIR / "sessions" / session_file.name

                if not dry_run:
                    archive_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(session_file), str(archive_path))

                archived.append((session_file, archive_path, size))
                total_size += size

    print(f"   Archived {len(archived)} files")
    print(f"   Space saved: {total_size / (1024*1024):.1f} MB")

    return archived


def delete_deprecated_files(dry_run=False):
    """Delete deprecated/backup files"""
    print("\n🗑️  Delete Deprecated Files")

    patterns = CONFIG["safe_to_delete_patterns"]
    deleted = []
    total_size = 0

    for pattern in patterns:
        for filepath in GODMODE_ROOT.rglob(pattern):
            # Skip files in .git or node_modules
            if ".git" in str(filepath) or "node_modules" in str(filepath):
                continue

            if filepath.is_file():
                size = filepath.stat().st_size

                if not dry_run:
                    filepath.unlink()

                deleted.append((filepath, size))
                total_size += size

    print(f"   Deleted {len(deleted)} deprecated files")
    print(f"   Space saved: {total_size / (1024*1024):.1f} MB")

    return deleted


def clean_empty_directories(dry_run=False):
    """Remove empty directories"""
    print("\n📁 Clean Empty Directories")

    empty_dirs = []

    for dirpath, dirnames, filenames in os.walk(GODMODE_ROOT, topdown=False):
        # Skip hidden dirs and git
        if "/.git" in dirpath or "/__pycache__" in dirpath or "/node_modules" in dirpath:
            continue

        dir_path = Path(dirpath)

        # Check if truly empty (no files, no .gitkeep, no subdirs with content)
        try:
            items = list(dir_path.iterdir())
            if not items or (len(items) == 1 and items[0].name == ".gitkeep"):
                if not dry_run:
                    shutil.rmtree(dir_path)
                empty_dirs.append(dir_path)
        except:
            continue

    print(f"   Removed {len(empty_dirs)} empty directories")

    return empty_dirs


def confirm_action(message):
    """Ask user to confirm before proceeding"""
    response = input(f"\n{message} (yes/no): ").strip().lower()
    return response in ['yes', 'y']


def main():
    parser = argparse.ArgumentParser(description="GodMode Cleaner - Keep your system lean")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be cleaned, don't actually delete")
    parser.add_argument("--safe", action="store_true", help="Safe mode: ONLY deduplicate (for automation)")
    parser.add_argument("--aggressive", action="store_true", help="Skip confirmations, auto-clean everything")
    parser.add_argument("--archive-after", type=int, default=30, help="Days before archiving (default: 30)")

    args = parser.parse_args()

    print("🧹 GodMode Cleaner - Starting cleanup...")
    print("=" * 60)

    if args.dry_run:
        print("🔍 DRY RUN MODE - No files will be modified\n")
    elif args.safe:
        print("✅ SAFE MODE - Only deduplication (zero risk)\n")
    elif args.aggressive:
        print("⚡ AGGRESSIVE MODE - Auto-cleaning without prompts\n")

    report = CleanupReport()

    # 1. Deduplicate bookmarks (ALWAYS SAFE - exact copies only)
    deduped = deduplicate_bookmarks(dry_run=args.dry_run)
    for filepath, size in deduped:
        report.add_dedup(filepath, size)

    # Safe mode stops here (automation-safe)
    if args.safe:
        report.print_summary()
        if not args.dry_run:
            report.save()
        return

    # 2. Archive old files (REQUIRES CONFIRMATION unless aggressive)
    if args.dry_run or args.aggressive or confirm_action("📦 Archive old files (>30 days)?"):
        archived = archive_old_files(archive_after_days=args.archive_after, dry_run=args.dry_run)
        for source, dest, size in archived:
            report.add_archive(source, dest, size)
    else:
        print("   ⏭️  Skipping archive step")

    # 3. Delete deprecated files (REQUIRES CONFIRMATION unless aggressive)
    if args.dry_run or args.aggressive or confirm_action("🗑️  Delete deprecated files (.bak, .old, etc.)?"):
        deleted = delete_deprecated_files(dry_run=args.dry_run)
        for filepath, size in deleted:
            report.add_delete(filepath, size)
    else:
        print("   ⏭️  Skipping delete step")

    # 4. Clean empty directories (REQUIRES CONFIRMATION unless aggressive)
    if args.dry_run or args.aggressive or confirm_action("📁 Remove empty directories?"):
        empty_dirs = clean_empty_directories(dry_run=args.dry_run)
        for dirpath in empty_dirs:
            report.add_empty_dir(dirpath)
    else:
        print("   ⏭️  Skipping empty dir cleanup")

    # Print summary
    report.print_summary()

    if not args.dry_run:
        report_file = report.save()
        print(f"📊 Detailed report: {report_file.relative_to(GODMODE_ROOT)}")
    else:
        print("💡 Run without --dry-run to actually perform cleanup")

    print()


if __name__ == "__main__":
    main()
