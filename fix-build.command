#!/bin/bash
cd "/Users/adeedaxguy/Downloads/tools website 2/Tools website 2"
rm -f .git/index.lock .git/HEAD.lock .git/MERGE_HEAD.lock 2>/dev/null
git add -A
git commit -m "fix: eslintrc, serverExternalPackages, remove force-dynamic conflict"
git push origin main
echo ""
echo "✅ Done! Vercel is now building. Check freeltools.com in ~2 minutes."
read -p "Press Enter to close..."
