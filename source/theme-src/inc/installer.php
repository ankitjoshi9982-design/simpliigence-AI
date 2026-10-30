<?php
/**
 * One-click page installer (Appearance → Simpliigence AI).
 * Creates the 9 designed pages from the approved copy, sets Home as the front page, writes the approved
 * SEO titles/descriptions into Yoast or Rank Math, and fills the assistant's Knowledge Base.
 *
 * SAFE BY DEFAULT: a page someone has edited in WordPress is never overwritten unless you tick
 * "Also replace pages that were edited" — so updating the theme can't wipe your team's changes.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

function sgai_install( $force = false ) {
	$seo = sgai_data( 'seo.json' );
	$log = array();
	if ( ! get_option( 'permalink_structure' ) ) update_option( 'permalink_structure', '/%postname%/' );
	if ( function_exists( 'kses_remove_filters' ) ) kses_remove_filters();
	foreach ( $seo as $key => $s ) {
		$html = sgai_data( 'content/' . $key . '.html' );
		if ( ! $html ) continue;
		$slug = 'home' === $key ? 'home' : trim( $s['url'], '/' );
		$found = get_posts( array( 'post_type' => 'page', 'post_status' => 'any', 'meta_key' => '_sgai_page', 'meta_value' => $key, 'numberposts' => 1 ) );
		$page  = $found ? $found[0] : get_page_by_path( $slug );
		$hash  = md5( $html );
		if ( $page ) {
			$edited = get_post_meta( $page->ID, '_sgai_hash', true ) !== md5( $page->post_content );
			if ( $edited && ! $force && get_post_meta( $page->ID, '_sgai_hash', true ) ) { $log[] = "{$s['label']}: kept (edited in WordPress)"; continue; }
			if ( get_post_meta( $page->ID, '_sgai_hash', true ) === $hash && ! $force ) { $log[] = "{$s['label']}: already up to date"; continue; }
		}
		$id = wp_insert_post( wp_slash( array(
			'ID'           => $page ? $page->ID : 0,
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $s['label'],
			'post_name'    => $slug,
			'post_content' => $html,
			'post_excerpt' => $s['meta'],
		) ) );
		if ( ! $id || is_wp_error( $id ) ) { $log[] = "{$s['label']}: could not be saved"; continue; }
		update_post_meta( $id, '_sgai_page', $key );
		update_post_meta( $id, '_sgai_hash', md5( get_post_field( 'post_content', $id ) ) );
		update_post_meta( $id, '_wp_page_template', 'default' );
		// Approved SEO title + description for whichever SEO plugin is (or will be) used.
		update_post_meta( $id, '_yoast_wpseo_title', $s['title'] );
		update_post_meta( $id, '_yoast_wpseo_metadesc', $s['meta'] );
		update_post_meta( $id, '_yoast_wpseo_focuskw', $s['keyword'] );
		update_post_meta( $id, 'rank_math_title', $s['title'] );
		update_post_meta( $id, 'rank_math_description', $s['meta'] );
		update_post_meta( $id, 'rank_math_focus_keyword', $s['keyword'] );
		if ( 'home' === $key ) { update_option( 'show_on_front', 'page' ); update_option( 'page_on_front', $id ); }
		$log[] = "{$s['label']}: " . ( $page ? 'updated' : 'created' );
	}
	if ( function_exists( 'kses_init_filters' ) ) kses_init_filters();
	$log[] = 'Knowledge Base: ' . sgai_kb_seed() . ' entries added or refreshed';
	update_option( 'blogdescription', 'Outcomes, by design.' );
	update_option( 'sgai_installed', SGAI_VER );
	flush_rewrite_rules();
	return $log;
}

/* First activation: build anything that's missing (never overwrites). */
add_action( 'after_switch_theme', function () { if ( ! get_option( 'sgai_installed' ) ) sgai_install( false ); } );

add_action( 'admin_menu', function () {
	add_theme_page( 'Simpliigence AI', 'Simpliigence AI', 'manage_options', 'sgai-setup', 'sgai_setup_screen' );
} );

function sgai_setup_screen() {
	if ( ! current_user_can( 'manage_options' ) ) return;
	$log = null;
	if ( isset( $_POST['sgai_go'] ) && check_admin_referer( 'sgai_setup' ) ) $log = sgai_install( ! empty( $_POST['sgai_force'] ) );
	$kb  = wp_count_posts( 'sg_kb' );
	echo '<div class="wrap"><h1>Simpliigence AI</h1>';
	echo '<p>Installs or updates the 9 designed pages, sets Home as the front page, writes the approved SEO titles and descriptions, and fills the assistant\'s Knowledge Base.</p>';
	if ( $log ) echo '<div class="notice notice-success"><p>' . implode( '<br>', array_map( 'esc_html', $log ) ) . '</p></div>';
	echo '<form method="post">';
	wp_nonce_field( 'sgai_setup' );
	echo '<p><label><input type="checkbox" name="sgai_force" value="1"> Also replace pages that were edited in WordPress <strong>(overwrites your team\'s changes)</strong></label></p>';
	submit_button( 'Install / update pages', 'primary', 'sgai_go' );
	echo '</form>';
	echo '<h2>Status</h2><ul>';
	echo '<li>Knowledge Base entries: ' . (int) ( $kb->publish ?? 0 ) . ' (<a href="' . esc_url( admin_url( 'edit.php?post_type=sg_kb' ) ) . '">manage</a>)</li>';
	echo '<li>Leads: <a href="' . esc_url( admin_url( 'edit.php?post_type=sg_lead' ) ) . '">view</a> · emailed to hello@simpliigence.ai once SMTP is configured</li>';
	echo '<li>AI-readable files: <a href="' . esc_url( home_url( '/llms.txt' ) ) . '" target="_blank">/llms.txt</a> · <a href="' . esc_url( home_url( '/llms-full.txt' ) ) . '" target="_blank">/llms-full.txt</a></li>';
	echo '<li>Privacy links: ' . ( get_privacy_policy_url() ? 'go to your Privacy Policy page' : '<strong>set a Privacy Policy page in Settings → Privacy</strong>' ) . '</li>';
	echo '</ul></div>';
}
