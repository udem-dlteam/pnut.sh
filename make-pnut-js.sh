#! /bin/bash

emcc ../pnut/pnut.c \
  -o pnut.js \
  -Dsh -DSUPPORT_INCLUDE -DRT_NO_INIT_GLOBALS -DEMSCRIPTEN -DRT_COMPACT \
  -s EXPORTED_FUNCTIONS="['_compile']" \
  -s MODULARIZE \
  -s EXPORT_NAME="create_module" \
  -s EXPORTED_RUNTIME_METHODS="['FS', 'cwrap', 'ExitStatus']" \
  -s EXIT_RUNTIME=1 \
  # --preload-file examples/ \
