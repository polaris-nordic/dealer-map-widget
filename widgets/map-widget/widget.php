<?php

use ElementorPro\Modules\QueryControl\Module as Module_Query;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

require_once __DIR__ . '/controls.php';

class Elementor_DealerMap_Widget extends Elementor_DealerMap_Controls
{
    /**
     * @var WP_Query
     */
    private $_query = null;

    public function get_query(): WP_Query {
        return $this->_query;
    }

    public function query_posts(): void {
        $query_args = [
            'posts_per_page' => $this->get_settings( 'posts_per_page' ),
        ];

        $elementor_query = Module_Query::instance();
        $this->_query = $elementor_query->get_query( $this, 'posts', $query_args, [] );
    }

    protected function render(): void
    {
        $settings = $this->get_settings_for_display();

        $options = [
            'settings' => [
                'country' => strtoupper($settings['prek_dm_settings_country']) ?? 'NO',
                'googleApiKey' => $settings['prek_dm_settings_googlekey'] ?? '',
                'debug' => $settings['section_prek_advanced_debug'] === 'yes',
            ],
            'labels' => [
                'sidebarTitle' => $settings['prek_dm_text_sidebar_title'] ?? '',
            ],
            'dealer' => [
                'postType' => $settings['prek_dm_dealer_posttype'] ?? 'post',
                'googlePlaceEnabled' => !!($settings['prek_dm_dealer_field_placeid_enable'] === 'yes'),
                'selectedCookie' => $settings['prek_dm_settings_storecookie'] === 'yes',
                'selectedCookieInjectClass' => $settings['prek_dm_settings_storecookie_injectclass'] ?? '',
                'fieldTitle' => $settings['prek_dm_dealer_field_title'] ?? 'title',
                'fieldTitleMeta' => $settings['prek_dm_dealer_field_title_meta'] ?? '',
                'fieldLatitude' => $settings['prek_dm_dealer_field_lat'] ?? '',
                'fieldLongitude' => $settings['prek_dm_dealer_field_lng'] ?? '',
                'fieldPlaceId' => $settings['prek_dm_dealer_field_placeid'] ?? '',
                'fieldAddress' => $settings['prek_dm_dealer_field_address'] ?? '',
                'extra' => [
                    'address' => $settings['prek_dm_dealer_extra_address'] ?? '',
                    'zip' => $settings['prek_dm_dealer_extra_zip'] ?? '',
                    'city' => $settings['prek_dm_dealer_extra_city'] ?? '',
                    'phone' => $settings['prek_dm_dealer_extra_phone'] ?? '',
                    'email' => $settings['prek_dm_dealer_extra_email'] ?? '',
                    'website' => $settings['prek_dm_dealer_extra_website'] ?? '',
                ]
            ],
            'map' => [
                'zoom' => $settings['prek_dm_map_zoom'] ?? 6,
                'type' => $settings['prek_dm_map_type'] ?? 'hybrid',
                'style' => $settings['prek_dm_map_style'] ?? '',
            ],
            'layout' => [
                'container' => [
                    'height' => $settings['prek_layout_container_height'] ?? ['size' => 400, 'unit' => 'px'],
                    'gap' => $settings['prek_layout_container_gap'] ?? ['size' => 20, 'unit' => 'px'],
                ],
                'sidebar' => [
                    'width' => $settings['prek_layout_sidebar_width'] ?? ['size' => 320, 'unit' => 'px'],
                    'position' => $settings['prek_layout_sidebar_order'] ?? 3,
                ],
            ]
        ];
        ?>
        <script type="text/javascript">
            window.ajaxUrl = "<?php echo admin_url('admin-ajax.php'); ?>";
        </script>
        <div
                id="prek-dealer-map"
                class="prek-dealer-map"
                style="height: 100%;"
                data-options="<?php echo htmlspecialchars(json_encode($options), ENT_QUOTES, 'UTF-8'); ?>"
        ></div>
        <?php
    }

    protected function content_template()
    {
        ?>
        <#
        const options = {
            settings: {
                country: settings.prek_dm_settings_country.toUpperCase() || 'NO',
                googleApiKey: settings.prek_dm_settings_googlekey || '',
                debug: settings.section_prek_advanced_debug === 'yes',
            },
            labels: {
                sidebarTitle: settings.prek_dm_text_sidebar_title || '',
            },
            dealer: {
                postType: settings.prek_dm_dealer_posttype || 'post',
                googlePlaceEnabled: settings.prek_dm_dealer_field_placeid_enable === 'yes',
                selectedCookie: settings.prek_dm_settings_storecookie === 'yes',
                selectedCookieInjectClass: settings.prek_dm_settings_storecookie_injectclass || '',
                fieldTitle: settings.prek_dm_dealer_field_title || 'title',
                fieldTitleMeta: settings.prek_dm_dealer_field_title_meta || '',
                fieldLatitude: settings.prek_dm_dealer_field_lat || '',
                fieldLongitude: settings.prek_dm_dealer_field_lng || '',
                fieldPlaceId: settings.prek_dm_dealer_field_placeid || '',
                extra: {
                    address: settings.prek_dm_dealer_extra_address || '',
                    zip: settings.prek_dm_dealer_extra_zip || '',
                    city: settings.prek_dm_dealer_extra_city || '',
                    phone: settings.prek_dm_dealer_extra_phone || '',
                    email: settings.prek_dm_dealer_extra_email || '',
                    website: settings.prek_dm_dealer_extra_website || '',
                }
            },
            map: {
                zoom: settings.prek_dm_map_zoom || 6,
                type: settings.prek_dm_map_type || 'hybrid',
                style: settings.prek_dm_map_style || '',
            },
            layout: {
                container: {
                    height: settings.prek_layout_container_height || { size: 400, unit: 'px' },
                    gap: settings.prek_layout_container_gap || { size: 20, unit: 'px' },
                },
                sidebar: {
                    width: settings.prek_layout_sidebar_width || { size: 320, unit: 'px' },
                    position: settings.prek_layout_sidebar_order || 3,
                },
            },
        };
        #>
        <div id="prek-dealer-map" class="prek-dealer-map" style="height: 100%;" data-options='{{{ JSON.stringify(options) }}}'>Refresh</div>
        <?php
    }
}
