<?php
/**
 * Chat history. The copy's privacy line says "Chats are stored to improve our answers", so every assistant
 * conversation is saved in the site's database (table {prefix}sgai_chats).
 * wp-admin → Chat History: every conversation, plus "Unanswered questions" (what the Knowledge Base
 * couldn't answer, so the team knows what to add). Names/emails typed during the Health Check sign-up are
 * not stored in the chat (they're in Leads). Chats older than the retention period are deleted daily.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

define( 'SGAI_CHAT_DB', '1' );
function sgai_chat_table() { global $wpdb; return $wpdb->prefix . 'sgai_chats'; }

function sgai_chat_install() {
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	$t = sgai_chat_table(); $c = $wpdb->get_charset_collate();
	dbDelta( "CREATE TABLE {$t} (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		session_id varchar(40) NOT NULL,
		created_at datetime NOT NULL,
		page varchar(190) NOT NULL DEFAULT '',
		role varchar(8) NOT NULL,
		message text NOT NULL,
		matched varchar(255) NOT NULL DEFAULT '',
		answered tinyint(1) NOT NULL DEFAULT 1,
		PRIMARY KEY  (id),
		KEY session_id (session_id),
		KEY created_at (created_at),
		KEY answered (answered)
	) {$c};" );
	update_option( 'sgai_chat_db', SGAI_CHAT_DB );
}
add_action( 'after_switch_theme', 'sgai_chat_install' );
add_action( 'init', function () { if ( get_option( 'sgai_chat_db' ) !== SGAI_CHAT_DB ) sgai_chat_install(); } );

/* Save messages from the assistant (batched by the browser). */
function sgai_ajax_chat_log() {
	check_ajax_referer( 'sgai_lead', 'nonce' );
	global $wpdb;
	$sid  = preg_replace( '/[^a-zA-Z0-9-]/', '', (string) ( $_POST['session'] ?? '' ) );
	$page = esc_url_raw( wp_unslash( $_POST['page'] ?? '' ) );
	$rows = json_decode( wp_unslash( $_POST['items'] ?? '[]' ), true );
	if ( ! $sid || ! is_array( $rows ) ) wp_send_json_error();
	$key = 'sgai_cl_' . md5( $sid );
	$n   = (int) get_transient( $key );
	if ( $n > 200 ) wp_send_json_error( null, 429 );
	set_transient( $key, $n + count( $rows ), HOUR_IN_SECONDS );
	foreach ( array_slice( $rows, 0, 20 ) as $r ) {
		$role = ( ( $r['role'] ?? '' ) === 'bot' ) ? 'bot' : 'user';
		$wpdb->insert( sgai_chat_table(), array(
			'session_id' => substr( $sid, 0, 40 ),
			'created_at' => current_time( 'mysql', true ),
			'page'       => substr( wp_parse_url( $page, PHP_URL_PATH ) ?: '/', 0, 190 ),
			'role'       => $role,
			'message'    => mb_substr( sanitize_textarea_field( (string) ( $r['text'] ?? '' ) ), 0, 2000 ),
			'matched'    => mb_substr( sanitize_text_field( (string) ( $r['matched'] ?? '' ) ), 0, 255 ),
			'answered'   => empty( $r['unanswered'] ) ? 1 : 0,
		) );
	}
	wp_send_json_success();
}
add_action( 'wp_ajax_sgai_chat_log', 'sgai_ajax_chat_log' );
add_action( 'wp_ajax_nopriv_sgai_chat_log', 'sgai_ajax_chat_log' );

/* Retention. */
add_action( 'init', function () { if ( ! wp_next_scheduled( 'sgai_chat_cleanup' ) ) wp_schedule_event( time() + 3600, 'daily', 'sgai_chat_cleanup' ); } );
add_action( 'sgai_chat_cleanup', function () {
	global $wpdb;
	$m = max( 1, (int) get_option( 'sgai_chat_retention', 12 ) );
	$wpdb->query( $wpdb->prepare( 'DELETE FROM ' . sgai_chat_table() . ' WHERE created_at < %s', gmdate( 'Y-m-d H:i:s', strtotime( "-{$m} months" ) ) ) ); // phpcs:ignore
} );

