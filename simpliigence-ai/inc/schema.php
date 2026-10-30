<?php
/**
 * Structured data (Schema.org JSON-LD).
 * Organization schema sitewide (skipped if Yoast already outputs one, to avoid duplicates).
 * FAQPage schema per page, built from the same FAQ copy rendered on the page —
 * so the assistant, the visible FAQ and the schema always say the same thing.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function sgai_yoast_active() {
	return defined( 'WPSEO_VERSION' );
}

function sgai_organization_schema() {
	if ( sgai_yoast_active() ) return; // Yoast already emits Organization/WebSite schema in its graph.
	$data = array(
		'@context' => 'https://schema.org',
		'@type'    => 'Organization',
		'name'     => 'Simpliigence AI',
		'url'      => home_url( '/' ),
		'description' => 'Simpliigence AI delivers enterprise AI solutions, business process automation and AI agents on the platforms you already run.',
		'sameAs'   => array(),
	);
	echo "\n<script type=\"application/ld+json\">" . wp_json_encode( $data ) . "</script>\n";
}
add_action( 'wp_head', 'sgai_organization_schema' );

/**
 * FAQ data per page slug, taken verbatim from the approved copy document.
 * Each answer's first sentence is written to stand alone as a direct answer (AEO/GEO),
 * exactly as the source document asks.
 */
