<?php
/**
 * Leads from the contact form, the assistant and the tools.
 * Saved in wp-admin → Leads, and emailed to hello@simpliigence.ai through wp_mail()
 * (works as soon as the site's SMTP is configured; nothing is lost before then).
 */
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'init', function () {
	register_post_type( 'sg_lead', array(
		'labels'          => array( 'name' => 'Leads', 'singular_name' => 'Lead' ),
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => true,
		'menu_icon'       => 'dashicons-businessperson',
		'supports'        => array( 'title' ),
		'capability_type' => 'post',
		'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
		'map_meta_cap'    => true,
	) );
} );

function sgai_lead_fields() {
	return array( 'email' => 'Work email', 'company' => 'Company', 'phone' => 'Phone', 'lead_type' => "I'd like to", 'company_size' => 'Company size', 'route' => 'Route to', 'process' => 'Process', 'source' => 'Source' );
}

function sgai_save_lead( $in ) {
	$f = array(
		'name'         => sanitize_text_field( $in['name'] ?? '' ),
		'email'        => sanitize_email( $in['email'] ?? '' ),
		'company'      => sanitize_text_field( $in['company'] ?? '' ),
		'phone'        => sanitize_text_field( $in['phone'] ?? '' ),
		'process'      => sanitize_textarea_field( $in['process'] ?? '' ),
		'lead_type'    => sanitize_text_field( $in['type'] ?? '' ),
		'company_size' => sanitize_text_field( $in['size'] ?? '' ),
		'route'        => sanitize_text_field( $in['route'] ?? '' ),
		'source'       => sanitize_text_field( $in['source'] ?? 'contact' ),
		'chat_session' => preg_replace( '/[^a-zA-Z0-9-]/', '', (string) ( $in['session'] ?? '' ) ),
	);
	if ( ! is_email( $f['email'] ) ) return false;
	$id = wp_insert_post( array( 'post_type' => 'sg_lead', 'post_status' => 'publish', 'post_title' => trim( $f['name'] . ' — ' . $f['email'], ' —' ) ) );
	if ( ! $id || is_wp_error( $id ) ) return false;
	foreach ( $f as $k => $v ) if ( 'name' !== $k ) update_post_meta( $id, $k, $v );

	$body = "A new lead came in from the website.\n\nName: {$f['name']}\n";
	foreach ( sgai_lead_fields() as $k => $label ) $body .= "{$label}: {$f[$k]}\n";
	wp_mail( apply_filters( 'sgai_lead_to', 'hello@simpliigence.ai' ), 'New lead: ' . ( $f['name'] ?: $f['email'] ), $body, array( 'Reply-To: ' . $f['email'] ) );
	return $id;
}

function sgai_ajax_capture_lead() {
	check_ajax_referer( 'sgai_lead', 'nonce' );
	if ( ! empty( $_POST['website'] ) ) wp_send_json_success(); // honeypot
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
	$key = 'sgai_rl_' . md5( $ip );
	$n   = (int) get_transient( $key );
	if ( $n > 10 ) wp_send_json_error( null, 429 );
	set_transient( $key, $n + 1, HOUR_IN_SECONDS );
	$id = sgai_save_lead( wp_unslash( $_POST ) );
	$id ? wp_send_json_success() : wp_send_json_error();
}
add_action( 'wp_ajax_sgai_capture_lead', 'sgai_ajax_capture_lead' );
add_action( 'wp_ajax_nopriv_sgai_capture_lead', 'sgai_ajax_capture_lead' );

/* Columns + detail box in wp-admin. */
add_filter( 'manage_sg_lead_posts_columns', function ( $c ) {
	return array( 'cb' => $c['cb'], 'title' => 'Lead', 'lead_type' => "I'd like to", 'company' => 'Company', 'company_size' => 'Size', 'source' => 'Source', 'date' => 'Date' );
} );
add_action( 'manage_sg_lead_posts_custom_column', function ( $col, $id ) { echo esc_html( get_post_meta( $id, $col, true ) ); }, 10, 2 );
add_action( 'add_meta_boxes_sg_lead', function () {
	add_meta_box( 'sgai_lead', 'Lead details', function ( $post ) {
		echo '<table class="form-table">';
		foreach ( sgai_lead_fields() as $k => $label ) printf( '<tr><th>%s</th><td>%s</td></tr>', esc_html( $label ), nl2br( esc_html( get_post_meta( $post->ID, $k, true ) ) ) );
		echo '</table>';
	}, 'sg_lead', 'normal', 'high' );
} );
