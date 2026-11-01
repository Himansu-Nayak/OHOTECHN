# Matt Pocock Skills Upgrade & Maintenance Guide

**Target Environment**: OHO TECH (`C:\Users\himan\OneDrive\Desktop\oho_tech`)  
**Upstream Repository**: `https://github.com/mattpocock/skills.git`  
**Local Mirror**: `.agents/upstream/mattpocock-skills/`  
**Installed Target**: `.agents/skills/`  
**Manifest**: `.agents/skills/.antigravity-install-manifest.json`  

---

## 1. Upgrade Architecture

The skills are installed into `.agents/skills/` from a local cloned upstream mirror at `.agents/upstream/mattpocock-skills/`. This isolates upstream updates from active engineering, allows inspecting `git diff` before applying changes, and ensures existing customizations in `docs/agents/` are never overwritten.

---

## 2. Standard Upgrade Procedure

Follow these step-by-step instructions whenever checking for or applying updates from Matt Pocock's upstream repository:

### Step 1: Fetch and Inspect Upstream Changes
Run in PowerShell from the OHO TECH root directory:

```powershell
# Navigate to the upstream mirror
cd .agents/upstream/mattpocock-skills

# Fetch latest commits from upstream
git fetch origin main

# Inspect incoming commit logs
git log HEAD..origin/main --oneline

# Inspect incoming diffs across skills
git diff HEAD..origin/main --stat
```

### Step 2: Merge Upstream to Mirror
If the incoming changes are verified and safe to adopt:

```powershell
# Merge changes into local mirror branch
git merge origin/main --ff-only

# Capture new commit SHA
git rev-parse HEAD
cd ../../..
```

### Step 3: Synchronize Skills to Antigravity Directory
Copy modified skills from `.agents/upstream/mattpocock-skills/skills/` into `.agents/skills/`:

```powershell
$sourceDir = ".agents/upstream/mattpocock-skills/skills"
$targetDir = ".agents/skills"

Get-ChildItem -Directory $sourceDir | ForEach-Object {
    $skillName = $_.Name
    $dest = Join-Path $targetDir $skillName
    Copy-Item -Path $_.FullName -Destination $targetDir -Recurse -Force
}
```

### Step 4: Regenerate Installation Manifest
Update `.agents/skills/.antigravity-install-manifest.json` with the new timestamp and file checksums:

```powershell
$skills = Get-ChildItem -Directory ".agents/skills" | Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") }
$manifest = @{
    version = "1.0.0"
    last_updated = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
    upstream_repository = "https://github.com/mattpocock/skills.git"
    upstream_commit = (git -C ".agents/upstream/mattpocock-skills" rev-parse HEAD)
    total_skills = $skills.Count
    skills = ($skills | ForEach-Object { $_.Name })
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content ".agents/skills/.antigravity-install-manifest.json"
```

### Step 5: Verify Antigravity Discovery
Verify that key skills (`grill-with-docs`, `improve-codebase-architecture`, `tdd`, `code-review`, `setup-matt-pocock-skills`) have intact `SKILL.md` frontmatter and valid paths.

---

## 3. Rollback Procedure

If an upstream update introduces breaking changes or unwanted behavior:

1. Reset the upstream mirror to the previous known good commit:
   ```powershell
   cd .agents/upstream/mattpocock-skills
   git checkout <previous-commit-sha>
   cd ../../..
   ```
2. Re-copy the skills from the checkout:
   ```powershell
   Copy-Item -Path ".agents/upstream/mattpocock-skills/skills/*" -Destination ".agents/skills/" -Recurse -Force
   ```
3. Verify that `AGENTS.md` and `docs/agents/` remain unchanged.
