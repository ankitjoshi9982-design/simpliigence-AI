<?php
if ( ! defined( 'ABSPATH' ) ) exit;
?>
</main>
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo"><img src="<?php echo esc_url( get_template_directory_uri() . '/images/logo.png' ); ?>" alt="Simpliigence" class="logo-img" width="28" height="28"> <span class="ai-tag">AI</span></a>
        <p>Enterprise AI solutions, AI agents and business process automation — paid at the gates they pass, run on the platforms you already license.</p>
      </div>
      <div>
        <h4>Ways in</h4>
        <ul>
          <li><a href="<?php echo esc_url( home_url( '/ai/' ) ); ?>">Simpliigence AI</a></li>
          <li><a href="<?php echo esc_url( home_url( '/automation/' ) ); ?>">Simpliigence Automation</a></li>
          <li><a href="<?php echo esc_url( home_url( '/agents/' ) ); ?>">AI Agents</a></li>
        </ul>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>
          <li><a href="<?php echo esc_url( home_url( '/industries/' ) ); ?>">Industries</a></li>
          <li><a href="<?php echo esc_url( home_url( '/resources/' ) ); ?>">Resources</a></li>
          <li><a href="<?php echo esc_url( home_url( '/tools/' ) ); ?>">Tools</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="<?php echo esc_url( home_url( '/company/' ) ); ?>">About</a></li>
          <li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a></li>
          <li><a href="<?php echo esc_url( home_url( '/contact/?type=Book+an+AI+Health+Check' ) ); ?>">Book an AI Health Check</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <?php echo esc_html( date( 'Y' ) ); ?> Simpliigence AI &middot; simpliigence.ai &middot; All rights reserved.</span>
      <span>Simpliigence AI &middot; Simpliigence Automation &middot; AI Agents</span>
    </div>
  </div>
</footer>
<div class="toast" id="toast" role="status"><i class="fa-solid fa-circle-check"></i><span id="toastMsg"></span></div>

<?php wp_footer(); ?>
</body>
</html>
