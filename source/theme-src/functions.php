<?php
/**
 * Simpliigence AI theme v2.0
 * Dark AI-assistant design. Brand: Inter + Source Sans 3 (self-hosted), #2A63C4 / #1F4A90 / #73A1E2.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

define( 'SGAI_VER', '2.0.0' );
define( 'SGAI_DIR', get_template_directory() );
define( 'SGAI_URI', get_template_directory_uri() );

require SGAI_DIR . '/inc/helpers.php';
require SGAI_DIR . '/inc/leads.php';
require SGAI_DIR . '/inc/knowledge-base.php';
require SGAI_DIR . '/inc/agents.php';
require SGAI_DIR . '/inc/case-studies.php';
require SGAI_DIR . '/inc/chats.php';
require SGAI_DIR . '/inc/seo.php';
require SGAI_DIR . '/inc/llms.php';
require SGAI_DIR . '/inc/installer.php';

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'responsive-embeds' );
	register_nav_menus( array( 'primary' => 'Primary' ) );
} );

/* Elementor: let Elementor-built pages use the theme header and footer. */
add_action( 'elementor/theme/register_locations', function ( $m ) { $m->register_all_core_location(); } );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'sgai', SGAI_URI . '/assets/css/sgai.css', array(), SGAI_VER );
	wp_enqueue_script( 'sgai-content', SGAI_URI . '/assets/js/sg-content.js', array(), SGAI_VER, true );
	wp_enqueue_script( 'sgai', SGAI_URI . '/assets/js/sgai.js', array( 'sgai-content' ), SGAI_VER, true );
	wp_enqueue_script( 'sgai-tools', SGAI_URI . '/assets/js/sg-tools.js', array( 'sgai' ), SGAI_VER, true );
	wp_localize_script( 'sgai-content', 'SGAI', array(
		'ajaxUrl'    => admin_url( 'admin-ajax.php' ),
		'nonce'      => wp_create_nonce( 'sgai_lead' ),
		'contactUrl' => home_url( '/contact/' ),
		'kbUrl'      => rest_url( 'sgai/v1/kb' ),
	) );
	// Keep pages light: no block-library CSS on the custom pages.
	if ( is_page() && get_post_meta( get_the_ID(), '_sgai_page', true ) ) {
		wp_dequeue_style( 'wp-block-library' ); wp_dequeue_style( 'global-styles' ); wp_dequeue_style( 'classic-theme-styles' );
	}
} );

add_filter( 'script_loader_tag', function ( $tag, $handle ) {
	if ( in_array( $handle, array( 'sgai-content', 'sgai', 'sgai-tools' ), true ) ) $tag = str_replace( ' src=', ' defer src=', $tag );
	return $tag;
}, 10, 2 );

add_action( 'wp_head', function () {
	echo '<link rel="preload" href="' . esc_url( SGAI_URI . '/assets/fonts/inter-var-latin.woff2' ) . '" as="font" type="font/woff2" crossorigin>' . "\n";
	echo '<meta name="theme-color" content="#010204">' . "\n";
	echo '<link rel="icon" href="' . esc_url( SGAI_URI . '/assets/img/favicon.svg' ) . '" type="image/svg+xml">' . "\n";
}, 1 );

/* Tidy the head. */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );

/* The designed pages are hand-built HTML: no auto paragraphs, no texturising of markup. */
add_filter( 'the_content', function ( $c ) {
	if ( is_page() && get_post_meta( get_the_ID(), '_sgai_page', true ) ) {
		remove_filter( 'the_content', 'wpautop' );
		remove_filter( 'the_content', 'wptexturize' );
		remove_filter( 'the_content', 'convert_smilies', 20 );
	}
	return $c;
}, 0 );
add_filter( 'the_content', 'sgai_links', 99 );
