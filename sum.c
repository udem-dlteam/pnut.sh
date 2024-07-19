int sum(int* a, int len) {
  int i, sum = 0;
  for (i = 0; i < len; i += 1) {
      sum += a[i];
  }
  return sum;
}
