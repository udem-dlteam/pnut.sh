#! /bin/bash

set -e -u

PNUT_OPTIONS="-DRELEASE_PNUT_SH"          # shell backend in release mode
PNUT_OPTIONS="$PNUT_OPTIONS -DRT_COMPACT" # More compact but slower runtime. Makes for nicer scripts

readonly cur_dir=$(pwd)

in_pnut_dir() { # $1 = command
  cd ../pnut # Go to pnut directory to run the command
  $1
  cd "$cur_dir"  # Go back to the original directory
}

emcc ../pnut/pnut-lib.c \
  -O2 \
  -o pnut.js \
  $PNUT_OPTIONS \
  -s EXPORTED_FUNCTIONS="['_compile']" \
  -s MODULARIZE \
  -s EXPORT_NAME="create_module" \
  -s EXPORTED_RUNTIME_METHODS="['FS', 'cwrap', 'ExitStatus']" \
  -s EXIT_RUNTIME=1

# Add release information to the generated pnut.js file

COMMIT_HASH=$(in_pnut_dir "git rev-parse HEAD")
# Date in DAY/MONTH/YEAR format
CUR_DATE=$(date +'%d/%m/%Y')
printf \
"\
// Date $CUR_DATE
// Pnut commit hash = '$COMMIT_HASH';
// PNUT_OPTIONS = '$PNUT_OPTIONS';
" | cat - pnut.js > temp && mv temp pnut.js
