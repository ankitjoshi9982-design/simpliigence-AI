<?php
/**
 * Agent library (AI Agents page). Per the approved copy: "The library renders from the content file.
 * Each agent card has: name, team, what it does in one line, the tools it works in, and a 'Ask about this
 * agent' button that opens the assistant with the agent pre-filled."
 * Add agents in wp-admin → Agent Library. Until at least one is published, the page shows the six
 * approved team cards. Every agent is also added to the assistant's knowledge automatically.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

function sgai_agent_teams() { return array( 'Customer support', 'Sales', 'Finance', 'Operations', 'HR', 'Marketing' ); }

add_action( 'init', function () {
	register_post_type( 'sg_agent', array(
		'labels'       => array( 'name' => 'Agent Library', 'singular_name' => 'Agent', 'add_new_item' => 'Add agent', 'edit_item' => 'Edit agent' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'menu_icon'    => 'dashicons-groups',
		'supports'     => array( 'title', 'page-attributes' ),
	) );
} );

add_action( 'add_meta_boxes_sg_agent', function () {
	add_meta_box( 'sgai_agent', 'Agent card', function ( $post ) {
		wp_nonce_field( 'sgai_agent', 'sgai_agent_nonce' );
		$team = get_post_meta( $post->ID, '_agent_team', true );
		echo '<p><label><strong>Team</strong></label><br><select name="agent_team">';
		foreach ( sgai_agent_teams() as $t ) printf( '<option %s>%s</option>', selected( $team, $t, false ), esc_html( $t ) );
		echo '</select></p>';
		echo '<p><label><strong>What it does (one line)</strong></label><input name="agent_line" style="width:100%" value="' . esc_attr( get_post_meta( $post->ID, '_agent_line', true ) ) . '"></p>';
		echo '<p><label><strong>Tools it works in</strong> (comma-separated)</label><input name="agent_tools" style="width:100%" value="' . esc_attr( get_post_meta( $post->ID, '_agent_tools', true ) ) . '"></p>';
		echo '<p class="description">The agent name is the title above. Order cards with "Order" in Page Attributes.</p>';
	}, 'sg_agent', 'normal', 'high' );
} );
add_action( 'save_post_sg_agent', function ( $id ) {
	if ( ! isset( $_POST['sgai_agent_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['sgai_agent_nonce'] ) ), 'sgai_agent' ) || ! current_user_can( 'edit_post', $id ) ) return;
	foreach ( array( 'team', 'line', 'tools' ) as $f ) update_post_meta( $id, '_agent_' . $f, sanitize_text_field( wp_unslash( $_POST[ 'agent_' . $f ] ?? '' ) ) );
	delete_transient( 'sgai_kb_json' );
} );
add_filter( 'manage_sg_agent_posts_columns', function ( $c ) { return array( 'cb' => $c['cb'], 'title' => 'Agent', 'team' => 'Team', 'line' => 'What it does', 'date' => 'Date' ); } );
add_action( 'manage_sg_agent_posts_custom_column', function ( $col, $id ) { echo esc_html( get_post_meta( $id, '_agent_' . $col, true ) ); }, 10, 2 );

function sgai_agents() {
	$out = array();
	foreach ( get_posts( array( 'post_type' => 'sg_agent', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'menu_order title', 'order' => 'ASC' ) ) as $p ) {
		$out[] = array( 'name' => $p->post_title, 'team' => get_post_meta( $p->ID, '_agent_team', true ), 'line' => get_post_meta( $p->ID, '_agent_line', true ), 'tools' => get_post_meta( $p->ID, '_agent_tools', true ) );
	}
	return $out;
}

/* Swap the six team cards for the real library once agents exist. */
add_filter( 'the_content', function ( $html ) {
	if ( false === strpos( $html, '<!--sg:library-->' ) ) return $html;
	$agents = sgai_agents();
	if ( ! $agents ) return $html;
	$teams = array_values( array_unique( array_filter( wp_list_pluck( $agents, 'team' ) ) ) );
	$cards = '<div class="lib-filter" role="tablist"><button class="chip on" type="button" data-team-f="">All</button>';
	foreach ( $teams as $t ) $cards .= '<button class="chip" type="button" data-team-f="' . esc_attr( $t ) . '">' . esc_html( $t ) . '</button>';
	$cards .= '</div><div class="swipe g3 mt-m agent-grid">';
	foreach ( $agents as $a ) {
		$tools = array_filter( array_map( 'trim', explode( ',', $a['tools'] ) ) );
		$cards .= '<article class="card agent-card" data-team="' . esc_attr( $a['team'] ) . '"><span class="ci"><svg class="ico" aria-hidden="true"><use href="#i-bot"/></svg></span>'
			. '<span class="k">' . esc_html( $a['team'] ) . '</span><h3>' . esc_html( $a['name'] ) . '</h3><p>' . esc_html( $a['line'] ) . '</p>'
			. ( $tools ? '<div class="chips">' . implode( '', array_map( function ( $t ) { return '<span class="chip">' . esc_html( $t ) . '</span>'; }, $tools ) ) . '</div>' : '' )
			. '<button class="link" type="button" data-ask="' . esc_attr( $a['name'] ) . '">Ask about this agent<svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></button></article>';
	}
	$cards .= '</div>';
	return preg_replace( '#<!--sg:library-->.*?<!--/sg:library-->#s', $cards, $html );
}, 20 );

/* Agents are part of the assistant's knowledge. */
add_filter( 'sgai_kb_rows', function ( $rows ) {
	$home = untrailingslashit( home_url() );
	foreach ( sgai_agents() as $a ) {
		$rows[] = array( 'title' => 'AI Agents — ' . $a['name'], 'url' => $home . '/agents/#library',
			'excerpt' => trim( $a['name'] . '. ' . $a['line'] . ( $a['tools'] ? ' Works in ' . $a['tools'] . '.' : '' ) ),
			'body' => $a['team'] . ' ' . $a['line'] . ' ' . $a['tools'], 'keywords' => array( strtolower( $a['name'] ), strtolower( $a['team'] ) . ' agent' ), 'weight' => 1.1 );
	}
	return $rows;
} );
