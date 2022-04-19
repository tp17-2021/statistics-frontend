import axios from "axios";
import {baseApiUrl} from "./helpers/helpers";
import type {IConfig, IElectionStatus, ILau1, IPartyResult} from "../pages/types";

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