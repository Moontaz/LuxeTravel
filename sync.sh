#!/bin/bash
set -e

# Fungsi untuk sync folder ke repo remote
sync_folder() {
  FOLDER=$1
  REMOTE=$2
  BRANCH=$3

  echo "🔄 Syncing $FOLDER -> $REMOTE ($BRANCH)"

  # Buat branch split khusus
  git subtree split --prefix=$FOLDER --rejoin -b ${FOLDER}-branch

  # Push ke remote
  git push -f $REMOTE ${FOLDER}-branch:$BRANCH

  # Hapus branch sementara biar ga numpuk
  git branch -D ${FOLDER}-branch

  echo "✅ Done syncing $FOLDER"
}

# Pilihan
case "$1" in
  client)
    sync_folder "client" "client-remote" "main"
    ;;
  server1)
    sync_folder "Server1" "server1-remote" "main"
    ;;
  server2)
    sync_folder "Server2" "server2-remote" "main"
    ;;
  all)
    sync_folder "client"  "client-remote"  "main"
    sync_folder "Server1" "server1-remote" "main"
    sync_folder "Server2" "server2-remote" "main"
    ;;
  *)
    echo "Usage: ./sync.sh [client|server1|server2|all]"
    exit 1
    ;;
esac
