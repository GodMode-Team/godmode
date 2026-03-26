# GodMode Cleaner Skill

**"Clean My Mac, but for GodMode"**

Autonomous maintenance skill that keeps GodMode lean, fast, and organized by removing duplicates, archiving old files, and cleaning up cruft.

## What It Does

1. **Deduplicates** bookmark notes across all three brains (GodMode/Personal/PA)
2. **Archives** old logs and session files (>30 days by default)
3. **Removes** obsolete/deprecated files (.bak, .old, .tmp, etc.)
4. **Cleans** empty directories
5. **Reports** space saved and what was cleaned

## Usage

```bash
# Safe mode - ONLY dedup (zero risk, automation-ready)
python3 skills/godmode-cleaner/clean.py --safe

# Dry run (show what would be cleaned, don't actually delete)
python3 skills/godmode-cleaner/clean.py --dry-run

# Interactive mode (asks before each step)
python3 skills/godmode-cleaner/clean.py

# Aggressive mode (auto-clean everything, no prompts - USE WITH CAUTION)
python3 skills/godmode-cleaner/clean.py --aggressive

# Custom age threshold for archiving
python3 skills/godmode-cleaner/clean.py --archive-after 60  # 60 days instead of 30
```

**For automation:** ONLY use `--safe` mode. This only deduplicates (removes exact copies) with zero risk of data loss.

## Configuration

Edit `skills/godmode-cleaner/config.json`:

```json
{
  "archive_after_days": 30,
  "archive_location": "memory/archive",
  "safe_to_delete_patterns": ["*.bak", "*.old", "*.tmp", "*.deprecated", "*_old.*", "*_backup.*"],
  "protected_files": ["memory/logs/actions.jsonl", "memory/state/*.json", ".env"],
  "max_log_size_mb": 100
}
```

## What Gets Cleaned

### Always Safe (Auto-cleaned)

- Duplicate bookmark notes (keeps best copy)
- Deprecated file patterns (_.bak, _.old, \*.tmp)
- Empty directories (no content, no .gitkeep)
- Webpack cache files (_.pack.old, _.gz.old)

### Archived (>30 days old by default)

- Log files in `memory/logs/` (except actions.jsonl)
- Session files in `memory/sessions/`
- Temp files in `/tmp/daily-brief-*` (keeps last 7 days)

### Protected (Never Touched)

- `.env` and credentials
- `memory/state/*.json` (system state)
- `memory/logs/actions.jsonl` (permanent audit trail)
- Files modified in last 7 days
- Git-tracked files currently in use

## Output

```
🧹 GodMode Cleaner - Starting cleanup...
============================================================

📋 Deduplication Check
   Found 314 duplicate bookmark notes
   Kept 304 unique files (Personal > GodMode > PA)
   Space saved: 1.2 MB

📦 Archive Old Files (>30 days)
   15 log files → memory/archive/logs/
   8 session files → memory/archive/sessions/
   Space saved: 45 MB

🗑️  Delete Deprecated Files
   12 .bak files
   5 .old webpack caches
   Space saved: 220 MB

📁 Clean Empty Directories
   Removed 8 empty dirs

============================================================
✅ Cleanup complete!
   Total space saved: 266.2 MB
   Files archived: 23
   Files deleted: 17

📊 Detailed report: memory/maintenance/cleanup-2026-01-23.json
```

## Automation

**✅ Already integrated into self-healing!**

The `--safe` mode (dedup only) runs automatically as part of the daily self-healing routine (Phase 3: Auto-Fixes).

- Frequency: Daily at 7pm CT
- Mode: `--safe` (deduplication only, zero risk)
- Reports: Results appear in self-healing Slack alerts

**For manual full cleanup:**

```bash
# Preview what would be cleaned
python3 skills/godmode-cleaner/clean.py --dry-run

# Interactive mode (asks permission)
python3 skills/godmode-cleaner/clean.py
```

**Never automate:**

- `--aggressive` mode (deletes files without confirmation)
- Archive/delete operations (always manual review)

## Safety Features

- **Dry run mode** - Preview before cleaning
- **Archive before delete** - Old files go to `memory/archive/` first
- **Protected files** - Never touches critical system files
- **Undo log** - All operations logged to `memory/maintenance/cleanup-history.jsonl`
- **Size threshold** - Won't auto-delete files >10MB without confirmation

## Undo Last Cleanup

```bash
# Restore files from last cleanup
python3 skills/godmode-cleaner/clean.py --undo
```

## When to Run

- **Daily (automated)**: `--safe` mode only (dedup, zero risk)
- **Weekly (manual)**: Interactive cleanup (you confirm each step)
- **Monthly (manual)**: Full cleanup with `--dry-run` first, then without
- **On-demand**: When disk space is low or system feels sluggish

**Golden Rule:** Never automate anything that archives or deletes files. Always review first.

---

**Philosophy:** GodMode should only store active, useful data. Everything else gets archived or deleted. This keeps the system fast, focused, and easy to navigate.
