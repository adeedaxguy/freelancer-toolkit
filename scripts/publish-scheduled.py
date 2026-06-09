#!/usr/bin/env python3
"""
publish-scheduled.py
Auto-publishes FreelancerToolkit blog posts whose publishDate has arrived.
Reads from GitHub, flips status: scheduled → published, writes back via API.
No dev server required.
"""

import os
import json
import base64
import urllib.request
import urllib.error
import re
from datetime import datetime, timezone

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    print("Error: GITHUB_TOKEN environment variable is not set. Generate a token at https://github.com/settings/tokens and set it with: export GITHUB_TOKEN=your_token")
    exit(1)
GITHUB_REPO  = os.environ.get("GITHUB_REPO",  "adeedaxguy/freelancer-toolkit")
GITHUB_BRANCH = os.environ.get("GITHUB_BRANCH", "main")
BLOG_PATH    = "src/content/blog"

API_BASE = f"https://api.github.com/repos/{GITHUB_REPO}"
HEADERS  = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
}


def gh_get(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def gh_put(url: str, payload: dict):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="PUT")
    try:
        with urllib.request.urlopen(req) as r:
            return r.status in (200, 201)
    except urllib.error.HTTPError as e:
        print(f"  PUT failed {e.code}: {e.read().decode()}")
        return False


def get_raw(download_url: str) -> str:
    req = urllib.request.Request(download_url)
    with urllib.request.urlopen(req) as r:
        return r.read().decode("utf-8")


def parse_frontmatter(raw: str):
    """Return (data_dict, body_str). Minimal YAML parser for simple key: value pairs."""
    if not raw.startswith("---"):
        return {}, raw
    end = raw.index("---", 3)
    yaml_block = raw[3:end].strip()
    body = raw[end + 3:].lstrip("\n")
    data = {}
    for line in yaml_block.splitlines():
        m = re.match(r'^(\w[\w-]*):\s*(.*)', line)
        if m:
            key, val = m.group(1), m.group(2).strip().strip("'\"")
            data[key] = val
    return data, body


def set_status_published(raw: str) -> str:
    """Replace status: scheduled with status: published in frontmatter."""
    return re.sub(
        r'(^|\n)(status:\s*scheduled)',
        r'\1status: published',
        raw,
        flags=re.IGNORECASE
    )


def main():
    now = datetime.now(timezone.utc)
    print(f"Checking for scheduled posts (now = {now.isoformat()})")

    url = f"{API_BASE}/contents/{BLOG_PATH}?ref={GITHUB_BRANCH}"
    try:
        files = gh_get(url)
    except Exception as e:
        print(f"Failed to list repo files: {e}")
        return

    mdx_files = [f for f in files if isinstance(f, dict) and f.get("name", "").endswith(".mdx")]
    print(f"Found {len(mdx_files)} .mdx files")

    published = []

    for f in mdx_files:
        raw = get_raw(f["download_url"])
        data, _ = parse_frontmatter(raw)

        if data.get("status", "").lower() != "scheduled":
            continue

        pub_date_str = data.get("publishDate") or data.get("publish_date", "")
        if not pub_date_str:
            continue

        try:
            pub_date = datetime.fromisoformat(pub_date_str.replace("Z", "+00:00"))
            if pub_date.tzinfo is None:
                pub_date = pub_date.replace(tzinfo=timezone.utc)
        except ValueError:
            print(f"  Skipping {f['name']}: unparseable date '{pub_date_str}'")
            continue

        if pub_date > now:
            print(f"  {f['name']}: scheduled for {pub_date_str} — not yet")
            continue

        print(f"  {f['name']}: due ({pub_date_str}) — publishing…")
        updated_raw = set_status_published(raw)
        slug = f["name"].replace(".mdx", "")

        ok = gh_put(
            f"{API_BASE}/contents/{BLOG_PATH}/{f['name']}",
            {
                "message": f"Auto-publish: {slug}",
                "content": base64.b64encode(updated_raw.encode()).decode(),
                "sha": f["sha"],
                "branch": GITHUB_BRANCH,
            }
        )
        if ok:
            published.append(slug)
            print(f"  ✓ Published: {slug}")
        else:
            print(f"  ✗ Failed to publish: {slug}")

    if published:
        print(f"\nDone — published {len(published)} post(s): {', '.join(published)}")
    else:
        print("\nNo scheduled posts ready — nothing to do")


if __name__ == "__main__":
    main()
