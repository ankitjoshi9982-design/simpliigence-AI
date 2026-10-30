<?php
/**
 * Generic Page template — used by every one of the 9 approved pages
 * (and by the front page too, since front-page.php defers to this when
 * absent). Content lives in the WordPress page itself (imported via the
 * WXR file, editable afterwards in the block editor or in Elementor),
 * not hard-coded in the theme — so editing a page in wp-admin is exactly
 * how you change what visitors see.
 */
get_header();
if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();
		the_content();
	endwhile;
endif;
get_footer();
