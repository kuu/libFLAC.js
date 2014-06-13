(function (scope) {
  var _proto;

  scope.FLAC__StreamMetadata = FLAC__StreamMetadata;

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
    /* This must be one of the followings:
		  FLAC__StreamMetadata_StreamInfo
		  FLAC__StreamMetadata_Padding
		  FLAC__StreamMetadata_Application
		  FLAC__StreamMetadata_SeekTable
		  FLAC__StreamMetadata_VorbisComment
		  FLAC__StreamMetadata_CueSheet
		  FLAC__StreamMetadata_Picture
		  FLAC__StreamMetadata_Unknown
    */
  }

  /** FLAC STREAMINFO structure.  (c.f. <A HREF="../format.html#metadata_block_streaminfo">format specification</A>)
   */
  function FLAC__StreamMetadata_StreamInfo() {
    this.min_blocksize = 0;
    this.max_blocksize = 0;
    this.min_framesize = 0;
    this.max_framesize = 0;
    this.sample_rate = 0;
    this.channels = 0;
    this.bits_per_sample = 0;
    this.total_samples = 0;
    this.md5sum = new Uint8Array(16);
  }

  _proto = FLAC__StreamMetadata_StreamInfo.prototype;

  _proto.MIN_BLOCK_SIZE_LEN = 16;
  _proto.MAX_BLOCK_SIZE_LEN = 16;
  _proto.MIN_FRAME_SIZE_LEN = 24;
  _proto.MAX_FRAME_SIZE_LEN = 24;
  _proto.SAMPLE_RATE_LEN = 20;
  _proto.CHANNELS_LEN = 3;
  _proto.BITS_PER_SAMPLE_LEN = 5;
  _proto.TOTAL_SAMPLES_LEN = 36;
  _proto.MD5SUM_LEN = 128;

  /** The total stream length of the STREAMINFO block in bytes. */
  _proto.LENGTH = 34;

  /** FLAC PADDING structure.  (c.f. <A HREF="../format.html#metadata_block_padding">format specification</A>)
   */
  function FLAC__StreamMetadata_Padding() {
	  this.dummy = 0;
	  /**< Conceptually this is an empty struct since we don't store the
	   * padding bytes.  Empty structs are not allowed by some C compilers,
	   * hence the dummy.
	   */
  }

  /** FLAC APPLICATION structure.  (c.f. <A HREF="../format.html#metadata_block_application">format specification</A>)
   */
  function FLAC__StreamMetadata_Application() {
    this.id = '';
    this.data = null;
  }

  _proto = FLAC__StreamMetadata_Application.prototype;

  _proto.ID_LEN = 32;

  /** SeekPoint structure used in SEEKTABLE blocks.  (c.f. <A HREF="../format.html#seekpoint">format specification</A>)
   */
  function FLAC__StreamMetadata_SeekPoint() {
	  this.sample_number = 0;
	  /**<  The sample number of the target frame. */

	  this.stream_offset = 0;
	  /**< The offset, in bytes, of the target frame with respect to
	   * beginning of the first frame. */

	  this.frame_samples = 0;
  	/**< The number of samples in the target frame. */
  }

  _proto = FLAC__StreamMetadata_SeekPoint.prototype;

  _proto.SAMPLE_NUMBER_LEN = 64;
  _proto.STREAM_OFFSET_LEN = 64;
  _proto.FRAME_SAMPLES_LEN = 16;

  /** The total stream length of a seek point in bytes. */
  _proto.LENGTH = 18;

  /** The value used in the \a sample_number field of
   *  FLAC__StreamMetadataSeekPoint used to indicate a placeholder
   *  point (== 0xffffffffffffffff).
   */
  _proto.PLACEHOLDER = 0;

  /** FLAC SEEKTABLE structure.  (c.f. <A HREF="../format.html#metadata_block_seektable">format specification</A>)
   *
   * \note From the format specification:
   * - The seek points must be sorted by ascending sample number.
   * - Each seek point's sample number must be the first sample of the
   *   target frame.
   * - Each seek point's sample number must be unique within the table.
   * - Existence of a SEEKTABLE block implies a correct setting of
   *   total_samples in the stream_info block.
   * - Behavior is undefined when more than one SEEKTABLE block is
   *   present in a stream.
   */
  function FLAC__StreamMetadata_SeekTable() {
	  this.num_points = 0;
	  this.points = null; // FLAC__StreamMetadata_SeekPoint - TODO
  }

  /** Vorbis comment entry structure used in VORBIS_COMMENT blocks.  (c.f. <A HREF="../format.html#metadata_block_vorbis_comment">format specification</A>)
   *
   *  For convenience, the APIs maintain a trailing NUL character at the end of
   *  \a entry which is not counted toward \a length, i.e.
   *  \code strlen(entry) == length \endcode
   */
  function FLAC__StreamMetadata_VorbisComment_Entry() {
	  this.length = 0;
	  this.entry = null;
  }
  _proto = FLAC__StreamMetadata_VorbisComment_Entry.prototype;

  _proto.LENGTH_LEN = 32;


  /** FLAC VORBIS_COMMENT structure.  (c.f. <A HREF="../format.html#metadata_block_vorbis_comment">format specification</A>)
   */
  function FLAC__StreamMetadata_VorbisComment() {
	  this.vendor_string = null; // FLAC__StreamMetadata_VorbisComment_Entry 
	  this.num_comments = 0;
	  this.comments = []; // FLAC__StreamMetadata_VorbisComment_Entry 
  }

  _proto = FLAC__StreamMetadata_VorbisComment.prototype;

  _proto.NUM_COMMENTS_LEN = 32;

  /** FLAC CUESHEET track index structure.  (See the
   * <A HREF="../format.html#cuesheet_track_index">format specification</A> for
   * the full description of each field.)
   */
  function FLAC__StreamMetadata_CueSheet_Index() {
	  this.offset = 0;
	  /**< Offset in samples, relative to the track offset, of the index
	   * point.
	   */

	  this.number = 0;
	  /**< The index point number. */
  }

  _proto = FLAC__StreamMetadata_CueSheet_Index.prototype;

  _proto.OFFSET_LEN = 64;
  _proto.NUMBER_LEN = 8;
  _proto.RESERVED_LEN = 24;

  /** FLAC CUESHEET track structure.  (See the
   * <A HREF="../format.html#cuesheet_track">format specification</A> for
   * the full description of each field.)
   */
  function FLAC__StreamMetadata_CueSheet_Track() {
	  this.offset = 0;
	  /**< Track offset in samples, relative to the beginning of the FLAC audio stream. */

	  this.number = 0;
	  /**< The track number. */

	  this.isrc = '';
	  /**< Track ISRC.  This is a 12-digit alphanumeric code plus a trailing \c NUL byte */

	  this.type = 0;
	  /**< The track type: 0 for audio, 1 for non-audio. */

	  this.pre_emphasis = 0;
	  /**< The pre-emphasis flag: 0 for no pre-emphasis, 1 for pre-emphasis. */

	  this.num_indices = 0;
	  /**< The number of track index points. */

	  this.indices = []; // FLAC__StreamMetadata_CueSheet_Index 
	  /**< NULL if num_indices == 0, else pointer to array of index points. */
  }

  _proto = FLAC__StreamMetadata_CueSheet_Track.prototype;

  _proto.OFFSET_LEN = 64;
  _proto.NUMBER_LEN = 8;
  _proto.ISRC_LEN = 96;
  _proto.TYPE_LEN = 1;
  _proto.PRE_EMPHASIS_LEN = 1;
  _proto.RESERVED_LEN = 110;
  _proto.NUM_INDICES_LEN = 8;

  /** FLAC CUESHEET structure.  (See the
   * <A HREF="../format.html#metadata_block_cuesheet">format specification</A>
   * for the full description of each field.)
   */
  function FLAC__StreamMetadata_CueSheet() {
	  this.media_catalog_number = '';
	  /**< Media catalog number, in ASCII printable characters 0x20-0x7e.  In
	   * general, the media catalog number may be 0 to 128 bytes long; any
	   * unused characters should be right-padded with NUL characters.
	   */

	  this.lead_in = 0;
	  /**< The number of lead-in samples. */

	  this.is_cd = false;
	  /**< \c true if CUESHEET corresponds to a Compact Disc, else \c false. */

	  this.num_tracks = 0;
	  /**< The number of tracks. */

	  this.tracks = []; // FLAC__StreamMetadata_CueSheet_Track 
	  /**< NULL if num_tracks == 0, else pointer to array of tracks. */
  }

  _proto = FLAC__StreamMetadata_CueSheet.prototype;

  _proto.MEDIA_CATALOG_NUMBER_LEN = 1024;
  _proto.LEAD_IN_LEN = 64;
  _proto.IS_CD_LEN = 1;
  _proto.RESERVED_LEN = 2071;
  _proto.NUM_TRACKS_LEN = 8;
}(this));
