export class MersenneTwister {

  /* Period parameters */
  private N = 624;
  private M = 397;
  private MATRIX_A = 0x9908b0df;   /* constant vector a */
  private UPPER_MASK = 0x80000000; /* most significant w-r bits */
  private LOWER_MASK = 0x7fffffff; /* least significant r bits */

  private state = new Array(this.N); /* the array for the state vector */
  private next = this.N + 1;  /* mti==N+1 means mt[N] is not initialized */

  constructor(seed?: number, state?: number[]) {
    if(!state) {
      if (seed == undefined) {
        seed = new Date().getTime();
      }
      this.init_genrand(seed);
    } else {
      let st = []
      for(let i = 0;i < 624; i++) {
        st.push(state[i]);
      }
      this.state = st;
      this.next = 624;
    }
  }

  /* initializes mt[N] with a seed */
  private init_genrand(seed: number) {
    this.state[0] = seed >>> 0;
    for (this.next = 1; this.next < this.N; this.next++) {
      seed = this.state[this.next - 1] ^ (this.state[this.next - 1] >>> 30);
      this.state[this.next] = (((((seed & 0xffff0000) >>> 16) * 1812433253) << 16) + (seed & 0x0000ffff) * 1812433253)
        + this.next;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.state[this.next] >>>= 0;
      /* for >32 bit machines */
    }
  }

  /* initialize by an array with array-length */
  /* init_key is the array for initializing keys */
  /* key_length is its length */
  /* slight change for C++, 2004/2/26 */
  init_by_array(init_key: number[], key_length: number) {
    var i, j, k;
    this.init_genrand(19650218);
    i = 1; j = 0;
    k = (this.N > key_length ? this.N : key_length);
    for (; k; k--) {
      var s = this.state[i - 1] ^ (this.state[i - 1] >>> 30)
      this.state[i] = (this.state[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
        + init_key[j] + j; /* non linear */
      this.state[i] >>>= 0; /* for WORDSIZE > 32 machines */
      i++; j++;
      if (i >= this.N) { this.state[0] = this.state[this.N - 1]; i = 1; }
      if (j >= key_length) j = 0;
    }
    for (k = this.N - 1; k; k--) {
      var s = this.state[i - 1] ^ (this.state[i - 1] >>> 30);
      this.state[i] = (this.state[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
        - i; /* non linear */
      this.state[i] >>>= 0; /* for WORDSIZE > 32 machines */
      i++;
      if (i >= this.N) { this.state[0] = this.state[this.N - 1]; i = 1; }
    }

    this.state[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
  }

  /* generates a random number on [0,0xffffffff]-interval */
  genrand_int32() {
    var y;
    var mag01 = new Array(0x0, this.MATRIX_A);
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this.next >= this.N) { /* generate N words at one time */
      var kk;


      if (this.next == this.N + 1)   /* if init_genrand() has not been called, */
        this.init_genrand(5489); /* a default initial seed is used */

      for (kk = 0; kk < this.N - this.M; kk++) {
        y = (this.state[kk] & this.UPPER_MASK) | (this.state[kk + 1] & this.LOWER_MASK);
        this.state[kk] = this.state[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      for (; kk < this.N - 1; kk++) {
        y = (this.state[kk] & this.UPPER_MASK) | (this.state[kk + 1] & this.LOWER_MASK);
        this.state[kk] = this.state[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      y = (this.state[this.N - 1] & this.UPPER_MASK) | (this.state[0] & this.LOWER_MASK);
      this.state[this.N - 1] = this.state[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

      this.next = 0;
    }

    y = this.state[this.next++];

    /* Tempering */
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y >>> 0;
  }

  /* generates a random number on [0,0x7fffffff]-interval */
  genrand_int31() {
    return (this.genrand_int32() >>> 1);
  }

  /* generates a random number on [0,1]-real-interval */
  genrand_real1() {
    return this.genrand_int32() * (1.0 / 4294967295.0);
    /* divided by 2^32-1 */
  }

  /* generates a random number on [0,1)-real-interval */
  random() {
    return this.genrand_int32() * (1.0 / 4294967296.0);
    /* divided by 2^32 */
  }

  /* generates a random number on (0,1)-real-interval */
  genrand_real3() {
    return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
    /* divided by 2^32 */
  }

  /* generates a random number on [0,1) with 53-bit resolution*/
  genrand_res53() {
    var a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
  }

  /* These real versions are due to Isaku Wada, 2002/01/09 added */
}