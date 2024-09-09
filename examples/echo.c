/*
  Reads from stdin and writes to stdout.
*/

void main() {
  char c;
  while ((c = getchar()) != -1) {
    putchar(c);
  }
}
