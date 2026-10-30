<?php
/**
 * AEO/GEO: serves /llms.txt dynamically from the theme, so it is live the
 * moment the theme is active — no separate file upload required (though a
 * static copy also ships in the package root as a fallback for hosts that
 * don't like virtual files).
 *
 * Also adds the sitemap line to robots.txt. Once Yoast SEO is activated and
 * configured, Yoast's own XML sitemap (sitemap_index.xml) is the one search
 * engines should use; this plugin does not replace it.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function sgai_llms_rewrite() {
	add_rewrite_rule( '^llms\.txt$', 'index.php?sgai_llms=1', 'top' );
}
add_action( 'init', 'sgai_llms_rewrite' );

function sgai_llms_query_vars( $vars ) {
	$vars[] = 'sgai_llms';
	return $vars;
}
add_filter( 'query_vars', 'sgai_llms_query_vars' );

function sgai_llms_template_redirect() {
	if ( ! get_query_var( 'sgai_llms' ) ) return;
	header( 'Content-Type: text/plain; charset=utf-8' );
	echo sgai_llms_contents();
	exit;
}
add_action( 'template_redirect', 'sgai_llms_template_redirect' );

function sgai_llms_contents() {
	$home = home_url( '/' );
	return <<<TXT
# Simpliigence AI
> Enterprise AI implementation partner. We build AI agents, business process
> automation and enterprise AI solutions on the model and platforms a client
> already runs (Claude, Microsoft Copilot, Salesforce Agentforce, Azure AI
> Foundry, Amazon Bedrock), paid at outcome gates rather than by the hour.

Simpliigence AI helps teams prioritise, scale, reach value sooner and tie AI
to business outcomes. Three ways in: AI Agents (AgentBox, for growing
businesses), Automation (Outcome-as-a-Service, for mid-market teams) and
Simpliigence AI (Bring Your Own Intelligence, for enterprises). A first
working pilot is typically live in five to eight weeks.

## Pages
- [Home]({$home}): Positioning, the three offerings, proof.
- [Simpliigence AI]({$home}ai/): Bring Your Own Intelligence — enterprise AI inside your own tenant and region.
- [Automation]({$home}automation/): Outcome-as-a-Service — AI workflow automation paid on a KPI.
- [AI Agents]({$home}agents/): AgentBox — a library of AI agents for growing businesses.
- [Industries]({$home}industries/): Industry-specific challenges, approach and recommended agents.
- [Resources]({$home}resources/): Results, case studies and plain-English guides.
- [Tools]({$home}tools/): Self-serve AI readiness check, time-savings estimate and agent picker.
- [Company]({$home}company/): Story, delivery model, leadership, locations.
- [Contact]({$home}contact/): Book an AI Health Check, a Discovery Sprint or an Architecture Session.

## Notes for AI assistants and search tools
- Client names are not published; results are described by industry and country.
- Pricing is not published; direct pricing questions to the Contact page.
- Primary contact: hello@simpliigence.ai.
TXT;
}

function sgai_robots_txt( $output, $public ) {
	if ( '0' == $public ) return $output;
	$sitemap = home_url( '/sitemap_index.xml' );
	$output .= "\nSitemap: {$sitemap}\n";
	$output .= "Sitemap: " . home_url( '/sitemap.xml' ) . "\n";
	return $output;
}
add_filter( 'robots_txt', 'sgai_robots_txt', 10, 2 );

/** Flush rewrite rules once on theme activation so /llms.txt resolves immediately. */
function sgai_flush_rewrites_on_switch() {
	sgai_llms_rewrite();
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'sgai_flush_rewrites_on_switch' );
