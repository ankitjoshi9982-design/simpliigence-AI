<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/** Data shipped with the theme (built from the approved copy). */
function sgai_data( $file ) {
	static $cache = array();
	if ( ! isset( $cache[ $file ] ) ) {
		$path = SGAI_DIR . '/data/' . $file;
		$raw  = file_exists( $path ) ? file_get_contents( $path ) : '';
		$cache[ $file ] = ( substr( $file, -5 ) === '.json' ) ? json_decode( $raw, true ) : $raw;
	}
	return $cache[ $file ];
}

/** Which designed page are we on? Returns the slug key used in data/seo.json, or ''. */
function sgai_page_key() {
	if ( is_front_page() ) return 'home';
	if ( is_page() ) {
		$k = get_post_meta( get_queried_object_id(), '_sgai_page', true );
		if ( $k ) return $k;
	}
	return '';
}

/** Root-relative links and theme asset paths in designed markup → this site's real URLs. */
function sgai_links( $html ) {
	$home = untrailingslashit( home_url() );
	$html = preg_replace_callback( '#(href|action)="/(?!/)([^"]*)"#', function ( $m ) use ( $home ) {
		return $m[1] . '="' . esc_attr( $home . '/' . $m[2] ) . '"';
	}, $html );
	return str_replace( 'src="assets/', 'src="' . esc_url( SGAI_URI ) . '/assets/', $html );
}

/** Mark the current page in the nav. */
function sgai_current_nav( $html ) {
	$key  = sgai_page_key();
	$seo  = sgai_data( 'seo.json' );
	if ( ! $key || empty( $seo[ $key ] ) ) return $html;
	$url  = $seo[ $key ]['url'];
	return str_replace( '<li><a href="' . $url . '">', '<li><a href="' . $url . '" aria-current="page">', $html );
}

/* Privacy notice links go to the site's own Privacy Policy page once one is set in Settings → Privacy. */
add_filter( 'the_content', 'sgai_privacy_link', 100 );
function sgai_privacy_link( $html ) {
	$p = function_exists( 'get_privacy_policy_url' ) ? get_privacy_policy_url() : '';
	return $p ? str_replace( 'href="' . esc_attr( home_url( '/privacy/' ) ) . '"', 'href="' . esc_url( $p ) . '"', $html ) : $html;
}
