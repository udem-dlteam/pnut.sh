#! /bin/bash

PNUT_OPTIONS=""
PNUT_OPTIONS="$PNUT_OPTIONS -Dsh" # shell backend
PNUT_OPTIONS="$PNUT_OPTIONS -DRT_NO_INIT_GLOBALS" # faster script startups
PNUT_OPTIONS="$PNUT_OPTIONS -DRT_COMPACT" # More compact but slower runtime. Makes for nicer scripts
PNUT_OPTIONS="$PNUT_OPTIONS -DNICE_ERR_MSG" # Show token information on unexpected token error
PNUT_OPTIONS="$PNUT_OPTIONS -DINCLUDE_LINE_NUMBER_ON_ERROR" # Show line/column number on syntax errors


emcc ../pnut/pnut-lib.c \
  -O2 \
  -o pnut.js \
  $PNUT_OPTIONS \
  -s EXPORTED_FUNCTIONS="['_compile']" \
  -s MODULARIZE \
  -s EXPORT_NAME="create_module" \
  -s EXPORTED_RUNTIME_METHODS="['FS', 'cwrap', 'ExitStatus']" \
  -s EXIT_RUNTIME=1