/* ---------- Admin ---------- */
add_action( 'admin_menu', function () {
	add_menu_page( 'Chat History', 'Chat History', 'edit_pages', 'sgai-chats', 'sgai_chats_screen', 'dashicons-format-status', 26 );
	add_submenu_page( 'sgai-chats', 'Unanswered questions', 'Unanswered questions', 'edit_pages', 'sgai-unanswered', 'sgai_unanswered_screen' );
} );

function sgai_chats_screen() {
	global $wpdb; $t = sgai_chat_table();
	if ( isset( $_POST['sgai_ret'] ) && check_admin_referer( 'sgai_ret' ) && current_user_can( 'manage_options' ) ) update_option( 'sgai_chat_retention', max( 1, (int) $_POST['sgai_ret'] ) );
	echo '<div class="wrap"><h1>Chat History</h1>';
	$sid = isset( $_GET['session'] ) ? preg_replace( '/[^a-zA-Z0-9-]/', '', wp_unslash( $_GET['session'] ) ) : '';
	if ( $sid ) {
		$rows = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$t} WHERE session_id = %s ORDER BY id ASC", $sid ) ); // phpcs:ignore
		echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=sgai-chats' ) ) . '">← All conversations</a></p>';
		$lead = get_posts( array( 'post_type' => 'sg_lead', 'meta_key' => 'chat_session', 'meta_value' => $sid, 'numberposts' => 1 ) );
		if ( $lead ) echo '<p><strong>Lead:</strong> <a href="' . esc_url( get_edit_post_link( $lead[0]->ID ) ) . '">' . esc_html( $lead[0]->post_title ) . '</a></p>';
		echo '<div style="max-width:820px">';
		foreach ( $rows as $r ) {
			$me = 'user' === $r->role;
			printf( '<div style="margin:10px 0;padding:12px 14px;border-radius:12px;%s"><div style="font-size:11px;color:#646970;margin-bottom:4px">%s · %s · %s%s</div>%s</div>',
				$me ? 'background:#f0f6fc;margin-left:80px' : 'background:#fff;border:1px solid #dcdcde;margin-right:80px',
				$me ? 'Visitor' : 'Assistant', esc_html( get_date_from_gmt( $r->created_at, 'j M Y H:i' ) ), esc_html( $r->page ),
				$r->matched ? ' · answered from: ' . esc_html( $r->matched ) : ( ! $r->answered ? ' · <span style="color:#b32d2e">not in Knowledge Base</span>' : '' ),
				nl2br( esc_html( $r->message ) ) );
		}
		echo '</div></div>'; return;
	}
	$paged = max( 1, (int) ( $_GET['paged'] ?? 1 ) ); $per = 30; $off = ( $paged - 1 ) * $per;
	$total = (int) $wpdb->get_var( "SELECT COUNT(DISTINCT session_id) FROM {$t}" ); // phpcs:ignore
	$list  = $wpdb->get_results( $wpdb->prepare( "SELECT session_id, MIN(created_at) started, MAX(created_at) last, COUNT(*) msgs, SUM(role='user') asked, SUM(role='bot' AND answered=0) missed, MIN(page) page FROM {$t} GROUP BY session_id ORDER BY last DESC LIMIT %d OFFSET %d", $per, $off ) ); // phpcs:ignore
	echo '<p>' . (int) $total . ' conversations. Chats are kept for ' . (int) get_option( 'sgai_chat_retention', 12 ) . ' months.</p>';
	echo '<table class="widefat striped"><thead><tr><th>Started</th><th>First question</th><th>Page</th><th>Questions</th><th>Not answered</th><th>Lead</th></tr></thead><tbody>';
	foreach ( $list as $c ) {
		$first = $wpdb->get_var( $wpdb->prepare( "SELECT message FROM {$t} WHERE session_id=%s AND role='user' ORDER BY id ASC LIMIT 1", $c->session_id ) ); // phpcs:ignore
		$lead  = get_posts( array( 'post_type' => 'sg_lead', 'meta_key' => 'chat_session', 'meta_value' => $c->session_id, 'numberposts' => 1, 'fields' => 'ids' ) );
		printf( '<tr><td>%s</td><td><a href="%s">%s</a></td><td>%s</td><td>%d</td><td>%s</td><td>%s</td></tr>',
			esc_html( get_date_from_gmt( $c->started, 'j M Y H:i' ) ), esc_url( admin_url( 'admin.php?page=sgai-chats&session=' . $c->session_id ) ),
			esc_html( wp_trim_words( (string) $first, 12 ) ), esc_html( $c->page ), (int) $c->asked, $c->missed ? '<span style="color:#b32d2e">' . (int) $c->missed . '</span>' : '0',
			$lead ? '<a href="' . esc_url( get_edit_post_link( $lead[0] ) ) . '">Yes</a>' : '—' );
	}
	echo '</tbody></table>';
	$pages = (int) ceil( $total / $per );
	if ( $pages > 1 ) echo '<p>' . paginate_links( array( 'base' => add_query_arg( 'paged', '%#%' ), 'total' => $pages, 'current' => $paged ) ) . '</p>'; // phpcs:ignore
	if ( current_user_can( 'manage_options' ) ) {
		echo '<h2>Retention</h2><form method="post">'; wp_nonce_field( 'sgai_ret' );
		echo 'Delete chats older than <input type="number" min="1" max="60" name="sgai_ret" value="' . (int) get_option( 'sgai_chat_retention', 12 ) . '" style="width:70px"> months ';
		submit_button( 'Save', 'secondary', 'submit', false ); echo '</form>';
	}
	echo '</div>';
}

