(function (scope) {

  scope.FLAC__StreamEncoder = FLAC__StreamEncoder;

  function FLAC__StreamEncoder() {
    this.protected_ = new FLAC__StreamEncoderProtected();
    this.private_ = new FLAC__StreamEncoderPrivate();
  }

  function FLAC__StreamEncoderProtected() {
    this.state = 0; // enum FLAC__StreamEncoderState 
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

}(this));
