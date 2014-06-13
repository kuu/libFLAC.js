(function (scope) {
  var proto, i;

  scope.FLAC__StreamEncoderState = FLAC__StreamEncoderState;
  scope.FLAC__MetadataType = FLAC__MetadataType;

  /** State values for a FLAC__StreamEncoder.
   *
   * The encoder's state can be obtained by calling FLAC__stream_encoder_get_state().
   *
   * If the encoder gets into any other state besides \c OK
   * or \c UNINITIALIZED, it becomes invalid for encoding and
   * must be deleted with FLAC__stream_encoder_delete().
   */
  function FLAC__StreamEncoderState() {
  }

  proto = FLAC__StreamEncoderState.prototype;
  i = 0;

  proto.OK = i++;
  /**< The encoder is in the normal OK state and samples can be processed. */

  proto.UNINITIALIZED = i++;
  /**< The encoder is in the uninitialized state; one of the
   * FLAC__stream_encoder_init_*() functions must be called before samples
   * can be processed.
   */

  proto.OGG_ERROR = i++;
  /**< An error occurred in the underlying Ogg layer.  */

  proto.VERIFY_DECODER_ERROR = i++;
  /**< An error occurred in the underlying verify stream decoder;
   * check FLAC__stream_encoder_get_verify_decoder_state().
   */

  proto.VERIFY_MISMATCH_IN_AUDIO_DATA = i++;
  /**< The verify decoder detected a mismatch between the original
   * audio signal and the decoded audio signal.
   */

  proto.CLIENT_ERROR = i++;
  /**< One of the callbacks returned a fatal error. */

  proto.IO_ERROR = i++;
  /**< An I/O error occurred while opening/reading/writing a file.
   * Check \c errno.
   */

  proto.FRAMING_ERROR = i++;
  /**< An error occurred while writing the stream; usually, the
   * write_callback returned an error.
   */

  proto.MEMORY_ALLOCATION_ERROR = i++;
  /**< Memory allocation failed. */




  /** An enumeration of the available metadata block types. */
  function FLAC__MetadataType() {
  }

  proto = FLAC__MetadataType.prototype;
  i = 0;

  proto.OK = i++;

	proto.STREAMINFO = i++;
	/**< <A HREF="../format.html#metadata_block_streaminfo">STREAMINFO</A> block */

  proto.PADDING = i++;
	/**< <A HREF="../format.html#metadata_block_padding">PADDING</A> block */

	proto.APPLICATION = i++;
	/**< <A HREF="../format.html#metadata_block_application">APPLICATION</A> block */

	proto.SEEKTABLE = i++;
	/**< <A HREF="../format.html#metadata_block_seektable">SEEKTABLE</A> block */

	proto.VORBIS_COMMENT = i++;
	/**< <A HREF="../format.html#metadata_block_vorbis_comment">VORBISCOMMENT</A> block (a.k.a. FLAC tags) */

	proto.CUESHEET = i++;
	/**< <A HREF="../format.html#metadata_block_cuesheet">CUESHEET</A> block */

	proto.PICTURE = i++;
	/**< <A HREF="../format.html#metadata_block_picture">PICTURE</A> block */

	proto.UNDEFINED = i++;
	/**< marker to denote beginning of undefined type range; this number will increase as new metadata types are added */

}(this));
