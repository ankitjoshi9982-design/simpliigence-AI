<?php
/**
 * Case studies (Resources page). Per the approved copy: "Each row opens a short case study: the problem,
 * what we built, the result, and a quote from the client in their own words where we have approval."
 * Add one in wp-admin → Case Studies and pick its results-table row; that row then links to it.
 * Client names are never shown — the row label (industry and country) is the heading.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

function sgai_case_rows() {
	return array( 'Real estate operator, Netherlands', 'Industrial manufacturer, 12 countries', 'Industrial manufacturer', 'Payments institution, UK', 'Field services contractor, US', 'Manufacturer, US', 'Supplier, US', 'Home services company, US' );
}

add_action( 'init', function () {
	register_post_type( 'sg_case', array(
		'labels'       => array( 'name' => 'Case Studies', 'singular_name' => 'Case study', 'add_new_item' => 'Add case study', 'edit_item' => 'Edit case study' ),
		'public'       => true,
		'show_in_menu' => true,
		'menu_icon'    => 'dashicons-chart-line',
		'supports'     => array( 'title' ),
		'rewrite'      => array( 'slug' => 'resources/case-studies' ),
		'has_archive'  => false,
	) );
} );

function sgai_case_fields() { return array( 'problem' => 'The problem', 'built' => 'What we built', 'result' => 'The result', 'quote' => 'Client quote (only with approval)' ); }

add_action( 'add_meta_boxes_sg_case', function () {
	add_meta_box( 'sgai_case', 'Case study', function ( $post ) {
		wp_nonce_field( 'sgai_case', 'sgai_case_nonce' );
		$row = get_post_meta( $post->ID, '_case_row', true );
		echo '<p><label><strong>Results-table row</strong></label><br><select name="case_row"><option value="">—</option>';
		foreach ( sgai_case_rows() as $r ) printf( '<option %s>%s</option>', selected( $row, $r, false ), esc_html( $r ) );
		echo '</select></p>';
		foreach ( sgai_case_fields() as $k => $label ) echo '<p><label><strong>' . esc_html( $label ) . '</strong></label><textarea name="case_' . esc_attr( $k ) . '" rows="4" style="width:100%">' . esc_textarea( get_post_meta( $post->ID, '_case_' . $k, true ) ) . '</textarea></p>';
		echo '<p class="description">No client names. Use the industry and country only.</p>';
	}, 'sg_case', 'normal', 'high' );
} );
add_action( 'save_post_sg_case', function ( $id ) {
	if ( ! isset( $_POST['sgai_case_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['sgai_case_nonce'] ) ), 'sgai_case' ) || ! current_user_can( 'edit_post', $id ) ) return;
	update_post_meta( $id, '_case_row', sanitize_text_field( wp_unslash( $_POST['case_row'] ?? '' ) ) );
	foreach ( array_keys( sgai_case_fields() ) as $k ) update_post_meta( $id, '_case_' . $k, sanitize_textarea_field( wp_unslash( $_POST[ 'case_' . $k ] ?? '' ) ) );
	delete_transient( 'sgai_kb_json' );
} );

function sgai_cases() {
	$out = array();
	foreach ( get_posts( array( 'post_type' => 'sg_case', 'post_status' => 'publish', 'numberposts' => -1 ) ) as $p ) {
		$out[] = array( 'id' => $p->ID, 'title' => $p->post_title, 'row' => get_post_meta( $p->ID, '_case_row', true ), 'url' => get_permalink( $p ) ) + array_combine( array_keys( sgai_case_fields() ), array_map( function ( $k ) use ( $p ) { return get_post_meta( $p->ID, '_case_' . $k, true ); }, array_keys( sgai_case_fields() ) ) );
	}
	return $out;
}

/* Results rows that have a case study become links. */
add_filter( 'the_content', function ( $html ) {
	if ( false === strpos( $html, 'data-case=' ) ) return $html;
	foreach ( sgai_cases() as $c ) {
		if ( ! $c['row'] ) continue;
		$needle = '<div class="rt-row" role="row" data-case="' . $c['row'] . '">';
		$html = str_replace( $needle, '<a class="rt-row is-link" role="row" href="' . esc_url( $c['url'] ) . '" data-case="' . esc_attr( $c['row'] ) . '">', $html, $n );
		if ( $n ) $html = preg_replace( '#(<a class="rt-row is-link"[^>]*data-case="' . preg_quote( esc_attr( $c['row'] ), '#' ) . '">.*?)</div>#s', '$1</a>', $html, 1 );
	}
	return $html;
}, 20 );

/* Single case study page. */
add_filter( 'template_include', function ( $t ) { return is_singular( 'sg_case' ) ? SGAI_DIR . '/single-sg_case.php' : $t; } );

add_filter( 'sgai_kb_rows', function ( $rows ) {
	foreach ( sgai_cases() as $c ) {
		$rows[] = array( 'title' => 'Resources — ' . ( $c['row'] ?: $c['title'] ), 'url' => $c['url'], 'excerpt' => trim( $c['result'] ?: $c['problem'] ),
			'body' => implode( ' ', array( $c['problem'], $c['built'], $c['result'] ) ), 'keywords' => array( 'case study', strtolower( (string) $c['row'] ) ) );
	}
	return $rows;
} );
