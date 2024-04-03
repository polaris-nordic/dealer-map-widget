import WidgetProvider from "~/context/WidgetProvider/WidgetProvider";
import {IWidgetSettings} from "~/types";
import {DealerMap} from "~/widgets";
import {createI18n, I18nProvider} from "react-simple-i18n";
import {langData} from "~/locale";

interface AppProps {
    widgetSettings: IWidgetSettings
}

const App = (props: AppProps) => {
    const {
        widgetSettings
    } = props

    return (
        <I18nProvider i18n={createI18n(langData, { lang: widgetSettings.settings.country })}>
            <WidgetProvider settings={widgetSettings}>
                <DealerMap/>
                { widgetSettings.settings.debug && (
                    <div className="bg-gray-100 p-4 mt-8">
                        <h4 className="text-lg py-3 font-bold">Debug</h4>
                        <pre className="text-sm">{ JSON.stringify(widgetSettings, null, 2)}</pre>
                    </div>
                )}
            </WidgetProvider>
        </I18nProvider>
    );
}

export default App