function sgai_faq_data( $slug ) {
	$faqs = array(
		'front-page' => array(
			array( 'q' => 'Who is Simpliigence AI for?', 'a' => 'Simpliigence AI is for teams in any industry that want AI to deliver a measurable result and need help prioritising, scaling, reaching value sooner or tying AI to business goals, using the platforms they already have.' ),
			array( 'q' => 'Why do businesses need AI automation?', 'a' => 'Work grows faster than headcount. AI automation lets a team handle more at the same quality, without adding people to repetitive tasks.' ),
			array( 'q' => 'What does "outcomes, by design" mean?', 'a' => 'It means we agree the result first, design the system around it, and are paid when that result shows up.' ),
			array( 'q' => 'What is an AI automation platform?', 'a' => 'An AI automation platform is the layer that lets AI read your data, decide the next step and act across your systems. We build that layer on the tools you already run.' ),
			array( 'q' => 'Which option is right for my business?', 'a' => 'Growing businesses usually start with AI Agents, mid-market teams with Automation, and enterprises with Simpliigence AI. The AI Health Check tells you for sure.' ),
			array( 'q' => 'How fast can we go live?', 'a' => 'A working pilot on your real data usually takes five to eight weeks.' ),
			array( 'q' => 'Is Simpliigence AI part of Simpliigence?', 'a' => 'Yes. We share one delivery organisation with Simpliigence, a 250+ person Salesforce and AI firm.' ),
		),
		'ai' => array(
			array( 'q' => 'What are enterprise AI solutions?', 'a' => 'Enterprise AI solutions are software that reasons over your business data to support real decisions and actions, deployed inside your existing systems and security rules.' ),
			array( 'q' => 'Do we need to buy a new AI platform?', 'a' => 'No. We build on the model and platforms you already license.' ),
			array( 'q' => 'Does our data leave our environment?', 'a' => 'No. Everything runs inside your tenant and region, with your existing permissions.' ),
			array( 'q' => 'How do payments work?', 'a' => 'The Health Check is a half-day session. The Discovery Sprint is fixed and credited to the build. The build is paid at evaluation gates.' ),
			array( 'q' => 'Can we switch models later?', 'a' => 'Yes. The logic is designed to port, so a better model is an upgrade, not a rebuild.' ),
		),
		'automation' => array(
			array( 'q' => 'How does AI workflow automation work?', 'a' => 'AI workflow automation adds a layer that reads context, decides the next step and acts across your systems, so it handles the exceptions that break rule-based automation.' ),
			array( 'q' => 'RPA or an AI agent, which do I need?', 'a' => 'It depends on how much the process changes. Stable, high-volume steps suit RPA; work that shifts or needs judgment suits an agent.' ),
			array( 'q' => 'What do we pay before results show up?', 'a' => 'A retainer that covers setup and running. The success fee is paid only when the agreed KPI improves.' ),
			array( 'q' => "What if the number doesn't move?", 'a' => "Then the success fee isn't paid. That's the point of the model." ),
			array( 'q' => 'What happens after the measurement window?', 'a' => 'Most clients keep the process running with us on a renewed target, or move to a managed service.' ),
		),
		'agents' => array(
			array( 'q' => 'What is an AI agent?', 'a' => 'An AI agent is software that completes a multi-step task on its own using your tools and data, rather than just replying to a prompt.' ),
			array( 'q' => 'Do I need an IT team?', 'a' => 'No. We handle setup, integrations and running the agents.' ),
			array( 'q' => 'Which tools do the agents work with?', 'a' => 'The ones you already use, including Salesforce, QuickBooks, Microsoft 365, Google Workspace, Slack and Teams.' ),
			array( 'q' => 'Can I change agents later?', 'a' => 'Yes. One swap a quarter is included, and you can move up a plan any time.' ),
			array( 'q' => 'How is AI used for customer support automation?', 'a' => 'A support agent reads each new case, sorts it, drafts the first reply and routes anything unusual to a person, so your team spends time on the cases that need them.' ),
		),
		'industries' => array(
			array( 'q' => 'What are examples of AI in business automation?', 'a' => 'Common examples are matching payments to invoices, drafting quotes from CRM data, triaging service cases, capturing supplier tenders and processing claims without manual entry.' ),
			array( 'q' => 'How does AI help with operations management?', 'a' => 'AI agents take on the repetitive steps in operations, such as tracking orders, updating records and flagging exceptions, so people focus on the decisions.' ),
			array( 'q' => 'Do you only work in these industries?', 'a' => 'No. These are where we have the most depth. The approach works wherever a process runs on data and repeats.' ),
		),
		'resources' => array(
			array( 'q' => 'What is an AI automation platform?', 'a' => 'An AI automation platform is the layer that lets AI read business data, decide the next step and act across your systems. It differs from traditional automation because it handles exceptions and changing inputs instead of breaking on them.' ),
			array( 'q' => 'How does AI automation work in business?', 'a' => 'An AI model reads a request or record, pulls the context it needs from your systems, and proposes or takes the next action. A person approves anything that matters until the agent has proved its accuracy on your own data.' ),
			array( 'q' => 'How do you automate workflows using AI?', 'a' => 'Start with one process that repeats and costs time. Map it, remove the waste, then let an agent handle the steps that need judgment and a workflow tool handle the ones that don\'t.' ),
			array( 'q' => 'What are the benefits of AI in enterprises?', 'a' => 'The biggest gains come from fewer manual hours per transaction, faster cycle times such as quote-to-cash, and less revenue lost to errors and missed billing.' ),
			array( 'q' => 'Why do businesses need AI automation?', 'a' => 'Volume grows faster than headcount. AI automation lets a team handle more work at the same quality without adding people to repetitive tasks.' ),
			array( 'q' => 'What are examples of AI in business automation?', 'a' => 'Matching payments to invoices, drafting quotes from CRM data, triaging service cases, capturing supplier tenders and processing insurance or warranty claims.' ),
		),
		'tools' => array(
			array( 'q' => 'Are the results accurate?', 'a' => "They're a starting point based on what you enter. A Discovery Sprint measures the real number on your own data." ),
			array( 'q' => 'Do I need to give my email?', 'a' => "No. You see your result straight away. Email is only needed if you'd like a copy sent to you." ),
		),
	);
	return isset( $faqs[ $slug ] ) ? $faqs[ $slug ] : array();
}

function sgai_faqpage_schema() {
	$slug = sgai_current_slug();
	$faqs = sgai_faq_data( $slug );
	if ( empty( $faqs ) ) return;

	$entities = array();
	foreach ( $faqs as $item ) {
		$entities[] = array(
			'@type' => 'Question',
			'name'  => $item['q'],
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => $item['a'],
			),
		);
	}
	$data = array(
		'@context'  => 'https://schema.org',
		'@type'     => 'FAQPage',
		'mainEntity' => $entities,
	);
	echo "\n<script type=\"application/ld+json\">" . wp_json_encode( $data ) . "</script>\n";
}
add_action( 'wp_head', 'sgai_faqpage_schema' );

/** Helper: slug used for home is 'front-page'. */
function sgai_current_slug() {
	if ( is_front_page() ) return 'front-page';
	global $post;
	return $post ? $post->post_name : '';
}
