<?php
/** Fallback template (required by WordPress). The 9 approved pages each
 * have their own page-{slug}.php template, so this only renders if a
 * page falls outside that set. */
get_header();
?>
<section class="section">
  <div class="container">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
      <h1 class="section-title display"><?php the_title(); ?></h1>
      <div class="section-sub"><?php the_content(); ?></div>
    <?php endwhile; endif; ?>
  </div>
</section>
<?php get_footer(); ?>
