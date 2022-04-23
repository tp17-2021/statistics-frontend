import axios from "axios";
import {baseApiUrl, isDevelopmentMode} from "./helpers/helpers";
import type {IConfig, IElectionStatus, ILau1, IPartyResult} from "../pages/types";
import { jwt } from "../lib/stores";

jwt.subscribe((token: any) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

});

/**
 * Fetches config from server
 */
export async function fetchConfig(): Promise<IConfig> {
    return (await axios.get("api/config.json")).data;
}
/**
 * Fetches lau1 from server
 */
export async function fetchLau1(): Promise<ILau1> {
    return (await axios.get("api/lau1_codes.json")).data;
}

export async function resultsPulished(): Promise<boolean> {
    return (await axios.get(baseApiUrl("/elastic/results/status"))).data.published == true;
}

export async function fetchPartyResults(): Promise<IPartyResult[]> {
    const response = await axios
        .post(baseApiUrl("/elastic/get-party-candidate-results"), {})
        .catch(function (error) {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
        });

    // @ts-ignore
    return response?.data || [];
}


export async function fetchElectionStatus(filter_type: string = null, filter_value: string = null): Promise<IElectionStatus> {
    let queryParams = {};
    if (filter_value) {
        queryParams = {
            filter_by: filter_type + "_code",
            filter_value: filter_value,
        }
    }
    const response = await axios.get(baseApiUrl(`/elastic/elections-status`), {
        params: queryParams,
    });

    return response.data.data;
}

export async function authJWTToken(username: string, password: string): Promise<boolean> {
    if (isDevelopmentMode) {
        // generate random string (example of generated mockToken: 1fggoqtjlqz643fkyhd4ao)
        let mockToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        jwt.set(mockToken);
        console.warn("Development mode: using mock token " + mockToken + " instead of requesting server for a real token");
        return true
    }

    try {
        var bodyFormData = new FormData();
        bodyFormData.append('body', "");
        bodyFormData.append('username', username);
        bodyFormData.append('password', password);
        let jwr_response = await axios({
            method: "post",
            url: baseApiUrl("/token"),
            data: bodyFormData,
            headers: {"Content-Type": "multipart/form-data"},
        })

        console.log("jwr_response", jwr_response);

        // if 200, then token is valid
        if (jwr_response.status === 200) {
            jwt.set(jwr_response.data.access_token);

            // TESTING - INVALIDATE TOKEN after 5 seconds after login
            // setTimeout(() => {
            //     jwt.set("INVALIDATED.TEST.erjgshdmfhjaesdfjhgesdjikxjfkc");
            // }, 5000);
            return true;
        } else {
            jwt.set(null);
            alert()
            return false;
        }
    } catch (e) {
        // if 401, then token is invalid (unauthorized)
        console.log("authJWTToken catch", e);

        if (e.response?.status === 401) {
            jwt.set(null);
        } else {
            console.error("failed with error status " + e.status);
            console.log(e);
        }
        return false;
    }
}

export async function getResultsStatus() {
    return await axios.get(baseApiUrl("/elastic/results/status"));
}


export async function publishResults() {
    return await axios.post(baseApiUrl("/elastic/results/publish"));
}


export async function hideResults() {
    return await axios.post(baseApiUrl("/elastic/results/hide"));
}