<?php
/**
 * Plugin Name: Prek - Dealer Map Widget
 * Description: Dealer map and listing
 * Plugin URI:  https://prek.no
 * Version:     1.0.8
 * Author:      Prek AS <chris@prek.no>
 * Author URI:  https://prek.no
 * Text Domain: dealer-map-widget
 *
 * Elementor tested up to: 3.19.2
 * Elementor Pro tested up to: 3.19.2
 */

use Elementor\Elements_Manager;
use Elementor\Widgets_Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Add a new category to the Elementor widget library.
 * @param Elements_Manager $elements_manager
 * @return void
 */
function add_prek_widget_categories( Elements_Manager $elements_manager ): void
{
    $elements_manager->add_category(
        'prek',
        [
            'title' => esc_html__( 'Prek', 'dealer-map-widget' ),
            'icon' => 'fa fa-plug',
        ]
    );
}
add_action( 'elementor/elements/categories_registered', 'add_prek_widget_categories' );

/**
 * Register Widgets
 *
 * @param Widgets_Manager $widgets_manager Elementor widgets manager.
 * @return void
 * @since 1.0.0
 */
function register_prek_widgets( Widgets_Manager $widgets_manager ): void
{
    require_once( __DIR__ . '/widgets/map-widget/widget.php' );

    $widgets_manager->register( new Elementor_DealerMap_Widget() );
}
add_action( 'elementor/widgets/register', 'register_prek_widgets' );

/**
 * Register scripts and styles for Elementor test widgets.
 */
function prek_widgets_dependencies(): void {
    $asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

    /* Scripts */
    wp_register_script( 'prek-dm-widget', plugin_dir_url( __FILE__ ) . 'build/index.js', $asset_file['dependencies'], $asset_file['version'], true );
    wp_localize_script( 'prek-dm-widget', 'pluginData', [
        'ajaxUrl' => admin_url('admin-ajax.php')
    ]);

    /* Styles */
    wp_register_style( 'prek-dm-widget-css1', plugin_dir_url( __FILE__ ) . 'build/index.css', [], $asset_file['version'] );
    wp_register_style( 'prek-dm-widget-css2', plugin_dir_url( __FILE__ ) . 'build/main.css', [], $asset_file['version'] );
}

add_action( 'wp_enqueue_scripts', 'prek_widgets_dependencies' );

/**
 * Add type="module" to the script tag.
 */
add_filter('script_loader_tag', function($tag, $handle, $src) {
    // if not your script, do nothing and return original $tag
    if ( 'prek-dm-widget' !== $handle ) {
        return $tag;
    }
    // change the script tag by adding type="module" and return it.
    return '<script type="module" src="' . esc_url( $src ) . '"></script>';
}, 10, 3);