function sgai_unanswered_screen() {
	global $wpdb; $t = sgai_chat_table();
	$agg = array();
	foreach ( $wpdb->get_results( "SELECT id, session_id FROM {$t} WHERE role='bot' AND answered=0 ORDER BY id DESC LIMIT 2000" ) as $bot ) { // phpcs:ignore
		$u = $wpdb->get_row( $wpdb->prepare( "SELECT message, created_at FROM {$t} WHERE session_id=%s AND id<%d AND role='user' ORDER BY id DESC LIMIT 1", $bot->session_id, $bot->id ) ); // phpcs:ignore
		if ( ! $u ) continue;
		$k = strtolower( trim( $u->message ) );
		if ( ! isset( $agg[ $k ] ) ) $agg[ $k ] = (object) array( 'q' => $u->message, 'n' => 0, 'last' => $u->created_at );
		$agg[ $k ]->n++;
		if ( $u->created_at > $agg[ $k ]->last ) $agg[ $k ]->last = $u->created_at;
	}
	usort( $agg, function ( $x, $y ) { return $y->n <=> $x->n ?: strcmp( $y->last, $x->last ); } );
	$rows = array_slice( $agg, 0, 200 );
	echo '<div class="wrap"><h1>Unanswered questions</h1><p>Questions the Knowledge Base had no answer for. Add an entry for the common ones in <a href="' . esc_url( admin_url( 'edit.php?post_type=sg_kb' ) ) . '">Knowledge Base</a>.</p>';
	echo '<table class="widefat striped"><thead><tr><th>Question</th><th>Times asked</th><th>Last asked</th><th></th></tr></thead><tbody>';
	foreach ( $rows as $r ) printf( '<tr><td>%s</td><td>%d</td><td>%s</td><td><a class="button button-small" href="%s">Add answer</a></td></tr>', esc_html( $r->q ), (int) $r->n, esc_html( get_date_from_gmt( $r->last, 'j M Y' ) ), esc_url( admin_url( 'post-new.php?post_type=sg_kb&post_title=' . rawurlencode( $r->q ) ) ) );
	if ( ! $rows ) echo '<tr><td colspan="4">Nothing yet.</td></tr>';
	echo '</tbody></table></div>';
}
add_filter( 'default_title', function ( $t, $post ) { return ( 'sg_kb' === $post->post_type && isset( $_GET['post_title'] ) ) ? sanitize_text_field( wp_unslash( $_GET['post_title'] ) ) : $t; }, 10, 2 );
