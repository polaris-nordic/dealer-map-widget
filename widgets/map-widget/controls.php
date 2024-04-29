<?php

use Elementor\Controls_Manager;
use Elementor\Core\Base\Document;
use ElementorPro\Modules\LoopBuilder\Documents\Loop as LoopDocument;
use ElementorPro\Modules\QueryControl\Controls\Template_Query;
use ElementorPro\Modules\QueryControl\Module as QueryControlModule;
use ElementorPro\Plugin;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Elementor oEmbed Widget.
 *
 * Elementor widget that inserts an embbedable content into the page, from any given URL.
 *
 * @since 1.0.0
 */
class Elementor_DealerMap_Controls extends \Elementor\Widget_Base
{

    /**
     * Get widget name.
     *
     * Retrieve oEmbed widget name.
     *
     * @return string Widget name.
     * @since 1.0.0
     * @access public
     */
    public function get_name(): string
    {
        return 'prek-dealer-map';
    }

    /**
     * Get widget title.
     *
     * Retrieve oEmbed widget title.
     *
     * @return string Widget title.
     * @since 1.0.0
     * @access public
     */
    public function get_title(): string
    {
        return esc_html__('Dealer Map', 'dealer-map-widget');
    }

    /**
     * Get widget icon.
     *
     * Retrieve oEmbed widget icon.
     *
     * https://elementor.github.io/elementor-icons/
     *
     * @return string Widget icon.
     * @since 1.0.0
     * @access public
     */
    public function get_icon(): string
    {
        return 'eicon-google-maps';
    }

    /**
     * Get widget categories.
     *
     * Retrieve the list of categories the oEmbed widget belongs to.
     *
     * @return array Widget categories.
     * @since 1.0.0
     * @access public
     */
    public function get_categories(): array
    {
        return ['prek'];
    }

    /**
     * Get custom help URL.
     *
     * Retrieve a URL where the user can get more information about the widget.
     *
     * @return string Widget help URL.
     * @since 1.0.0
     * @access public
     */
    public function get_custom_help_url(): string
    {
        return 'https://prek.no';
    }

    /**
     * Get widget keywords.
     *
     * Retrieve the list of keywords the oEmbed widget belongs to.
     *
     * @return array Widget keywords.
     * @since 1.0.0
     * @access public
     */
    public function get_keywords(): array
    {
        return ['prek', 'dealers', 'map'];
    }

    public function get_script_depends(): array
    {
        return ['prek-dm-widget'];
    }

    public function get_style_depends(): array
    {
        return ['prek-dm-widget-css1', 'prek-dm-widget-css2'];
    }

