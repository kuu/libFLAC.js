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
    this.seektable_offset = 0
    this.audio_offset = 0;
// #if FLAC__HAS_OGG
    this.ogg_encoder_aspect; // FLAC__OggEncoderAspect 
// #endif
  }

  /** FLAC metadata block structure.  (c.f. <A HREF="../format.html#metadata_block">format specification</A>)
   */
  function FLAC__StreamMetadata() {
	  this.type = FLAC__MetadataTYpe.UNDEFINED; // enum FLAC__MetadataType 
	  /**< The type of the metadata block; used determine which member of the
	   * \a data union to dereference.  If type >= FLAC__METADATA_TYPE_UNDEFINED
	   * then \a data.unknown must be used. */

	  this.is_last = false;
	  /**< \c true if this metadata block is the last, else \a false */

	  this.length = 0;
    /**< Length, in bytes, of the block data as it appears in the stream. */

    this.data = null;
	  /**< Polymorphic block data; use the \a type value to determine which
	   * to use. */
	union {
		FLAC__StreamMetadata_StreamInfo stream_info;
		FLAC__StreamMetadata_Padding padding;
		FLAC__StreamMetadata_Application application;
		FLAC__StreamMetadata_SeekTable seek_table;
		FLAC__StreamMetadata_VorbisComment vorbis_comment;
		FLAC__StreamMetadata_CueSheet cue_sheet;
		FLAC__StreamMetadata_Picture picture;
		FLAC__StreamMetadata_Unknown unknown;
	} data;
  }

}(this));
