import {render} from '@wordpress/element';
import App from "~/App";

/**
 * Import the stylesheet for the plugin.
 */
// import './index.scss';

// Render the App component into the DOM
function mount() {
    if (document.getElementById('prek-dealer-map')) {
        const attributes: any = document.getElementById('prek-dealer-map')?.getAttribute('data-options')
        const attributesJSON = JSON.parse(attributes)

        const widgetSettings = {
            country: 'NO',
            ...attributesJSON
        }

        render(
            <App widgetSettings={widgetSettings}/>,
            document.getElementById('prek-dealer-map')
        );
    } else {
        setTimeout(mount, 100)
    }

}

mount()

// @ts-ignore
if (window.elementorFrontend) {
    // @ts-ignore
    const elementorFrontend = window.elementorFrontend

    if (!elementorFrontend.hooks) {
        console.log('No hooks')
    }

    window.addEventListener('elementor/frontend/init', () => {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', () => {
            mount()
        });
    });
}