    /**
     * Register oEmbed widget controls.
     *
     * Add input fields to allow the user to customize the widget settings.
     *
     * @since 1.0.0
     * @access protected
     */
    protected function register_controls(): void
    {
        $postTypes = get_post_types(['public' => true], 'objects');

        /**
         * Settings
         */
        $this->start_controls_section(
            'section_prek_settings',
            [
                'label' => esc_html__('Settings', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'prek_dm_settings_country',
            [
                'label' => esc_html__('Site country', 'dealer-map-widget'),
                'type' => Controls_Manager::SELECT,
                'placeholder' => '',
                'description' => esc_html__("Choose which country this site is for.", 'dealer-map-widget'),
                'options' => [
                    'no' => 'Norway',
                    'sv' => 'Sweden',
                    'fi' => 'Finland',
                ],
                'default' => 'no'
            ]
        );

        $this->add_control(
            'prek_dm_settings_googlekey',
            [
                'label' => esc_html__('Google Maps API key', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'placeholder' => '',
                'label_block' => true,
                'required' => true,
                'description' => esc_html__("This will be used to find the nearest dealers.", 'dealer-map-widget'),
                'ai' => [
                    'active' => false,
                ],
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->end_controls_section();

        /**
         * Dealer settings
         */
        $this->start_controls_section(
            'section_prek_dealer_settings',
            [
                'label' => esc_html__('Dealer Data', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_CONTENT,
            ]
        );


        $this->add_control(
            'prek_dm_dealer_posttype',
            [
                'label' => esc_html__( 'Dealer Post Type', 'dealer-map-widget' ),
                'description' => esc_html__( 'Select which post type we should fetch the dealers from.', 'dealer-map-widget' ),
                'type' => Controls_Manager::SELECT,
                'label_block' => true,
                'placeholder' => '',
                'options' => array_map(function ($postType) {
                    return $postType->label;
                }, $postTypes),
                'default' => 'post'
            ]
        );

        $this->add_control(
            'prek_dm_dealer_field_title',
            [
                'label' => esc_html__( 'Dealer Title field', 'dealer-map-widget' ),
                'description' => esc_html__( 'Select which field we should fetch for the dealer title.', 'dealer-map-widget' ),
                'type' => Controls_Manager::SELECT,
                'placeholder' => '',
                'label_block' => true,
                'options' => [
                    'title' => 'Title',
                    'content' => 'Content',
                    'meta' => 'Meta field'
                ],
                'default' => 'title',
            ]
        );

        $this->add_control(
            'prek_dm_dealer_field_title_meta',
            [
                'label' => esc_html__('Title Meta field', 'dealer-map-widget'),
                'description' => esc_html__("This will be used to show the dealers title.", 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'required' => true,
                'ai' => [
                    'active' => false,
                ],
                'dynamic' => [
                    'active' => true,
                ],
                'condition' => [
                    'prek_dm_dealer_field_title' => 'meta',
                ],
            ]
        );

        $this->add_control(
            'prek_dm_dealer_field_lat',
            [
                'label' => esc_html__('Latitude field', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'required' => true,
                'placeholder' => '',
                'description' => esc_html__("The meta field name for the latitude.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->add_control(
            'prek_dm_dealer_field_lng',
            [
                'label' => esc_html__('Longitude field', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'placeholder' => '',
                'description' => esc_html__("The meta field name for the longitude.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->add_control(
            'prek_dm_dealer_field_placeid_enable',
            [
                'label' => esc_html__( 'Enable Google Place?', 'dealer-map-widget' ),
                'description' => esc_html__( 'Enable Google Place to get opening hours etc. The API key must have the Google Place API enabled for this to work.', 'dealer-map-widget' ),
                'type' => Controls_Manager::SWITCHER,
                'label_on' => esc_html__( 'Yes', 'dealer-map-widget' ),
                'label_off' => esc_html__( 'No', 'dealer-map-widget' ),
                'return_value' => 'yes',
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'prek_dm_dealer_field_placeid',
            [
                'label' => esc_html__('Google Place ID field', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'placeholder' => '',
                'description' => esc_html__("The meta field name for the Google Place ID, if any.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
                'condition' => [
                    'prek_dm_dealer_field_placeid_enable' => 'yes',
                ],
            ]
        );

        $this->end_controls_section();

        /**
         * Dealer settings
         */
        $this->start_controls_section(
            'section_prek_extra_fields',
            [
                'label' => esc_html__('Extra Data Fields', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'prek_dm_dealer_extra_address',
            [
                'label' => esc_html__('Address field', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'required' => true,
                'placeholder' => '',
                'description' => esc_html__("The meta field name for the address.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->add_control(
            'prek_dm_dealer_extra_zip',
            [
                'label' => esc_html__('Zipcode field', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'required' => true,
                'placeholder' => '',
                'description' => esc_html__("The meta field name for the Zip code.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->add_control(
            'prek_dm_dealer_extra_city',
            [
                'label' => esc_html__('City field', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'required' => true,
                'placeholder' => '',
                'description' => esc_html__("The meta field name for the city.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->add_control(
            'prek_dm_dealer_extra_phone',
            [
                'label' => esc_html__('Phone field', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'required' => true,
                'placeholder' => '',
                'description' => esc_html__("The meta field name for the phone.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->add_control(
            'prek_dm_dealer_extra_email',
            [
                'label' => esc_html__('Email field', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'required' => true,
                'placeholder' => '',
                'description' => esc_html__("The meta field name for the email.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->add_control(
            'prek_dm_dealer_extra_website',
            [
                'label' => esc_html__('Website field', 'dealer-map-widget'),
                'type' => Controls_Manager::TEXT,
                'required' => true,
                'placeholder' => '',
                'description' => esc_html__("The meta field name for the website.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->end_controls_section();

        /**
         * Map settings
         */
        $this->start_controls_section(
            'section_prek_map_settings',
            [
                'label' => esc_html__('Map Settings', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'prek_dm_map_zoom',
            [
                'label' => esc_html__('Zoom level', 'dealer-map-widget'),
                'type' => Controls_Manager::NUMBER,
                'placeholder' => '',
                'description' => esc_html__("Set the default zoom level for the map.", 'dealer-map-widget'),
                'default' => 10,
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->add_control(
            'prek_dm_map_type',
            [
                'label' => esc_html__('Map type', 'dealer-map-widget'),
                'type' => Controls_Manager::SELECT,
                'placeholder' => '',
                'description' => esc_html__("Choose the default map type.", 'dealer-map-widget'),
                'options' => [
                    'roadmap' => 'Roadmap',
                    'satellite' => 'Satellite',
                    'hybrid' => 'Hybrid',
                    'terrain' => 'Terrain',
                ],
                'default' => 'roadmap'
            ]
        );

        $this->add_control(
            'prek_dm_map_style',
            [
                'label' => esc_html__('Map style', 'dealer-map-widget'),
                'type' => Controls_Manager::SELECT,
                'placeholder' => '',
                'description' => esc_html__("Choose the default map style.", 'dealer-map-widget'),
                'options' => [
                    'airbnb' => 'Airbnb',
                    'apple' => 'Apple',
                ],
                'default' => 'roadmap'
            ]
        );

        $this->end_controls_section();

        /**
         * Text overrides
         */
        $this->start_controls_section(
            'section_prek_texts',
            [
                'label' => esc_html__('Text Overrides', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'prek_dm_text_sidebar_title',
            [
                'label' => esc_html__('Sidebar Title', 'dealer-map-widget'),
                'type' => \Elementor\Controls_Manager::TEXTAREA,
                'rows' => 3,
                'label_block' => true,
                'placeholder' => '',
                'description' => esc_html__("Override text for the sidebar title.", 'dealer-map-widget'),
                'dynamic' => [
                    'active' => true,
                ],
            ]
        );

        $this->end_controls_section();

        /**
         * Advanced
         */
        $this->start_controls_section(
            'section_prek_advanced',
            [
                'label' => esc_html__('Advanced', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'section_prek_advanced_debug',
            [
                'label' => esc_html__( 'Enable debugging', 'dealer-map-widget' ),
                'description' => esc_html__( 'Spits out the raw data object.', 'dealer-map-widget' ),
                'type' => Controls_Manager::SWITCHER,
                'label_on' => esc_html__( 'Yes', 'dealer-map-widget' ),
                'label_off' => esc_html__( 'No', 'dealer-map-widget' ),
                'return_value' => 'yes',
                'default' => '',
            ]
        );

        $this->end_controls_section();

        /**
         * Layout
         */
        $this->start_controls_section(
            'section_prek_layout_container',
            [
                'label' => esc_html__('Container', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_responsive_control(
            'prek_layout_container_height',
            [
                'label' => esc_html__( 'Container height', 'dealer-map-widget' ),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', '%', 'vh', 'custom' ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1000,
                        'step' => 5,
                    ],
                    '%' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                    'vh' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
                'default' => [
                    'unit' => '%',
                    'size' => 100,
                ],
                'selectors' => [
                    '{{WRAPPER}} .prek-map-wrapper' => 'height: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .prek-map' => 'height: {{SIZE}}{{UNIT}};',
                    //'{{WRAPPER}} .prek-map-container' => 'height: {{SIZE}}{{UNIT}};',
                    //'{{WRAPPER}} #prek-dealer-map' => 'height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'prek_layout_container_gap',
            [
                'label' => esc_html__( 'Gap', 'textdomain' ),
                'description' => esc_html__("Gap between map and search sidebar", 'dealer-map-widget'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', 'em', 'rem', 'custom' ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 100,
                        'step' => 1,
                    ],
                    'em' => [
                        'min' => 0,
                        'max' => 10,
                    ],
                    'rem' => [
                        'min' => 0,
                        'max' => 10,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 20,
                ],
                'selectors' => [
                    '{{WRAPPER}} .prek-map-container' => 'gap: {{SIZE}}{{UNIT}};',
                ]
            ]
        );

        $this->end_controls_section();

        /**
         * Map styles
         */
        $this->start_controls_section(
            'section_prek_layout_map',
            [
                'label' => esc_html__('Map Styles', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_responsive_control(
            'prek_layout_map_borderradius',
            [
                'label' => esc_html__( 'Border radius', 'textdomain' ),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
                'selectors' => [
                    '{{WRAPPER}} .prek-map' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}; overflow: hidden;',
                ],
            ]
        );

        $this->end_controls_section();

        /**
         * Sidebar styles
         */

        $this->start_controls_section(
            'section_prek_layout_sidebar',
            [
                'label' => esc_html__('Sidebar Styles', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_responsive_control(
            'prek_layout_sidebar_height',
            [
                'label' => esc_html__( 'Sidebar height', 'dealer-map-widget' ),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', '%', 'vh', 'custom' ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1000,
                        'step' => 5,
                    ],
                    '%' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                    'vh' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
                'default' => [
                    'unit' => '%',
                    'size' => 100,
                ],
                'selectors' => [
                    '{{WRAPPER}} .prek-map-sidebar' => 'height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'prek_layout_sidebar_padding',
            [
                'label' => esc_html__( 'Padding', 'textdomain' ),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
                'default' => [
                    'top' => 10,
                    'right' => 10,
                    'bottom' => 10,
                    'left' => 10,
                    'unit' => 'px',
                    'isLinked' => true,
                ],
                'selectors' => [
                    '{{WRAPPER}} .prek-sidebar' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Background::get_type(),
            [
                'name' => 'prek_layout_sidebar_background',
                'types' => [ 'classic', 'gradient', 'video' ],
                'selector' => '{{WRAPPER}} .prek-sidebar',
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Border::get_type(),
            [
                'name' => 'prek_layout_sidebar_border',
                'selector' => '{{WRAPPER}} .prek-sidebar',
            ]
        );

        $this->add_responsive_control(
            'prek_layout_sidebar_borderradius',
            [
                'label' => esc_html__( 'Border radius', 'textdomain' ),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%', 'em', 'rem', 'custom' ],
                'selectors' => [
                    '{{WRAPPER}} .prek-sidebar' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}; overflow: hidden;',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Box_Shadow::get_type(),
            [
                'name' => 'prek_layout_sidebar_boxshadow',
                'selector' => '{{WRAPPER}} .prek-sidebar',
            ]
        );

        $this->add_responsive_control(
            'prek_layout_sidebar_width',
            [
                'label' => esc_html__( 'Sidebar width', 'dealer-map-widget' ),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => [ 'px', '%', 'vw', 'custom' ],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 1000,
                        'step' => 5,
                    ],
                    '%' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                    'vw' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 320,
                ],
                'selectors' => [
                    '{{WRAPPER}} .prek-sidebar' => 'width: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'prek_layout_sidebar_order',
            [
                'label' => esc_html__( 'Position', 'dealer-map-widget' ),
                'type' => Controls_Manager::SELECT,
                'placeholder' => '',
                'description' => esc_html__("Before or after map", 'dealer-map-widget'),
                'options' => [
                    3 => 'After',
                    1 => 'Before',
                ],
                'default' => 3,
                'selectors' => [
                    '{{WRAPPER}} .prek-sidebar' => 'order: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_section();

        /**
         * Typography
         */
        $this->start_controls_section(
            'section_prek_layout_typography',
            [
                'label' => esc_html__('Typography', 'dealer-map-widget'),
                'tab' => Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'prek_layout_sidebar_title',
                'label_block' => true,
                'label' => esc_html__( 'Title Typography', 'dealer-map-widget' ),
                'selector' => '{{WRAPPER}} .prek-sidebar-title',
            ]
        );

        $this->add_responsive_control(
            'prek_layout_sidebar_title_color',
            [
                'label' => esc_html__( 'Title Color', 'dealer-map-widget' ),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .prek-sidebar-title' => 'color: {{VALUE}}',
                ],
            ]
        );

        $this->add_responsive_control(
            'prek_layout_sidebar_title_align',
            [
                'label' => esc_html__( 'Alignment', 'textdomain' ),
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'left' => [
                        'title' => esc_html__( 'Left', 'textdomain' ),
                        'icon' => 'eicon-text-align-left',
                    ],
                    'center' => [
                        'title' => esc_html__( 'Center', 'textdomain' ),
                        'icon' => 'eicon-text-align-center',
                    ],
                    'right' => [
                        'title' => esc_html__( 'Right', 'textdomain' ),
                        'icon' => 'eicon-text-align-right',
                    ],
                ],
                'default' => 'left',
                'toggle' => true,
                'selectors' => [
                    '{{WRAPPER}} .prek-sidebar-title' => 'text-align: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_section();
    }
}
