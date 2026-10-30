<?php
/**
 * Minimal widget-area registration — kept small on purpose: the footer and
 * nav are hard-coded in header.php/footer.php to match the approved copy
 * exactly, rather than built from widgets that could drift from it.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function sgai_register_sidebar() {
	register_sidebar( array(
		'name'          => 'Unused — reserved',
		'id'            => 'sgai-reserved',
		'description'   => 'Not used by any template; reserved for future Elementor global widgets.',
	) );
}
add_action( 'widgets_init', 'sgai_register_sidebar' );
