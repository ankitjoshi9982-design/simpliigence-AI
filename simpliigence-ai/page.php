<?php if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
while ( have_posts() ) : the_post();
	if ( get_post_meta( get_the_ID(), '_sgai_page', true ) ) {
		the_content();
	} else { ?>
		<section class="hero page-hero"><div class="wrap"><h1><?php the_title(); ?></h1></div></section>
		<section class="sec-tight"><div class="wrap entry"><?php the_content(); ?></div></section>
	<?php }
endwhile;
get_footer();
