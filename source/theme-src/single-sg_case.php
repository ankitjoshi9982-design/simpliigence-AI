<?php if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
while ( have_posts() ) : the_post();
	$row = get_post_meta( get_the_ID(), '_case_row', true ); ?>
<section class="hero page-hero"><div class="wrap" style="max-width:900px">
<nav class="crumbs" aria-label="Breadcrumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a><span class="sep">/</span><a href="<?php echo esc_url( home_url( '/resources/#results' ) ); ?>">Resources</a></nav>
<span class="pill"><span class="dot"></span><?php echo esc_html( $row ?: 'Case study' ); ?></span>
<h1><?php the_title(); ?></h1>
</div></section>
<section class="sec-tight"><div class="wrap" style="max-width:900px"><div class="tenets">
<?php foreach ( sgai_case_fields() as $k => $label ) { $v = get_post_meta( get_the_ID(), '_case_' . $k, true ); if ( ! $v ) continue; ?>
	<div class="tenet" style="grid-template-columns:1fr"><div><h3><?php echo esc_html( array( 'problem' => 'The problem', 'built' => 'What we built', 'result' => 'The result', 'quote' => 'In their words' )[ $k ] ); ?></h3><p><?php echo nl2br( esc_html( $v ) ); ?></p></div></div>
<?php } ?>
</div>
<div class="btn-row" style="margin-top:32px"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/?type=Book+an+AI+Health+Check' ) ); ?>">Book an AI Health Check</a><a class="btn" href="<?php echo esc_url( home_url( '/resources/#results' ) ); ?>">See results</a></div>
</div></section>
<?php endwhile;
get_footer();
