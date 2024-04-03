// @ts-ignore
const dataLayer = window.dataLayer || [];

export function trackFormSubmit(
    formData: any,
    currency: 'NOK' | 'SEK' | 'EUR'
) {
    dataLayer.push({
        event: 'polaris_leads_submit',
        data: {
            campaignKey: formData.CampaignKey,
            leadType: formData.LeadType,
            firstName: formData.Customer.FirstName,
            lastName: formData.Customer.LastName,
            email: formData.Customer.Email,
            dealerNumber: formData.Opportunity.DealerNumber,
            currency: currency,
        }
    });
}
