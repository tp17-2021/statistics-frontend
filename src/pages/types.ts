

interface IKeyPair {
    polling_place_id: number;
    private_key_pem: string;
    public_key_pem: string;
    g_private_key_pem: string;
    g_public_key_pem: string;
    _id: number;
}


/**
 * {code: 1, name: 'Bratislavský kraj'}
 */
export interface IRegion {
    code: number;
    name: string;
}

// {code: 101, name: 'Bratislava I', region_code: 1}
export interface ICounty {
    code: number;
    name: string;
    region_code: number;
}


// {code: 557757, name: 'Abovce', region_code: 6, county_code: 609}
export interface IMunicipality {
    code: number;
    name: string;
    region_code: number;
    country_code: number;
}

interface ICandidate {
    age: number;
    degrees_before: string;
    first_name: string;
    last_name: string;
    occupation: string;
    order: number;
    party_number: number;
    residence: string;
    _id: number;
}



interface ITexts {
    elections_name_short: {
        sk: string;
        en: string;
    };
    elections_name_long: {
        sk: string;
        en: string;
    };
    election_date: {
        sk: string;
        en: string;
    };
    contact: {
        title: {
            sk: string;
            en: string;
        };
        contact_person: string;
        address: string;
        phone: string;
        email: string;
    };
}

// config interface
export interface IConfig {
    counties: ICounty[]
    key_pairs: IKeyPair[]
    municipalities: IMunicipality[];
    parties: IParty[];
    regions: IRegion[];
    texts: ITexts;
}

/*
{lau1: 'Bratislava I', lau1_code: 'SK0101', county_code: '101'}
*/
export interface ILau1 {
    lau1: string;
    lau1_code: string;
    county_code: string;
}



export interface ILookup {
    candidates: ICandidate[];
    code_to_lau1: {};
    counties: ICounty[];
    lau1_to_code: {
        [key: string]: ILau1
    };
    municipalities: IMunicipality[];
    nuts3_to_region_code: {
        [key: string]: number
    };
    parties: IParty[];
    regions: IRegion[];
}



interface IParty {
    abbr: string;
    candidates: ICandidate[];
    color: string;
    image: string;
    image_bytes: string;
    name: string;
    official_abbr: string;
    party_number: number;
    _id: number;
}

/*
{
    "id": "11",
    "doc_count": 6859,
    "candidates": [...
        ],
    "percentage": 13.718,
    "in_parliament": true,
    "relative_percentage": 27.9891,
    "seats": 45,
    "_id": 11,
    "party_number": 12,
    "name": "Koalícia Progresívne Slovensko a SPOLU - občianska demokracia",
    "official_abbr": "Koalícia Progresívne Slovensko a SPOLU - občianska demokracia",
    "image": "progresivne-slovensko-a-spolu.png",
    "color": "#015FB8",
    "abbr": "PS SPOLU",
    "image_bytes": "4ErkJggg...=="
}
 */
export interface IPartyResult extends IParty {
    doc_count: number;
    id: number;
    in_parliament: boolean;
    percentage: number;
    relative_percentage: number;
    seats: number;
}


