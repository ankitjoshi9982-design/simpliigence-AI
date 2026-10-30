<?php if ( ! defined( 'ABSPATH' ) ) exit;
echo sgai_privacy_link( sgai_links( str_replace( '&copy; 2026', '&copy; ' . esc_html( gmdate( 'Y' ) ), sgai_data( 'footer.html' ) ) ) ); // phpcs:ignore -- built, trusted theme markup
wp_footer(); ?>
</body>
</html>
