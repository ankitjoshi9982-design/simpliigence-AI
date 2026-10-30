<?php
/**
 * SEO + GEO/AEO.
 * - Titles and meta descriptions are the approved ones (data/seo.json).
 * - If Yoast SEO or Rank Math is active, they own title/meta/canonical/OG; the installer writes the
 *   approved title + description into their fields, and this file only adds FAQPage + Service schema.
 * - With no SEO plugin, this file outputs everything: title, description, canonical, Open Graph,
 *   Twitter and one JSON-LD @graph (Organization, WebSite, WebPage, BreadcrumbList, Service, FAQPage).
 */
if ( ! defined( 'ABSPATH' ) ) exit;

function sgai_seo_plugin() { return defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' ); }

function sgai_seo() {
	$key = sgai_page_key();
	$all = sgai_data( 'seo.json' );
	return ( $key && isset( $all[ $key ] ) ) ? $all[ $key ] : null;
}

/** Swap the build's domain for this site's real URL, recursively. */
function sgai_localise( $v ) {
	if ( is_array( $v ) ) return array_map( 'sgai_localise', $v );
	if ( ! is_string( $v ) ) return $v;
	$v = str_replace( 'https://simpliigence.ai/wp-content/themes/simpliigence-ai', SGAI_URI, $v );
	return str_replace( 'https://simpliigence.ai', untrailingslashit( home_url() ), $v );
}

add_filter( 'pre_get_document_title', function ( $t ) {
	if ( sgai_seo_plugin() ) return $t;
	$s = sgai_seo();
	return $s ? $s['title'] : $t;
}, 20 );

add_action( 'wp_head', function () {
	$s = sgai_seo();
	if ( ! $s ) return;
	$graph = sgai_localise( $s['graph'] );
	if ( sgai_seo_plugin() ) {
		$graph = array_values( array_filter( $graph, function ( $n ) { return in_array( $n['@type'], array( 'FAQPage', 'Service' ), true ); } ) );
		if ( ! $graph ) return;
	} else {
		$url = esc_url( sgai_localise( 'https://simpliigence.ai' . $s['url'] ) );
		$t = esc_attr( $s['title'] ); $d = esc_attr( $s['meta'] ); $img = esc_url( SGAI_URI . '/assets/img/og.png' );
		echo "<meta name=\"description\" content=\"{$d}\">\n";
		echo "<meta name=\"robots\" content=\"index,follow,max-image-preview:large,max-snippet:-1\">\n";
		echo "<meta property=\"og:type\" content=\"website\"><meta property=\"og:site_name\" content=\"Simpliigence AI\"><meta property=\"og:title\" content=\"{$t}\"><meta property=\"og:description\" content=\"{$d}\"><meta property=\"og:url\" content=\"{$url}\"><meta property=\"og:image\" content=\"{$img}\"><meta property=\"og:image:width\" content=\"1200\"><meta property=\"og:image:height\" content=\"630\">\n";
		echo "<meta name=\"twitter:card\" content=\"summary_large_image\"><meta name=\"twitter:title\" content=\"{$t}\"><meta name=\"twitter:description\" content=\"{$d}\"><meta name=\"twitter:image\" content=\"{$img}\">\n";
	}
	echo '<script type="application/ld+json">' . wp_json_encode( array( '@context' => 'https://schema.org', '@graph' => $graph ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . "</script>\n";
}, 2 );

/* Leads and knowledge entries never appear in sitemaps or search. */
add_filter( 'wp_sitemaps_post_types', function ( $t ) { unset( $t['sg_lead'], $t['sg_kb'] ); return $t; } );
add_filter( 'wpseo_sitemap_exclude_post_type', function ( $ex, $pt ) { return in_array( $pt, array( 'sg_lead', 'sg_kb' ), true ) ? true : $ex; }, 10, 2 );
