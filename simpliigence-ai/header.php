<?php
/**
 * Header — nav is server-rendered (not JS-injected) on purpose: it shows up
 * instantly, costs nothing for CLS, and crawlers see it without running JS.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php wp_head(); ?>
</head>
<?php
// The page the visitor is on, used by the assistant to pick its chips —
// derived straight from WordPress, no per-template setup needed.
$sgai_page_key = is_front_page() ? 'home' : ( is_page() ? get_queried_object()->post_name : 'home' );
?>
<body <?php body_class(); ?> data-sg-page="<?php echo esc_attr( $sgai_page_key ); ?>">
<?php wp_body_open(); ?>

<div class="ambient" aria-hidden="true">
  <div class="orb" style="width:520px;height:520px;top:-160px;left:-120px;background:rgba(16,37,72,.30)"></div>
  <div class="orb" style="width:420px;height:420px;top:10%;right:-140px;background:rgba(81,113,158,.05);animation-delay:-6s"></div>
  <div class="orb" style="width:480px;height:480px;bottom:-180px;left:35%;background:rgba(21,50,98,.15);animation-delay:-12s"></div>
</div>

<a href="#main" class="skip-link">Skip to content</a>
<header class="navbar" id="navbar">
  <div class="container nav-inner">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" aria-label="Simpliigence AI home">
      <img src="<?php echo esc_url( get_template_directory_uri() . '/images/logo.png' ); ?>" alt="Simpliigence" class="logo-img" width="32" height="32">
      <span class="ai-tag">AI</span>
    </a>
    <nav aria-label="Main navigation">
      <ul class="nav-links">
        <li><a class="nav-link <?php echo is_front_page() ? 'active' : ''; ?>" href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a></li>
        <li>
          <a class="nav-link" href="<?php echo esc_url( home_url( '/ai/' ) ); ?>">Platform <i class="fa-solid fa-chevron-down"></i></a>
          <div class="dropdown">
            <a href="<?php echo esc_url( home_url( '/ai/' ) ); ?>"><span class="dd-icon"><i class="fa-solid fa-brain"></i></span><span><strong>Simpliigence AI</strong><span>Bring Your Own Intelligence — enterprise AI inside your own tenant.</span></span></a>
            <a href="<?php echo esc_url( home_url( '/automation/' ) ); ?>"><span class="dd-icon"><i class="fa-solid fa-arrows-turn-to-dots"></i></span><span><strong>Simpliigence Automation</strong><span>Outcome-as-a-Service — pay when the number moves.</span></span></a>
            <a href="<?php echo esc_url( home_url( '/agents/' ) ); ?>"><span class="dd-icon"><i class="fa-solid fa-robot"></i></span><span><strong>AI Agents</strong><span>AgentBox — your own AI team, without hiring one.</span></span></a>
          </div>
        </li>
        <li><a class="nav-link <?php echo is_page( 'industries' ) ? 'active' : ''; ?>" href="<?php echo esc_url( home_url( '/industries/' ) ); ?>">Industries</a></li>
        <li><a class="nav-link <?php echo is_page( 'resources' ) ? 'active' : ''; ?>" href="<?php echo esc_url( home_url( '/resources/' ) ); ?>">Resources</a></li>
        <li><a class="nav-link <?php echo is_page( 'tools' ) ? 'active' : ''; ?>" href="<?php echo esc_url( home_url( '/tools/' ) ); ?>">Tools</a></li>
        <li>
          <a class="nav-link <?php echo is_page( 'company' ) ? 'active' : ''; ?>" href="<?php echo esc_url( home_url( '/company/' ) ); ?>">Company <i class="fa-solid fa-chevron-down"></i></a>
          <div class="dropdown narrow">
            <a href="<?php echo esc_url( home_url( '/company/' ) ); ?>"><span class="dd-icon"><i class="fa-solid fa-users"></i></span><span><strong>About Us</strong><span>Story, delivery model, leadership</span></span></a>
            <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><span class="dd-icon"><i class="fa-solid fa-envelope"></i></span><span><strong>Contact</strong><span>Talk to our team</span></span></a>
          </div>
        </li>
      </ul>
    </nav>
    <div class="nav-cta">
      <a href="<?php echo esc_url( home_url( '/company/?type=Talk+to+an+Architect' ) ); ?>" class="btn btn-ghost btn-sm"><i class="fa-solid fa-headset"></i> Talk to an Architect</a>
      <a href="<?php echo esc_url( home_url( '/contact/?type=Book+an+AI+Health+Check' ) ); ?>" class="btn btn-primary btn-sm"><i class="fa-solid fa-calendar-check"></i> Book an AI Health Check</a>
      <button class="hamburger" id="hamburger" aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>
    </div>
  </div>
</header>
<nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
  <button class="mobile-close" id="mobileClose" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
  <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
  <a href="<?php echo esc_url( home_url( '/ai/' ) ); ?>">Simpliigence AI</a>
  <a href="<?php echo esc_url( home_url( '/automation/' ) ); ?>">Simpliigence Automation</a>
  <a href="<?php echo esc_url( home_url( '/agents/' ) ); ?>">AI Agents</a>
  <a href="<?php echo esc_url( home_url( '/industries/' ) ); ?>">Industries</a>
  <a href="<?php echo esc_url( home_url( '/resources/' ) ); ?>">Resources</a>
  <a href="<?php echo esc_url( home_url( '/tools/' ) ); ?>">Tools</a>
  <a href="<?php echo esc_url( home_url( '/company/' ) ); ?>">Company</a>
  <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a>
  <div style="margin-top:24px;display:flex;flex-direction:column;gap:12px">
    <a href="<?php echo esc_url( home_url( '/contact/?type=Book+an+AI+Health+Check' ) ); ?>" class="btn btn-primary">Book an AI Health Check</a>
    <a href="<?php echo esc_url( home_url( '/contact/?type=Talk+to+an+Architect' ) ); ?>" class="btn btn-ghost">Talk to an Architect</a>
  </div>
</nav>

<main id="main">
