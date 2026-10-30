<?php
/**
 * GEO/AEO: /llms.txt and /llms-full.txt (built from the approved titles, descriptions and FAQ answers),
 * plus sitemap lines in robots.txt. Live as soon as the theme is active.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'init', function () {
	add_rewrite_rule( '^llms\.txt$', 'index.php?sgai_llms=1', 'top' );
	add_rewrite_rule( '^llms-full\.txt$', 'index.php?sgai_llms=2', 'top' );
} );
add_filter( 'query_vars', function ( $v ) { $v[] = 'sgai_llms'; return $v; } );
add_action( 'template_redirect', function () {
	$q = (int) get_query_var( 'sgai_llms' );
	if ( ! $q ) return;
	header( 'Content-Type: text/plain; charset=utf-8' );
	header( 'X-Robots-Tag: noindex' );
	echo sgai_localise( sgai_data( 1 === $q ? 'llms.txt' : 'llms-full.txt' ) ); // phpcs:ignore -- plain text
	exit;
} );
add_filter( 'redirect_canonical', function ( $r ) { return get_query_var( 'sgai_llms' ) ? false : $r; } );

add_filter( 'robots_txt', function ( $out, $public ) {
	if ( ! $public ) return $out;
	if ( false === strpos( $out, 'Sitemap:' ) ) $out .= "\nSitemap: " . home_url( defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) ? '/sitemap_index.xml' : '/wp-sitemap.xml' ) . "\n";
	return $out . "# AI-readable summary: " . home_url( '/llms.txt' ) . "\n";
}, 10, 2 );

add_action( 'after_switch_theme', function () { flush_rewrite_rules(); } );
