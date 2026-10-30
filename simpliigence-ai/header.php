<?php if ( ! defined( 'ABSPATH' ) ) exit; ?><!doctype html>
<html <?php language_attributes(); ?> class="no-js">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-sg-page="<?php echo esc_attr( sgai_page_key() ?: 'home' ); ?>">
<?php wp_body_open(); ?>
<?php echo sgai_links( sgai_current_nav( sgai_data( 'header.html' ) ) ); // phpcs:ignore -- built, trusted theme markup ?>
