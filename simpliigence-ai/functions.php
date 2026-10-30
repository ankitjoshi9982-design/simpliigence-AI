<?php
/**
 * Simpliigence AI theme — functions
 * Lightweight, no page-builder bloat in the rendered markup, Elementor-compatible.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'SGAI_VER', '1.0.0' );

/* ---------------------------------------------------------------
 * Theme setup
 * ------------------------------------------------------------- */
function sgai_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );

	// Elementor compatibility
	add_theme_support( 'elementor' );
	add_theme_support( 'align-wide' );

	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'sgai' ),
		'mobile'  => __( 'Mobile Menu', 'sgai' ),
	) );
}
add_action( 'after_setup_theme', 'sgai_setup' );

// Let Elementor control full-width templates cleanly (no theme padding fights)
function sgai_elementor_support() {
	add_theme_support( 'elementor' );
}
add_action( 'after_setup_theme', 'sgai_elementor_support' );

/* ---------------------------------------------------------------
 * Assets — single CSS file, two small JS files, no framework.
 * Fonts & icons preconnected; everything else self-hosted-ready.
 * ------------------------------------------------------------- */
function sgai_assets() {
	wp_enqueue_style( 'sgai-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap', array(), null );
	wp_enqueue_style( 'sgai-icons', 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css', array(), null );
	wp_enqueue_style( 'sgai-style', get_template_directory_uri() . '/style.css', array(), SGAI_VER );

	wp_enqueue_script( 'sgai-content', get_template_directory_uri() . '/js/sg-content.js', array(), SGAI_VER, true );
	wp_enqueue_script( 'sgai-main', get_template_directory_uri() . '/js/sg-main.js', array( 'sgai-content' ), SGAI_VER, true );
	wp_enqueue_script( 'sgai-assistant', get_template_directory_uri() . '/js/sg-assistant.js', array( 'sgai-content' ), SGAI_VER, true );
	wp_enqueue_script( 'sgai-tools', get_template_directory_uri() . '/js/sg-tools.js', array( 'sgai-main' ), SGAI_VER, true );

	wp_localize_script( 'sgai-content', 'SGAI', array(
		'ajaxUrl'    => admin_url( 'admin-ajax.php' ),
		'nonce'      => wp_create_nonce( 'sgai_lead' ),
		'contactUrl' => home_url( '/contact/' ),
		'privacyUrl' => get_privacy_policy_url() ? get_privacy_policy_url() : home_url( '/contact/' ),
		'root'       => '',
	) );
}
add_action( 'wp_enqueue_scripts', 'sgai_assets' );

// Preconnect for fonts/icons (speed)
function sgai_resource_hints( $hints, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$hints[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' => true );
		$hints[] = array( 'href' => 'https://fonts.googleapis.com' );
	}
	return $hints;
}
add_filter( 'wp_resource_hints', 'sgai_resource_hints', 10, 2 );

/* ---------------------------------------------------------------
 * Performance: strip default WP bloat that hurts PageSpeed
 * ------------------------------------------------------------- */
function sgai_performance_cleanup() {
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'wlwmanifest_link' );
	remove_action( 'wp_head', 'wp_generator' );
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'wp_head', 'wp_shortlink_wp_head' );
	remove_action( 'wp_head', 'feed_links_extra', 3 );
	remove_action( 'wp_head', 'rest_output_link_wp_head' );
	add_filter( 'emoji_svg_url', '__return_false' );
}
add_action( 'init', 'sgai_performance_cleanup' );

// Defer non-critical JS
function sgai_defer_scripts( $tag, $handle, $src ) {
	$defer = array( 'sgai-main', 'sgai-assistant', 'sgai-content', 'sgai-tools' );
	if ( in_array( $handle, $defer, true ) ) {
		return str_replace( ' src', ' defer src', $tag );
	}
	return $tag;
}
add_filter( 'script_loader_tag', 'sgai_defer_scripts', 10, 3 );

// Lazy-load is native via loading="lazy" on <img> — WP core adds this by default on 5.5+.

/* ---------------------------------------------------------------
 * The approved copy is full semantic HTML (sections, divs, lists),
 * imported as each page's content. wpautop would wrap block-level
 * markup in stray <p> tags and break the layout, so it is switched
 * off for page content — this also matches how Elementor itself
 * treats a page it is editing, so nothing fights it.
 * ------------------------------------------------------------- */
remove_filter( 'the_content', 'wpautop' );


/* ---------------------------------------------------------------
 * Load includes
 * ------------------------------------------------------------- */
require get_template_directory() . '/inc/schema.php';
require get_template_directory() . '/inc/leads.php';
require get_template_directory() . '/inc/llms-sitemap.php';
require get_template_directory() . '/inc/widgets-areas.php';
