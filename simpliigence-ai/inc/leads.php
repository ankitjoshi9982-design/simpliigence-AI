<?php
/**
 * Lead capture: a lightweight custom post type + AJAX handler.
 * No SMTP is assumed yet — wp_mail() is used so leads start emailing the
 * moment the host's mail / SMTP plugin is configured; leads are also saved
 * as posts so nothing is lost before that is wired up.
 *
 * Fields match both the Contact page form and the assistant's lead-capture
 * flow, as specified in the approved copy: name, work email, company, phone,
 * interest/type, company size, and the process they want to fix.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function sgai_register_lead_cpt() {
	register_post_type( 'sg_lead', array(
		'labels' => array(
			'name'          => 'Leads',
			'singular_name' => 'Lead',
		),
		'public'       => false,
		'show_ui'       => true,
		'show_in_menu'  => true,
		'menu_icon'     => 'dashicons-businessperson',
		'supports'      => array( 'title' ),
		'capability_type' => 'post',
	) );
}
add_action( 'init', 'sgai_register_lead_cpt' );

function sgai_save_lead( $args ) {
	$name    = sanitize_text_field( $args['name'] ?? '' );
	$email   = sanitize_email( $args['email'] ?? '' );
	$company = sanitize_text_field( $args['company'] ?? '' );
	$phone   = sanitize_text_field( $args['phone'] ?? '' );
	$process = sanitize_textarea_field( $args['process'] ?? '' );
	$type    = sanitize_text_field( $args['type'] ?? '' );
	$size    = sanitize_text_field( $args['size'] ?? '' );
	$source  = sanitize_text_field( $args['source'] ?? 'contact' ); // ai-search | assistant | contact | tool-assessment

	$post_id = wp_insert_post( array(
		'post_type'   => 'sg_lead',
		'post_title'  => $name ? $name . ' — ' . $email : $email,
		'post_status' => 'publish',
	) );

	if ( $post_id && ! is_wp_error( $post_id ) ) {
		update_post_meta( $post_id, 'email', $email );
		update_post_meta( $post_id, 'company', $company );
		update_post_meta( $post_id, 'phone', $phone );
		update_post_meta( $post_id, 'process', $process );
		update_post_meta( $post_id, 'lead_type', $type );
		update_post_meta( $post_id, 'company_size', $size );
		update_post_meta( $post_id, 'source', $source );
	}

	$to = 'hello@simpliigence.ai';
	$subject = 'New lead: ' . ( $name ?: $email );
	$body = "A new lead came in from the website.\n\n"
		. "Name: {$name}\nEmail: {$email}\nCompany: {$company}\nPhone: {$phone}\n"
		. "Company size: {$size}\nInterested in: {$type}\nProcess to fix: {$process}\nSource: {$source}\n";
	wp_mail( $to, $subject, $body );

	return $post_id;
}

function sgai_ajax_capture_lead() {
	check_ajax_referer( 'sgai_lead', 'nonce' );
	$post_id = sgai_save_lead( $_POST );
	if ( $post_id ) {
		wp_send_json_success( array( 'message' => 'Thanks. A Solution Architect will reach out within one business day.' ) );
	} else {
		wp_send_json_error( array( 'message' => 'Something went wrong. Please try the contact form instead.' ) );
	}
}
add_action( 'wp_ajax_sgai_capture_lead', 'sgai_ajax_capture_lead' );
add_action( 'wp_ajax_nopriv_sgai_capture_lead', 'sgai_ajax_capture_lead' );
