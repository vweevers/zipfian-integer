package com.mycompany.zipf;

import org.apache.commons.math3.distribution.ZipfDistribution;
import org.apache.commons.math3.random.AbstractRandomGenerator;
import java.util.Locale;
import java.util.ArrayDeque;
import com.google.gson.Gson;

public class App {
  private static Gson gson = new Gson();

  public static void main(String[] args) {
    CollectRandom random = new CollectRandom();
    int tests = 0;

    for (int n = 1; n <= 16777216; n *= 2) {
      for (int i = 0; i <= 100000; i++) {
        final double s = Math.random();
        ZipfDistribution zipf = new ZipfDistribution(random, n, s);
        final int k = zipf.sample();
        Double[] p = random.Collect();

        String json = gson.toJson(new Result(n, s, p, k));
        System.out.println(json);

        if (tests % 10000 == 0) {
          System.err.format("Progress: %7d tests, current N: %d%n", tests, n);
        }

        tests++;
      }
    }

    System.err.format("Progress: %7d tests, done.%n", tests);
  }

  static final class Result {
    public int n;
    public double s;
    public Double[] p;
    public int k;

    public Result (final int n, final double s, final Double[] p, int k) {
      this.n = n;
      this.s = s;
      this.p = p;
      this.k = k;
    }
  }

  static final class CollectRandom extends AbstractRandomGenerator {
    private ArrayDeque<Double> stack = new ArrayDeque<Double>(0);

    public Double[] Collect () {
      Double[] state = stack.toArray(new Double[stack.size()]);
      stack.clear();
      return state;
    }

    @Override
    public double nextDouble () {
      final double p = Math.random();
      stack.add(p);
      return p;
    }

    @Override
    public void setSeed (long ignored) {}
  }
}
