#!/bin/bash
# Run this once to clear stale git locks and push the pending blog posts.
cd "/Users/adeedaxguy/Downloads/tools website 2/Tools website 2"

echo "Removing stale git lock files..."
find .git -name "*.lock" -delete

echo "Staging and committing blog posts..."
git add src/content/blog/late-payment-email-freelance.mdx
git add src/content/blog/freelance-project-cost-estimate.mdx
git commit -m "blog: morning posts 2026-06-02 and 2026-06-03"

echo "Pushing to origin/main..."
git push origin main

echo "Done!"
