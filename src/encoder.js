var flac = {};

(function () {

  flac.Encoder = Encoder;

  function Encoder() {
    this.protected_ = new EncoderProtected();
    this.private_ = new EncoderPrivate();
  }

  /** State values for a FLAC__StreamEncoder.
   *
   * The encoder's state can be obtained by calling FLAC__stream_encoder_get_state().
   *
   * If the encoder gets into any other state besides \c OK
   * or \c UNINITIALIZED, it becomes invalid for encoding and
   * must be deleted with FLAC__stream_encoder_delete().
   */

  Encoder.STATE_OK = 0;
  /**< The encoder is in the normal OK state and samples can be processed. */

  Encoder.STATE_UNINITIALIZED = 1;
  /**< The encoder is in the uninitialized state; one of the
   * FLAC__stream_encoder_init_*() functions must be called before samples
   * can be processed.
   */

  Encoder.STATE_OGG_ERROR = 2;
  /**< An error occurred in the underlying Ogg layer.  */

  Encoder.STATE_VERIFY_DECODER_ERROR = 3;
  /**< An error occurred in the underlying verify stream decoder;
   * check FLAC__stream_encoder_get_verify_decoder_state().
   */

  Encoder.STATE_VERIFY_MISMATCH_IN_AUDIO_DATA = 4;
  /**< The verify decoder detected a mismatch between the original
   * audio signal and the decoded audio signal.
   */

  Encoder.STATE_CLIENT_ERROR = 5;
  /**< One of the callbacks returned a fatal error. */

  Encoder.STATE_IO_ERROR = 6;
  /**< An I/O error occurred while opening/reading/writing a file.
   * Check \c errno.
   */

  Encoder.STATE_FRAMING_ERROR = 7;
  /**< An error occurred while writing the stream; usually, the
   * write_callback returned an error.
   */

  Encoder.STATE_MEMORY_ALLOCATION_ERROR = 8;
  /**< Memory allocation failed. */

  function EncoderProtected() {
    this.state = 0; // enum EncoderState 
    this.verify = false;
    this.streamable_subset = false;
    this.do_md5 = false;
    this.do_mid_side_stereo = false;
    this.loose_mid_side_stereo = false;
    this.channels = 2;
    this.bits_per_sample = 16;
    this.sample_rate = 44100;
    this.blocksize = 0;
// #ifndef FLAC__INTEGER_ONLY_LIBRARY
    //this.num_apodizations = 0;
    //this.apodizations[FLAC__MAX_APODIZATION_FUNCTIONS]; // FLAC__ApodizationSpecification 
// #endif
    this.max_lpc_order = 0;
    this.qlp_coeff_precision = 0;
    this.do_qlp_coeff_prec_search = false;
    this.do_exhaustive_model_search = false;
    this.do_escape_coding = false;
    this.min_residual_partition_order = 0;
    this.max_residual_partition_order = 0;
    this.rice_parameter_search_dist = 0;
    this.total_samples_estimate = 0;
    this.metadata = []; // FLAC__StreamMetadata
    this.num_metadata_blocks = 0;
    this.streaminfo_offset = 0;
    this.seektable_offset = 0;
    this.audio_offset = 0;
// #if FLAC__HAS_OGG
    this.ogg_encoder_aspect = null; // FLAC__OggEncoderAspect 
// #endif
  }

}());
