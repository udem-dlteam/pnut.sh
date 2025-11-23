#! /bin/bash

set -e -u

PNUT_OPTIONS="-Dsh -DNICE_UX -DNO_COLOR -DSAFE_MODE" # shell backend in release mode
PNUT_OPTIONS_COMPACT="$PNUT_OPTIONS -DRT_COMPACT" # More compact but slower runtime. Makes for nicer scripts

readonly cur_dir=$(pwd)

in_pnut_dir() { # $1 = command
  cd ../pnut # Go to pnut directory to run the command
  $1
  cd "$cur_dir"  # Go back to the original directory
}

compile_with_options() { # $1: name, $2: options
  name="$1"
  opt="$2"
  emcc ../pnut/pnut-lib.c \
    -O2 \
    -o $name.js \
    $opt \
    -s EXPORTED_FUNCTIONS="['_compile']" \
    -s MODULARIZE \
    -s EXPORT_NAME="create_${name}_module" \
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
  // PNUT_OPTIONS = '$opt';
  " | cat - $name.js > temp && mv temp $name.js
}

compile_with_options "pnut_standard" "$PNUT_OPTIONS"
compile_with_options "pnut_compact" "$PNUT_OPTIONS_COMPACT"
