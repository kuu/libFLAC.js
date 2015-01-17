(function (global) {

  var libFlac = global.libFLAC;

  /* Things should be fastest when this matches the machine word size */
  /* WATCHOUT: if you change this you must also change the following #defines down to SWAP_BE_WORD_TO_HOST below to match */
  /* WATCHOUT: there are a few places where the code will not work unless uint32_t is >= 32 bits wide */
  var FLAC__BYTES_PER_WORD = 4;
  var FLAC__BITS_PER_WORD = 32;
  var FLAC__WORD_ALL_ONES = 0xffffffff;

  /* SWAP_BE_WORD_TO_HOST swaps bytes in a uint32_t (which is always big-endian) if necessary to match host byte order */
  var WORDS_BIGENDIAN = false;
  var SWAP_BE_WORD_TO_HOST;
  if (WORDS_BIGENDIAN) {
    SWAP_BE_WORD_TO_HOST = function (x) {return x;};
  } else {
    SWAP_BE_WORD_TO_HOST = function (x) {
      return (((x >> 24) & 0xFF) + ((x >> 8) & 0xFF00) + ((x & 0xFF00) << 8) + ((x & 0xFF) << 24));
    };
  }

  /*
   * The default capacity here doesn't matter too much.  The buffer always grows
   * to hold whatever is written to it.  Usually the encoder will stop adding at
   * a frame or metadata block, then write that out and clear the buffer for the
   * next one.
   */
  var FLAC__BITWRITER_DEFAULT_CAPACITY = 32768;
  /* When growing, increment 4K at a time */
  var FLAC__BITWRITER_DEFAULT_INCREMENT = 4096;

  var FLAC__WORDS_TO_BITS = function (words) {
    return ((words) * FLAC__BITS_PER_WORD);
  };
  var FLAC__TOTAL_BITS = function (bw) {
    return (FLAC__WORDS_TO_BITS(bw.words) + bw.bits);
  };

  /***********************************************************************
   *
   * Class constructor/destructor
   *
   ***********************************************************************/

  function BitWriter() {
    this.buffer = null;
    this.accum = 0; /* accumulator; bits are right-justified; when full, accum is appended to buffer */
    this.capacity = 0; /* capacity of buffer in words */
    this.words = 0; /* # of complete words in buffer */
    this.bits = 0; /* # of used bits in accum */
  }

  libFLAC.BitWriter = BitWriter;

  var _proto = BitWriter.prototype;

  /* * WATCHOUT: The current implementation only grows the buffer. */
  _proto.bitwriter_grow_ = function (bits_to_add) {
    var new_capacity = 0;
    var new_buffer = null;

    //FLAC__ASSERT(this.buffer);

    /* calculate total words needed to store 'bits_to_add' additional bits */
    new_capacity = this.words + ((this.bits + bits_to_add + FLAC__BITS_PER_WORD - 1) / FLAC__BITS_PER_WORD);

    /* it's possible (due to pessimism in the growth estimation that
     * leads to this call) that we don't actually need to grow
     */
    if (this.capacity >= new_capacity) {
      return true;
    }

    /* round up capacity increase to the nearest FLAC__BITWRITER_DEFAULT_INCREMENT */
    if ((new_capacity - this.capacity) % FLAC__BITWRITER_DEFAULT_INCREMENT) {
      new_capacity += FLAC__BITWRITER_DEFAULT_INCREMENT - ((new_capacity - this.capacity) % FLAC__BITWRITER_DEFAULT_INCREMENT);
    }
    /* make sure we got everything right */
    //FLAC__ASSERT(0 === (new_capacity - this.capacity) % FLAC__BITWRITER_DEFAULT_INCREMENT);
    //FLAC__ASSERT(new_capacity > this.capacity);
    //FLAC__ASSERT(new_capacity >= this.words + ((this.bits + bits_to_add + FLAC__BITS_PER_WORD - 1) / FLAC__BITS_PER_WORD));

    new_buffer = safe_realloc_mul_2op_(this.buffer, 4, /*times*/new_capacity);
    if (new_buffer === 0) {
      return false;
    }
    this.buffer = new_buffer;
    this.capacity = new_capacity;
    return true;
  };


  _proto.FLAC__bitwriter_init = function () {

    this.words = this.bits = 0;
    this.capacity = FLAC__BITWRITER_DEFAULT_CAPACITY;
    this.buffer = malloc(4 * this.capacity);
    if (this.buffer === 0) {
      return false;
    }

    return true;
  };

  _proto.FLAC__bitwriter_free = function () {

    if (this.buffer) {
      free(this.buffer);
    }
    this.buffer = 0;
    this.capacity = 0;
    this.words = this.bits = 0;
  };

  _proto.FLAC__bitwriter_clear = function () {
    this.words = this.bits = 0;
  };

  _proto.FLAC__bitwriter_dump = function () {
    var i, j;

    console.log('bitwriter: capacity=%u words=%u bits=%u total_bits=%u\n', this.capacity, this.words, this.bits, FLAC__TOTAL_BITS(this));

    for (i = 0; i < this.words; i++) {
      console.log('%08X: ', i);
      for (j = 0; j < FLAC__BITS_PER_WORD; j++) {
        console.log('%01u', this.buffer[i] & (1 << (FLAC__BITS_PER_WORD-j-1)) ? 1:0);
      }
      console.log('\n');
    }
    if (this.bits > 0) {
      console.log('%08X: ', i);
      for (j = 0; j < this.bits; j++) {
        console.log('%01u', this.accum & (1 << (this.bits-j-1)) ? 1:0);
      }
      console.log('\n');
    }
  };

  _proto.FLAC__bitwriter_get_write_crc16 = function (ret) {
    var obj = {};

    //FLAC__ASSERT((this.bits & 7) === 0); /* assert that we're byte-aligned */

    if (!this.FLAC__bitwriter_get_buffer(obj)) {
      return false;
    }

    ret.crc = FLAC__crc16(obj.buffer, obj.bytes);
    this.FLAC__bitwriter_release_buffer();
    return true;
  };

  _proto.FLAC__bitwriter_get_write_crc8 = function (ret) {
    var obj = {};

    //FLAC__ASSERT((this.bits & 7) === 0); /* assert that we're byte-aligned */

    if (!this.FLAC__bitwriter_get_buffer(obj)) {
      return false;
    }

    ret.crc = FLAC__crc8(obj.buffer, obj.bytes);
    this.FLAC__bitwriter_release_buffer();
    return true;
  };

  _proto.FLAC__bitwriter_is_byte_aligned = function () {
    return ((this.bits & 7) === 0);
  };

  _proto.FLAC__bitwriter_get_input_bits_unconsumed = function () {
    return FLAC__TOTAL_BITS(this);
  };

  _proto.FLAC__bitwriter_get_buffer = function (ret) {
    //FLAC__ASSERT((this.bits & 7) === 0);
    /* double protection */
    if (this.bits & 7) {
      return false;
    }
    /* if we have bits in the accumulator we have to flush those to the buffer first */
    if (this.bits) {
      //FLAC__ASSERT(this.words <= this.capacity);
      if (this.words === this.capacity && !this.bitwriter_grow_(FLAC__BITS_PER_WORD)) {
        return false;
      }
      /* append bits as complete word to buffer, but don't change this.accum or this.bits */
      this.buffer[this.words] = SWAP_BE_WORD_TO_HOST(this.accum << (FLAC__BITS_PER_WORD-this.bits));
    }
    /* now we can just return what we have */
    ret.buffer = this.buffer;
    ret.bytes = (FLAC__BYTES_PER_WORD * this.words) + (this.bits >> 3);
    return true;
  };

  _proto.FLAC__bitwriter_release_buffer = function () {
    /* nothing to do.  in the future, strict checking of a 'writer-is-in-
     * get-mode' flag could be added everywhere and then cleared here
     */
  };

  _proto.FLAC__bitwriter_write_zeroes = function (bits) {
    var n = 0;

    //FLAC__ASSERT(this.buffer);

    if (bits === 0) {
      return true;
    }
    /* slightly pessimistic size check but faster than '<= this.words + (this.bits+bits+FLAC__BITS_PER_WORD-1)/FLAC__BITS_PER_WORD' */
    if (this.capacity <= this.words + bits && !this.bitwriter_grow_(bits)) {
      return false;
    }
    /* first part gets to word alignment */
    if (this.bits) {
      n = Math.min(FLAC__BITS_PER_WORD - this.bits, bits);
      this.accum <<= n;
      bits -= n;
      this.bits += n;
      if (this.bits === FLAC__BITS_PER_WORD) {
        this.buffer[this.words++] = SWAP_BE_WORD_TO_HOST(this.accum);
        this.bits = 0;
      } else {
        return true;
      }
    }
    /* do whole words */
    while (bits >= FLAC__BITS_PER_WORD) {
      this.buffer[this.words++] = 0;
      bits -= FLAC__BITS_PER_WORD;
    }
    /* do any leftovers */
    if (bits > 0) {
      this.accum = 0;
      this.bits = bits;
    }
    return true;
  };

  _proto.FLAC__bitwriter_write_raw_uint32 = function (val, bits) {
    var left = 0;

    /* WATCHOUT: code does not work with <32bit words; we can make things much faster with this assertion */
    //FLAC__ASSERT(FLAC__BITS_PER_WORD >= 32);

    //FLAC__ASSERT(this.buffer);

    //FLAC__ASSERT(bits <= 32);
    if (bits === 0) {
      return true;
    }

    /* slightly pessimistic size check but faster than '<= this.words + (this.bits+bits+FLAC__BITS_PER_WORD-1)/FLAC__BITS_PER_WORD' */
    if (this.capacity <= this.words + bits && !this.bitwriter_grow_(bits)) {
      return false;
    }

    left = FLAC__BITS_PER_WORD - this.bits;
    if (bits < left) {
      this.accum <<= bits;
      this.accum |= val;
      this.bits += bits;
    } else if (this.bits) { /* WATCHOUT: if this.bits === 0, left===FLAC__BITS_PER_WORD and this.accum<<=left is a NOP instead of setting to 0 */
      this.accum <<= left;
      this.accum |= val >> (this.bits = bits - left);
      this.buffer[this.words++] = SWAP_BE_WORD_TO_HOST(this.accum);
      this.accum = val;
    } else {
      this.accum = val;
      this.bits = 0;
      this.buffer[this.words++] = SWAP_BE_WORD_TO_HOST(val);
    }

    return true;
  };

  _proto.FLAC__bitwriter_write_raw_int32 = function (val, bits) {
    /* zero-out unused bits */
    if (bits < 32) {
      val &= (~(0xffffffff << bits));
    }

    return this.FLAC__bitwriter_write_raw_uint32(val, bits);
  };

  _proto.FLAC__bitwriter_write_raw_uint64 = function (val, bits) {
    /* this could be a little faster but it's not used for much */
    if (bits > 32) {
      return (
        this.FLAC__bitwriter_write_raw_uint32((val>>32), bits-32) &&
        this.FLAC__bitwriter_write_raw_uint32(val, 32)
      );
    } else {
      return this.FLAC__bitwriter_write_raw_uint32(val, bits);
    }
  };

  _proto.FLAC__bitwriter_write_raw_uint32_little_endian = function (val) {
    /* this doesn't need to be that fast as currently it is only used for vorbis comments */

    if (!this.FLAC__bitwriter_write_raw_uint32(val & 0xff, 8)) {
      return false;
    }

    if (!this.FLAC__bitwriter_write_raw_uint32((val>>8) & 0xff, 8)) {
      return false;
    }

    if (!this.FLAC__bitwriter_write_raw_uint32((val>>16) & 0xff, 8)) {
      return false;
    }

    if (!this.FLAC__bitwriter_write_raw_uint32(val>>24, 8)) {
      return false;
    }

    return true;
  };

  _proto.FLAC__bitwriter_write_byte_block = function (vals, nvals) {
    var i = 0;

    /* this could be faster but currently we don't need it to be since it's only used for writing metadata */
    for (i = 0; i < nvals; i++) {
      if (!this.FLAC__bitwriter_write_raw_uint32((vals[i]), 8)) {
        return false;
      }
    }

    return true;
  };

  _proto.FLAC__bitwriter_write_unary_unsigned = function (val) {
    if (val < 32) {
      return this.FLAC__bitwriter_write_raw_uint32(1, ++val);
    } else {
      return (
        this.FLAC__bitwriter_write_zeroes(val) &&
        this.FLAC__bitwriter_write_raw_uint32(1, 1)
      );
    }
  };

  _proto.FLAC__bitwriter_rice_bits = function (val, parameter) {
    var uval = 0;

    //FLAC__ASSERT(parameter < 32);

    /* fold signed to unsigned; actual formula is: negative(v)? -2v-1 : 2v */
    uval = (val<<1) ^ (val>>31);

    return 1 + parameter + (uval >> parameter);
  };

  _proto.FLAC__bitwriter_write_rice_signed = function (val, parameter) {
    var total_bits = 0, interesting_bits = 0, msbs = 0;
    var uval = 0, pattern = 0;

    //FLAC__ASSERT(this.buffer);
    //FLAC__ASSERT(parameter < 32);

    /* fold signed to unsigned; actual formula is: negative(v)? -2v-1 : 2v */
    uval = (val<<1) ^ (val>>31);

    msbs = uval >> parameter;
    interesting_bits = 1 + parameter;
    total_bits = interesting_bits + msbs;
    pattern = 1 << parameter; /* the unary end bit */
    pattern |= (uval & ((1<<parameter)-1)); /* the binary LSBs */

    if (total_bits <= 32) {
      return this.FLAC__bitwriter_write_raw_uint32(pattern, total_bits);
    } else {
      return (
        this.FLAC__bitwriter_write_zeroes(msbs) && /* write the unary MSBs */
        this.FLAC__bitwriter_write_raw_uint32(pattern, interesting_bits) /* write the unary end bit and binary LSBs */
       );
    }
  };

  _proto.FLAC__bitwriter_write_rice_signed_block = function (vals, nvals, parameter) {
    var mask1 = FLAC__WORD_ALL_ONES << parameter; /* we val|=mask1 to set the stop bit above it... */
    var mask2 = FLAC__WORD_ALL_ONES >> (31-parameter); /* ...then mask off the bits above the stop bit with val&=mask2*/
    var uval = 0;
    var left = 0;
    var lsbits = 1 + parameter;
    var msbits = 0;
    var self = this;
    var doProcess = function () {
      uval |= mask1; /* set stop bit */
      uval &= mask2; /* mask off unused top bits */

      left = FLAC__BITS_PER_WORD - self.bits;
      if (lsbits < left) {
        self.accum <<= lsbits;
        self.accum |= uval;
        self.bits += lsbits;
      } else {
        /* if this.bits === 0, left===FLAC__BITS_PER_WORD which will always
         * be > lsbits (because of previous assertions) so it would have
         * triggered the (lsbits<left) case above.
         */
        //FLAC__ASSERT(self.bits);
        //FLAC__ASSERT(left < FLAC__BITS_PER_WORD);
        self.accum <<= left;
        self.accum |= uval >> (self.bits = lsbits - left);
        self.buffer[self.words++] = SWAP_BE_WORD_TO_HOST(self.accum);
        self.accum = uval;
      }
    };

    //FLAC__ASSERT(this.buffer);
    //FLAC__ASSERT(parameter < 31);
    /* WATCHOUT: code does not work with <32bit words; we can make things much faster with this assertion */
    //FLAC__ASSERT(FLAC__BITS_PER_WORD >= 32);

    for (var i = 0; i < nvals; i++) {
      /* fold signed to unsigned; actual formula is: negative(v)? -2v-1 : 2v */
      uval = (vals[i]<<1) ^ (vals[i]>>31);

      msbits = uval >> parameter;

      if (this.bits && this.bits + msbits + lsbits < FLAC__BITS_PER_WORD) { /* i.e. if the whole thing fits in the current uint32_t */
        /* ^^^ if this.bits is 0 then we may have filled the buffer and have no free uint32_t to work in */
        this.bits = this.bits + msbits + lsbits;
        uval |= mask1; /* set stop bit */
        uval &= mask2; /* mask off unused top bits */
        this.accum <<= msbits + lsbits;
        this.accum |= uval;
      } else {
        /* slightly pessimistic size check but faster than '<= this.words + (this.bits+msbits+lsbits+FLAC__BITS_PER_WORD-1)/FLAC__BITS_PER_WORD' */
        /* OPT: pessimism may cause flurry of false calls to grow_ which eat up all savings before it */
        if (this.capacity <= this.words + this.bits + msbits + 1/*lsbits always fit in 1 uint32_t*/ && !this.bitwriter_grow_(msbits+lsbits)) {
          return false;
        }

        if (msbits) {
          /* first part gets to word alignment */
          if (this.bits) {
            left = FLAC__BITS_PER_WORD - this.bits;
            if (msbits < left) {
              this.accum <<= msbits;
              this.bits += msbits;
              doProcess();
            } else {
              this.accum <<= left;
              msbits -= left;
              this.buffer[this.words++] = SWAP_BE_WORD_TO_HOST(this.accum);
              this.bits = 0;
            }
          }
          /* do whole words */
          while (msbits >= FLAC__BITS_PER_WORD) {
            this.buffer[this.words++] = 0;
            msbits -= FLAC__BITS_PER_WORD;
          }
          /* do any leftovers */
          if (msbits > 0) {
            this.accum = 0;
            this.bits = msbits;
          }
        }
        doProcess();
      }
    }
    return true;
  };

  _proto.FLAC__bitwriter_write_utf8_uint32 = function (val) {
    var ok = true;

    //FLAC__ASSERT(this.buffer);

    //FLAC__ASSERT(!(val & 0x80000000)); /* this version only handles 31 bits */

    if (val < 0x80) {
      return this.FLAC__bitwriter_write_raw_uint32(val, 8);
    } else if (val < 0x800) {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xC0 | (val>>6), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    } else if(val < 0x10000) {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xE0 | (val>>12), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>6)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    } else if(val < 0x200000) {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xF0 | (val>>18), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>12)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>6)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    } else if(val < 0x4000000) {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xF8 | (val>>24), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>18)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>12)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>6)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    } else {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xFC | (val>>30), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>24)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>18)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>12)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>6)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    }

    return ok;
  };

  _proto.FLAC__bitwriter_write_utf8_uint64 = function (val) {
    var ok = 1;

    //FLAC__ASSERT(this.buffer);

    //FLAC__ASSERT(!(val & 0xFFFFFFF000000000)); /* this version only handles 36 bits */

    if (val < 0x80) {
      return this.FLAC__bitwriter_write_raw_uint32(val, 8);
    } else if(val < 0x800) {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xC0 | (val>>6), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    } else if(val < 0x10000) {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xE0 | (val>>12), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>6)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    } else if(val < 0x200000) {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xF0 | (val>>18), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>12)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>6)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    } else if(val < 0x4000000) {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xF8 | (val>>24), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>18)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>12)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>6)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    } else if(val < 0x80000000) {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xFC | (val>>30), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>24)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>18)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>12)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>6)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    } else {
      ok &= this.FLAC__bitwriter_write_raw_uint32(0xFE, 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>30)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>24)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>18)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>12)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | ((val>>6)&0x3F), 8);
      ok &= this.FLAC__bitwriter_write_raw_uint32(0x80 | (val&0x3F), 8);
    }

    return ok;
  };

  _proto.FLAC__bitwriter_zero_pad_to_byte_boundary = function () {
    /* 0-pad to byte boundary */
    if (this.bits & 7) {
      return this.FLAC__bitwriter_write_zeroes(8 - (this.bits & 7));
    } else {
      return true;
    }
  };

}(this.self || global));
