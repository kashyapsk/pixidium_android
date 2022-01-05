const BASE_URL = "https://dev.pixidium.net"; 
const login_api = "/rest/api/token/";
const signup_api = "/rest/signup/";
const category_api = "category/";
const campaign_listing_api = "campaign-listing/";
const dashboard_api = "/dashboard/";
const rest_campaign_detail_api = "/rest/campaign-detail/";
const rest_accept_campaign_api = "/rest/accept-campaign/";
const rest_in_progress_api = "/rest/in-progress/";
const rest_in_progress_preview_api = "/rest/in-progress-preview/";
const rest_notifications_api = "/rest/notifications/";
const rest_profile_api = "/rest/profile/";


 export  function  signUpApi(parameters) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Accept': 'application/json',    'Content-Type': 'multipart/form-data',
    },
        body: parameters
    };
    console.log(requestOptions)
     fetch(BASE_URL + signup_api, requestOptions)
        .then(response => 
             
            response.json()
            )
        .then(responseData =>
            result = JSON.stringify(responseData)
            
                )
                .catch(error => (console.log(error)));


     
  }

  export  function  loginApi(parameters) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json',
    },
        body: parameters
    };
    console.log(requestOptions)
    return fetch(BASE_URL + login_api, requestOptions)
        .then(response => 
             {
           return response.json()
             }
            )
        .then(responseData =>
            {
            return result = JSON.stringify(responseData)
            }
            
                )
                .catch(error => (console.log(error)));


     
  }