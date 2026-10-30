<?php if ( ! defined( 'ABSPATH' ) ) exit;
get_header(); ?>
<section class="hero page-hero"><div class="wrap" style="max-width:820px">
<span class="pill"><span class="dot"></span>404</span>
<h1>This page isn't here.</h1>
<p class="lead">Ask our assistant, or head back to the home page.</p>
<div class="btn-row" style="margin-top:28px"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a><button class="btn" type="button" data-open-asst>Ask our assistant</button></div>
</div></section>
<?php get_footer();
