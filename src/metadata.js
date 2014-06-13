(function (scope) {

  var _proto;

  var scope.metadata = {
    TYPE: Type,
    Metadata: Metadata,
  };

  /*****************************************************************************
   *
   * Meta-data structures
   *
   *****************************************************************************/

  /** An enumeration of the available metadata block types. */
  function Type() {
  }

  _proto = Type.prototype;

  _proto.STREAMINFO = 0;
  /**< <A HREF="../format.html#metadata_block_streaminfo">STREAMINFO</A> block */

  _proto.PADDING = 1;
  /**< <A HREF="../format.html#metadata_block_padding">PADDING</A> block */

  _proto.APPLICATION = 2;
  /**< <A HREF="../format.html#metadata_block_application">APPLICATION</A> block */

  _proto.SEEKTABLE = 3;
  /**< <A HREF="../format.html#metadata_block_seektable">SEEKTABLE</A> block */

  _proto.VORBIS_COMMENT = 4;
  /**< <A HREF="../format.html#metadata_block_vorbis_comment">VORBISCOMMENT</A> block (a.k.a. FLAC tags) */

  _proto.CUESHEET = 5;
  /**< <A HREF="../format.html#metadata_block_cuesheet">CUESHEET</A> block */

  _proto.PICTURE = 6;
  /**< <A HREF="../format.html#metadata_block_picture">PICTURE</A> block */

  _proto.UNDEFINED = 7;
  /**< marker to denote beginning of undefined type range; this number will increase as new metadata types are added */

  /** Maps a Type to a C string.
   *
   *  Using a Type as the index to this array will
   *  give the string equivalent.  The contents should not be modified.
   */
  _proto.STRING_TABLE = [];


  /** FLAC metadata block structure.  (c.f. <A HREF="../format.html#metadata_block">format specification</A>)
   */
  function Metadata(type) {
    this.type = type; // enum Type 
    /**< The type of the metadata block; used determine which member of the
     * \a data union to dereference.  If type >= FLAC__METADATA_TYPE_UNDEFINED
     * then \a data.unknown must be used. */

    this.is_last = false;
    /**< \c true if this metadata block is the last, else \a false */

    this.length = 0;
    /**< Length, in bytes, of the block data as it appears in the stream. */
  }

  _proto = Metadata.prototype;

  _proto.IS_LAST_LEN = 1;
  _proto.TYPE_LEN = 7;
  _proto.LENGTH_LEN = 24;

  /** The total stream length of a metadata block header in bytes. */
  _proto.HEADER_LENGTH = 4;

  /** Returns \c true if the object was correctly constructed
   *  (i.e. the underlying ::FLAC__StreamMetadata object was
   *  properly allocated), else \c false.
   */
  _proto.is_valid = function () {
  };

  /** Returns \c true if this block is the last block in a
   *  stream, else \c false.
   *
   * \assert
   *   \code is_valid() \endcode
   */
  _proto.get_is_last = function () {
    return this.is_last;
  };

  /** Returns the type of the block.
   *
   * \assert
   *   \code is_valid() \endcode
   */
  _proto.get_type = function () {
    return this.type;
  };

  /** Returns the stream length of the metadata block.
   *
   * \note
   *   The length does not include the metadata block header,
   *   per spec.
   *
   * \assert
   *   \code is_valid() \endcode
   */
  _proto.get_length = function () {
    return this.length;
  };

  /** Sets the "is_last" flag for the block.  When using the iterators
   *  it is not necessary to set this flag; they will do it for you.
   *
   * \assert
   *   \code is_valid() \endcode
   */
  _proto.set_is_last = function (is_last) {
  };

  /** Create a deep copy of an object and return it. */
  _proto.clone = function (metadata) {
  };

  /** FLAC STREAMINFO structure.  (c.f. <A HREF="../format.html#metadata_block_streaminfo">format specification</A>)
   */
  function StreamInfo() {
    Metadata.call(this, Type.STREAMINFO);
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

  _proto = StreamInfo.prototype = Object.create(Metadata.prototype);
  _proto.constructor = StreamInfo;

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

  _proto.get_min_blocksize = function () {
  };

  _proto.get_max_blocksize = function () {};
  _proto.get_min_framesize = function () {};
  _proto.get_max_framesize = function () {};
  _proto.get_sample_rate = function () {};
  _proto.get_channels = function () {};
  _proto.get_bits_per_sample(= function () {};
  _proto.get_total_samples = function () {};
  _proto.get_md5sum = function () {};

  _proto.set_min_blocksize = function (value) {};
  _proto.set_max_blocksize = function (value) {};
  _proto.set_min_framesize = function (value) {};
  _proto.set_max_framesize = function (value) {};
  _proto.set_sample_rate = function (value) {};
  _proto.set_channels = function (value) {};
  _proto.set_bits_per_sample = function (value) {};
  _proto.set_total_samples = function (value) {};
  _proto.set_md5sum = function (value) {};

  /** FLAC PADDING structure.  (c.f. <A HREF="../format.html#metadata_block_padding">format specification</A>)
   */
  function Padding() {
    Metadata.call(this, Type.PADDING);
    this.dummy = 0;
    /**< Conceptually this is an empty struct since we don't store the
     * padding bytes.  Empty structs are not allowed by some C compilers,
     * hence the dummy.
     */
  }

  _proto = Padding.prototype = Object.create(Metadata.prototype);
  _proto.constructor = Padding;

  /** Sets the length in bytes of the padding block.
   */
  _proto.set_length = function (length) {};

  /** FLAC APPLICATION structure.  (c.f. <A HREF="../format.html#metadata_block_application">format specification</A>)
   */
  function Application() {
    Metadata.call(this, Type.APPLICATION);
    this.id = '';
    this.data = null;
  }

  _proto = Application.prototype = Object.create(Metadata.prototype);
  _proto.constructor = Application;

  _proto.ID_LEN = 32;

  _proto.get_id = function () {};
  _proto.get_data = function () {};

  _proto.set_id = function (value) {};
  //! This form always copies \a data
  _proto.set_data = function (data, length) {};
  _proto.set_data = function (data, length, copy) {};

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
  function SeekTable() {
    Metadata.call(this, Type.SEEKTABLE);
    this.num_points = 0;
    this.points = null; // FLAC__StreamMetadata_SeekPoint - TODO
  }

  _proto = SeekTable.prototype = Object.create(Metadata.prototype);
  _proto.constructor = SeekTable;

  _proto.get_num_points = function () {};
  _proto.get_point = function (index) {};

  //! See FLAC__metadata_object_seektable_resize_points()
  _proto.resize_points = function (new_num_points) {};

  //! See FLAC__metadata_object_seektable_set_point()
  _proto.set_point = function (index, point) {};

  //! See FLAC__metadata_object_seektable_insert_point()
  _proto.insert_point = function (index, point) {};

  //! See FLAC__metadata_object_seektable_delete_point()
  _proto.delete_point = function (index) {};

  //! See FLAC__metadata_object_seektable_is_legal()
  _proto.is_legal = function () {};

  //! See FLAC__metadata_object_seektable_template_append_placeholders()
  _proto.template_append_placeholders = function (num) {};

  //! See FLAC__metadata_object_seektable_template_append_point()
  _proto.template_append_point = function (sample_number) {};

  //! See FLAC__metadata_object_seektable_template_append_points()
  _proto.template_append_points = function (sample_numbers, num) {};

  //! See FLAC__metadata_object_seektable_template_append_spaced_points()
  _proto.template_append_spaced_points = function (num, total_samples) {};

  //! See FLAC__metadata_object_seektable_template_append_spaced_points_by_samples()
  _proto.template_append_spaced_points_by_samples = function (samples, total_samples) {};

  //! See FLAC__metadata_object_seektable_template_sort()
  _proto.template_sort = function (compact) {};

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

  _proto.is_valid = function () {}; ///< Returns \c true iff object was properly constructed.

  _proto.get_field_length = function () {};
  _proto.get_field_name_length = function () {};
  _proto.get_field_value_length = function () {};

  _proto.get_field = function () {};
  _proto.get_field_name = function () {};
  _proto.get_field_value = function () {};

  _proto.set_field = function (field, field_length);
  _proto.set_field = function (field); // assumes \a field is NUL-terminated
  _proto.set_field_name = function (field_name);
  _proto.set_field_value = function (field_value, field_value_length);
  _proto.set_field_value = function (field_value); // assumes \a field_value is NUL-terminated

  /** FLAC VORBIS_COMMENT structure.  (c.f. <A HREF="../format.html#metadata_block_vorbis_comment">format specification</A>)
   */
  function VorbisComment() {
    Metadata.call(this, Type.VORBIS_COMMENT);
    this.vendor_string = null; // FLAC__StreamMetadata_VorbisComment_Entry 
    this.num_comments = 0;
    this.comments = []; // FLAC__StreamMetadata_VorbisComment_Entry 
  }

  _proto = VorbisComment.prototype = Object.create(Metadata.prototype);
  _proto.constructor = VorbisComment;

  _proto.NUM_COMMENTS_LEN = 32;

  _proto.get_num_comments = function () {};
  _proto.get_vendor_string = function () {}; // NUL-terminated UTF-8 string
  _proto.get_comment = function (index) {};

  //! See FLAC__metadata_object_vorbiscomment_set_vendor_string()
  _proto.set_vendor_string = function(string); // NUL-terminated UTF-8 string

  //! See FLAC__metadata_object_vorbiscomment_resize_comments()
  _proto.resize_comments = function(new_num_comments);

  //! See FLAC__metadata_object_vorbiscomment_set_comment = function()
  _proto.set_comment = function(index, entry);

  //! See FLAC__metadata_object_vorbiscomment_insert_comment()
  _proto.insert_comment = function(index, entry);

  //! See FLAC__metadata_object_vorbiscomment_append_comment()
  _proto.append_comment = function(entry);

  //! See FLAC__metadata_object_vorbiscomment_replace_comment()
  _proto.replace_comment = function(entry, all);

  //! See FLAC__metadata_object_vorbiscomment_delete_comment()
  _proto.delete_comment = function(index);

  //! See FLAC__metadata_object_vorbiscomment_find_entry_from()
  int find_entry_from = function(offset, field_name);

  //! See FLAC__metadata_object_vorbiscomment_remove_entry_matching()
  int remove_entry_matching = function(field_name);

  //! See FLAC__metadata_object_vorbiscomment_remove_entries_matching()
  int remove_entries_matching = function(field_name);

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
  function CueSheet() {
    Metadata.call(this, Type.CUESHEET);
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

  _proto = CueSheet.prototype = Object.create(Metadata.prototype);
  _proto.constructor = CueSheet;

  _proto.MEDIA_CATALOG_NUMBER_LEN = 1024;
  _proto.LEAD_IN_LEN = 64;
  _proto.IS_CD_LEN = 1;
  _proto.RESERVED_LEN = 2071;
  _proto.NUM_TRACKS_LEN = 8;

  /** An enumeration of the PICTURE types (see FLAC__StreamMetadataPicture and id3 v2.4 APIC tag). */
  function FLAC__StreamMetadata_Picture_Type() {
  }

  _proto = FLAC__StreamMetadata_Picture_Type.prototype;

  _proto.OTHER = 0; /**< Other */
  _proto.FILE_ICON_STANDARD = 1; /**< 32x32 pixels 'file icon' (PNG only) */
  _proto.FILE_ICON = 2; /**< Other file icon */
  _proto.FRONT_COVER = 3; /**< Cover (front) */
  _proto.BACK_COVER = 4; /**< Cover (back) */
  _proto.LEAFLET_PAGE = 5; /**< Leaflet page */
  _proto.MEDIA = 6; /**< Media (e.g. label side of CD) */
  _proto.LEAD_ARTIST = 7; /**< Lead artist/lead performer/soloist */
  _proto.ARTIST = 8; /**< Artist/performer */
  _proto.CONDUCTOR = 9; /**< Conductor */
  _proto.BAND = 10; /**< Band/Orchestra */
  _proto.COMPOSER = 11; /**< Composer */
  _proto.LYRICIST = 12; /**< Lyricist/text writer */
  _proto.RECORDING_LOCATION = 13; /**< Recording Location */
  _proto.DURING_RECORDING = 14; /**< During recording */
  _proto.DURING_PERFORMANCE = 15; /**< During performance */
  _proto.VIDEO_SCREEN_CAPTURE = 16; /**< Movie/video screen capture */
  _proto.FISH = 17; /**< A bright coloured fish */
  _proto.ILLUSTRATION = 18; /**< Illustration */
  _proto.BAND_LOGOTYPE = 19; /**< Band/artist logotype */
  _proto.PUBLISHER_LOGOTYPE = 20; /**< Publisher/Studio logotype */
  _proto.UNDEFINED = 21;

  /** Maps a FLAC__StreamMetadata_Picture_Type to a C string.
   *
   *  Using a FLAC__StreamMetadata_Picture_Type as the index to this array
   *  will give the string equivalent.  The contents should not be
   *  modified.
   */
  _proto.STRING_TABLE = [];

  /** FLAC PICTURE structure.  (See the
   * <A HREF="../format.html#metadata_block_picture">format specification</A>
   * for the full description of each field.)
   */
  function Picture() {
    Metadata.call(this, Type.PICTURE);

    this.type = FLAC__StreamMetadata_Picture_Type.UNDEFINED; // FLAC__StreamMetadata_Picture_Type 
    /**< The kind of picture stored. */

    this.mime_type = '';
    /**< Picture data's MIME type, in ASCII printable characters
     * 0x20-0x7e, NUL terminated.  For best compatibility with players,
     * use picture data of MIME type \c image/jpeg or \c image/png.  A
     * MIME type of '-->' is also allowed, in which case the picture
     * data should be a complete URL.  In file storage, the MIME type is
     * stored as a 32-bit length followed by the ASCII string with no NUL
     * terminator, but is converted to a plain C string in this structure
     * for convenience.
     */

    this.description = '';;
    /**< Picture's description in UTF-8, NUL terminated.  In file storage,
     * the description is stored as a 32-bit length followed by the UTF-8
     * string with no NUL terminator, but is converted to a plain C string
     * in this structure for convenience.
     */

    this.width = 0;
    /**< Picture's width in pixels. */

    this.height = 0;
    /**< Picture's height in pixels. */

    this.depth = 0;
    /**< Picture's color depth in bits-per-pixel. */

    this.colors = 0;
    /**< For indexed palettes (like GIF), picture's number of colors (the
     * number of palette entries), or \c 0 for non-indexed (i.e. 2^depth).
     */

    this.data_length = 0;
    /**< Length of binary picture data in bytes. */

    this.data = null;
    /**< Binary picture data. */
  }

  _proto = Picture.prototype = Object.create(Metadata.prototype);
  _proto.constructor = Picture;

  _proto.TYPE_LEN = 32;
  _proto.MIME_TYPE_LENGTH_LEN = 32;
  _proto.DESCRIPTION_LENGTH_LEN = 32;
  _proto.WIDTH_LEN = 32;
  _proto.HEIGHT_LEN = 32;
  _proto.DEPTH_LEN = 32;
  _proto.COLORS_LEN = 32;
  _proto.DATA_LENGTH_LEN = 32;

  /** Structure that is used when a metadata block of unknown type is loaded.
   *  The contents are opaque.  The structure is used only internally to
   *  correctly handle unknown metadata.
   */
  function Unknown() {
    Metadata.call(this, Type.UNKNOWN);
    this.data = null;
  }

  _proto = Unknown.prototype = Object.create(Metadata.prototype);
  _proto.constructor = Unknown;

}(flac));
