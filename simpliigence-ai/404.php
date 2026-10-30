<?php
$sgai_page_key = 'home';
get_header();
?>
<section class="section cta-band">
  <div class="container text-center">
    <h1 class="section-title display">We couldn&rsquo;t find that page.</h1>
    <p class="section-sub" style="margin:0 auto">Tell our assistant what you were looking for, or head back to the homepage.</p>
    <div class="btn-row" style="justify-content:center;margin-top:20px">
      <a class="btn btn-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>">Back to home</a>
      <button type="button" class="btn btn-ghost" onclick="document.getElementById('fab').click();">Ask our assistant</button>
    </div>
  </div>
</section>
<?php get_footer(); ?>
