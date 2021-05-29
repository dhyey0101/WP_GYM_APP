import { BASE_URL } from './Api';

export class RestClient {

    constructor(baseUrl) {
        this._baseUrl = baseUrl;

        _headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });

    }
   
    /** POST with body */
    postWithBody(url, data) {
        return this.callRequest('POST', url, data);
    }

    /* POST without body */
    postWithoutBody(url) {
        return this.callRequest('POST', url);
    }
    
    postWithBodyToken(url, data, Token) {
        return this.callRequestWithToken('POST', url, data, Token);
    }
    
    /** POST with form data */
    postWithFormData(url, data) {
        return this.callRequestWithFormToken('POST', url, data)
    }

    /** callRequest for non authenticated method */
    callRequest(method, url, data = null) {
        let API_URL = `${this._baseUrl}=${url}`
        // console.log(API_URL);
        
        return fetch(API_URL, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson)
                if (responseJson.status == 1) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    /** callRequestWithToken for authentication token */
    callRequestWithToken(method, url, data, token) {
        let API_URL = `${this._baseUrl}=${url}`

        return fetch(API_URL, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson)
                if (responseJson.status == 1) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                return error;
            })
    }

    /** call request with formdata and api token */
    callRequestWithFormToken(method, url, data) {
        let API_URL = `${this._baseUrl}=${url}`

        return fetch(API_URL, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 1) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                return error;
            })

        // var xhr = new XMLHttpRequest();
        //     return new Promise((resolve, reject) => {
        //     xhr.withCredentials = true;
        //     xhr.onreadystatechange = e => {
        //     if (xhr.readyState !== 4) {
        //     return;
        //     }
        //     if (xhr.status === 200) {
        //         resolve(JSON.parse(xhr.responseText));
        //     } else {
        //         // alert("Request Failed");
        //         reject("Request Failed");
        //         console.log(xhr.status);
        //     }
        //     };
        //     xhr.open("POST", API_URL);
        //     xhr.setRequestHeader("cache-control", "no-cache");
        //     xhr.setRequestHeader("Content-Type", "multipart/form-data");
        //     xhr.setRequestHeader("Accept", "application/json");
        //     xhr.setRequestHeader("Authorization", token);
        //     xhr.setRequestHeader("X-localization", this._finalLocal);
        //     console.log(xhr);
        //     xhr.send(data);
    }
    
}

export const defaultRestClient = new RestClient(BASE_URL);