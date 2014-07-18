/* alloc - Convenience routines for safely allocating memory
 * Copyright (C) 2007-2009  Josh Coalson
 * Copyright (C) 2011-2013  Xiph.Org Foundation
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * - Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * - Neither the name of the Xiph.org Foundation nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE FOUNDATION OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var SIZE_MAX = 0xffffffff;

function malloc(size) {
  return new Uint8Array(size);
}

function free(ptr) {
  ; // NOP
}

/* avoid malloc()ing 0 bytes, see:
 * https://www.securecoding.cert.org/confluence/display/seccode/MEM04-A.+Do+not+make+assumptions+about+the+result+of+allocating+0+bytes?focusedCommentId=5407003
*/
function safe_malloc_(size) {
  /* malloc(0) is undefined; FLAC src convention is to always allocate */
  if (!size) {
    size++;
  }
  return malloc(size);
}

function safe_calloc_(nmemb, size) {
  if (!nmemb || !size) {
    return malloc(1); /* malloc(0) is undefined; FLAC src convention is to always allocate */
  }
  return malloc(nmemb * size);
}

/*@@@@ there's probably a better way to prevent overflows when allocating untrusted sums but this works for now */

function safe_malloc_add_2op_(size1, size2) {
  size2 += size1;
  if (size2 < size1) {
    return 0;
  }
  return safe_malloc_(size2);
}

function safe_malloc_add_3op_(size1, size2, size3) {
  size2 += size1;
  if (size2 < size1) {
    return 0;
  }
  size3 += size2;
  if (size3 < size2) {
    return 0;
  }
  return safe_malloc_(size3);
}

function safe_malloc_add_4op_(size1, size2, size3, size4) {
  size2 += size1;
  if (size2 < size1) {
    return 0;
  }
  size3 += size2;
  if (size3 < size2) {
    return 0;
  }
  size4 += size3;
  if (size4 < size3) {
    return 0;
  }
  return safe_malloc_(size4);
}

function safe_malloc_mul_3op_(size1, size2, size3) {
  if (!size1 || !size2 || !size3) {
    return malloc(1); /* malloc(0) is undefined; FLAC src convention is to always allocate */
  }
  if (size1 > SIZE_MAX / size2) {
    return 0;
  }
  size1 *= size2;
  if (size1 > SIZE_MAX / size3) {
    return 0;
  }
  return malloc(size1*size3);
}

/* size1*size2 + size3 */
function safe_malloc_mul2add_(size1, size2, size3) {
  if (!size1 || !size2) {
    return safe_malloc_(size3);
  }
  if (size1 > SIZE_MAX / size2) {
    return 0;
  }
  return safe_malloc_add_2op_(size1*size2, size3);
}

/* size1 * (size2 + size3) */
function safe_malloc_muladd2_(size1, size2, size3) {
  if (!size1 || (!size2 && !size3)) {
    return malloc(1); /* malloc(0) is undefined; FLAC src convention is to always allocate */
  }
  size2 += size3;
  if (size2 < size3) {
    return 0;
  }
  if (size1 > SIZE_MAX / size2) {
    return 0;
  }
  return malloc(size1*size2);
}

function safe_realloc_add_2op_(ptr, size1, size2) {
  return safe_malloc_add_2op_(size1, size2);
}

function safe_realloc_add_3op_(ptr, size1, size2, size3) {
  return safe_malloc_add_3op_(size1, size2, size3);
}

function safe_realloc_add_4op_(ptr, size1, size2, size3, size4) {
  return safe_malloc_add_4op_(size1, size2, size3, size4);
}

function safe_realloc_mul_2op_(ptr, size1, size2) {
  if (!size1 || !size2) {
    return 0; /* preserve POSIX realloc(ptr, 0) semantics */
  }
  if (size1 > SIZE_MAX / size2) {
    return 0;
  }
  return malloc(size1*size2);
}

/* size1 * (size2 + size3) */
function safe_realloc_muladd2_(ptr, size1, size2, size3) {
  if (!size1 || (!size2 && !size3)) {
    return 0; /* preserve POSIX realloc(ptr, 0) semantics */
  }
  size2 += size3;
  if (size2 < size3) {
    return 0;
  }
  return safe_realloc_mul_2op_(ptr, size1, size2);
}
