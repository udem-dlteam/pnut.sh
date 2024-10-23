# pnut.sh

Source for the <https://pnut.sh> website.

For the web editor, pnut is compiled to WebAssembly using Emscripten.

## Development

To serve the site locally and have the web editor working, use
`python3 -m http.server 3333`. The website will then be accessible via
http://localhost:3333/.

## Updating pnut

To regenerate the WebAssembly module, use the `./make-pnut-js.sh` script. It
assumes the following project structure, with the pnut directory beside
the pnut.sh directory:

```
- ../pnut.sh/ # <- current dir
- ../pnut/    # <- pnut dir
```
