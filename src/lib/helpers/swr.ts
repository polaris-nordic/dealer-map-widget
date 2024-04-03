import useSWR from "swr";
import {DealerUrl, IWidgetSettings} from "~/types";

const fetcher = (url: string) => fetch(url).then(r => r.json())
const wpAjaxFetcher = async (action: string, payload?: string) => {
    const formData = new FormData();
    formData.append('action', action);
    formData.append('payload', payload!);

    const response = await fetch(`${window.location.origin}/wp-admin/admin-ajax.php`, {
        method: 'POST',
        credentials: 'same-origin',
        body: formData
    })

    const data = await response.json()

    return data.data
}

export function useDealers <TModel>(country: keyof typeof DealerUrl) {
    const payload = JSON.stringify({country})
    const { data, error, isLoading } = useSWR(['get_dealers', payload], ([action, payload]) => wpAjaxFetcher(action, payload), {
        revalidateOnFocus: false,
    })

    return {
        dealers: data as TModel[],
        isLoading,
        isError: error
    }
}

export function useCampaign (postData: Record<string, any>, widgetSettings: IWidgetSettings) {
    /*const payload = JSON.stringify({data: postData, widgetSettings})

    const { data, error, isLoading } = useSWR(['polaris_submit_campaign', payload], ([action, payload]) => wpAjaxFetcher(action, payload), {
        revalidateOnFocus: false,
    })

    return {
        campaign: data,
        isLoading,
        isError: error
    }*/
}
