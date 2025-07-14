
for dir in packages/*; do
  if [ -d "$dir/.git" ]; then
    changes=$(git -C "$dir" status -s)
    if [ -n "$changes" ]; then
      printf "\e[1;33m=== %s ===\e[0m\n" "$dir"   # bold yellow header
      echo "$changes"
      echo
    fi
  fi
done