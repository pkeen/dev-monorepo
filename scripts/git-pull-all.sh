for dir in packages/*; do
  [ -d "$dir/.git" ] && echo "Updating $dir" && git -C "$dir" pull --ff-only
done