<?php if ( ! defined( 'ABSPATH' ) ) exit;
get_header(); ?>
<section class="hero page-hero"><div class="wrap"><h1><?php echo is_search() ? 'Search' : esc_html( wp_get_document_title() ); ?></h1></div></section>
<section class="sec-tight"><div class="wrap entry">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<article class="card" style="margin-bottom:16px"><h2 style="font-size:24px"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><div><?php the_excerpt(); ?></div></article>
<?php endwhile; the_posts_pagination(); endif; ?>
</div></section>
<?php get_footer();
