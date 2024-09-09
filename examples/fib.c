/*
  Print the first 20 numbers of the Fibonacci sequence
*/

#include <stdio.h>

int fib(int n) {
  if (n < 2) {
    return n;
  } else {
    return fib(n - 1) + fib(n - 2);
  }
}

void main() {
  int n;
  int i = 0;
  while (i < 20) {
    n = fib(i);
    printf("fib(%d) = %d\n", i, n);
    i += 1;
  }
}
