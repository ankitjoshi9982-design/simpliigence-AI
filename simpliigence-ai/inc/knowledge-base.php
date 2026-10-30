<?php
/**
 * Knowledge Base — the assistant's backend.
 * Per the approved copy: "The assistant replaces site search on every page and answers only from the
 * knowledge base. Everything on this page goes into the knowledge base as approved content."
 * Every page section and every FAQ is an entry here (seeded by the installer). Edit or add entries in
 * wp-admin → Knowledge Base; the assistant reads them through /wp-json/sgai/v1/kb.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'init', function () {
	register_post_type( 'sg_kb', array(
		'labels'       => array( 'name' => 'Knowledge Base', 'singular_name' => 'Knowledge entry', 'add_new_item' => 'Add knowledge entry', 'edit_item' => 'Edit knowledge entry' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'menu_icon'    => 'dashicons-format-chat',
		'supports'     => array( 'title', 'editor' ),
		'show_in_rest' => false,
	) );
} );

/* Fields: answer shown in chat (excerpt), link, extra search words. */
add_action( 'add_meta_boxes_sg_kb', function () {
	add_meta_box( 'sgai_kb', 'Assistant answer', function ( $post ) {
		wp_nonce_field( 'sgai_kb', 'sgai_kb_nonce' );
		$ex = get_post_meta( $post->ID, '_kb_excerpt', true );
		$url = get_post_meta( $post->ID, '_kb_url', true );
		$kw = get_post_meta( $post->ID, '_kb_keywords', true );
		echo '<p><label><strong>Answer shown in the chat</strong> (2–3 lines, approved wording)</label><textarea name="kb_excerpt" rows="4" style="width:100%">' . esc_textarea( $ex ) . '</textarea></p>';
		echo '<p><label><strong>"Read more" link</strong> (e.g. /ai/#faq)</label><input name="kb_url" style="width:100%" value="' . esc_attr( $url ) . '"></p>';
		echo '<p><label><strong>Extra search words</strong> (comma-separated, never shown)</label><input name="kb_keywords" style="width:100%" value="' . esc_attr( $kw ) . '"></p>';
		echo '<p class="description">The main text box above holds the full section text the assistant searches.</p>';
	}, 'sg_kb', 'normal', 'high' );
} );
add_action( 'save_post_sg_kb', function ( $id ) {
	if ( ! isset( $_POST['sgai_kb_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['sgai_kb_nonce'] ) ), 'sgai_kb' ) ) return;
	if ( ! current_user_can( 'edit_post', $id ) ) return;
	update_post_meta( $id, '_kb_excerpt', sanitize_textarea_field( wp_unslash( $_POST['kb_excerpt'] ?? '' ) ) );
	update_post_meta( $id, '_kb_url', sanitize_text_field( wp_unslash( $_POST['kb_url'] ?? '' ) ) );
	update_post_meta( $id, '_kb_keywords', sanitize_text_field( wp_unslash( $_POST['kb_keywords'] ?? '' ) ) );
	delete_transient( 'sgai_kb_json' );
} );
add_action( 'deleted_post', function () { delete_transient( 'sgai_kb_json' ); } );
add_action( 'trashed_post', function () { delete_transient( 'sgai_kb_json' ); } );

add_filter( 'manage_sg_kb_posts_columns', function ( $c ) { return array( 'cb' => $c['cb'], 'title' => 'Entry', 'kb_url' => 'Read more link', 'date' => 'Date' ); } );
add_action( 'manage_sg_kb_posts_custom_column', function ( $col, $id ) { if ( 'kb_url' === $col ) echo esc_html( get_post_meta( $id, '_kb_url', true ) ); }, 10, 2 );

/** Seed / refresh entries from data/kb.json (only entries the team hasn't edited). */
function sgai_kb_seed() {
	$rows = sgai_data( 'kb.json' );
	if ( ! is_array( $rows ) ) return 0;
	$n = 0;
	foreach ( $rows as $i => $r ) {
		$uid = md5( $r['title'] . '|' . $r['url'] );
		$existing = get_posts( array( 'post_type' => 'sg_kb', 'post_status' => 'any', 'meta_key' => '_kb_uid', 'meta_value' => $uid, 'numberposts' => 1, 'fields' => 'ids' ) );
		if ( $existing && get_post_meta( $existing[0], '_kb_edited', true ) ) continue;
		$id = wp_insert_post( array( 'ID' => $existing ? $existing[0] : 0, 'post_type' => 'sg_kb', 'post_status' => 'publish', 'post_title' => $r['title'], 'post_content' => $r['body'] ?? $r['excerpt'], 'menu_order' => $i ) );
		if ( ! $id || is_wp_error( $id ) ) continue;
		update_post_meta( $id, '_kb_uid', $uid );
		update_post_meta( $id, '_kb_excerpt', $r['excerpt'] );
		update_post_meta( $id, '_kb_url', $r['url'] );
		update_post_meta( $id, '_kb_keywords', implode( ', ', $r['keywords'] ?? array() ) );
		update_post_meta( $id, '_kb_weight', isset( $r['weight'] ) ? (float) $r['weight'] : 1 );
		$n++;
	}
	delete_transient( 'sgai_kb_json' );
	return $n;
}
/* Anything saved by a person from the editor is marked edited, so a re-seed never overwrites it. */
add_action( 'save_post_sg_kb', function ( $id ) { if ( isset( $_POST['sgai_kb_nonce'] ) ) update_post_meta( $id, '_kb_edited', 1 ); }, 20 );

add_action( 'rest_api_init', function () {
	register_rest_route( 'sgai/v1', '/kb', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$out = get_transient( 'sgai_kb_json' );
			if ( false === $out ) {
				$out  = array();
				$home = untrailingslashit( home_url() );
				foreach ( get_posts( array( 'post_type' => 'sg_kb', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'menu_order', 'order' => 'ASC' ) ) as $p ) {
					$url = get_post_meta( $p->ID, '_kb_url', true );
					$kw  = array_filter( array_map( 'trim', explode( ',', (string) get_post_meta( $p->ID, '_kb_keywords', true ) ) ) );
					$out[] = array(
						'title'    => $p->post_title,
						'url'      => ( $url && '/' === $url[0] ) ? $home . $url : $url,
						'excerpt'  => get_post_meta( $p->ID, '_kb_excerpt', true ) ?: wp_trim_words( wp_strip_all_tags( $p->post_content ), 50 ),
						'body'     => wp_strip_all_tags( $p->post_content ),
						'keywords' => array_values( $kw ),
						'weight'   => (float) ( get_post_meta( $p->ID, '_kb_weight', true ) ?: 1 ),
					);
				}
				$out = apply_filters( 'sgai_kb_rows', $out );
				set_transient( 'sgai_kb_json', $out, DAY_IN_SECONDS );
			}
			$res = rest_ensure_response( $out );
			$res->header( 'Cache-Control', 'public, max-age=600' );
			return $res;
		},
	) );
} );
