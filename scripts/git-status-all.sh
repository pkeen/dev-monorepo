#!/usr/bin/env bash
for dir in packages/*; do
  if [ -d "$dir/.git" ]; then
    changes=$(git -C "$dir" status -s)
    if [ -n "$changes" ]; then
      echo "=== $dir ==="
      echo "$changes"
      echo               # blank line for readability
    fi
  fi
done

