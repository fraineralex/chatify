export interface User {
    created_at:     Date;
    email:          string;
    email_verified: boolean;
    family_name:    string;
    given_name:     string;
    identities?:     Identity[];
    locale:         string;
    name:           string;
    nickname:       string;
    picture:        string;
    updated_at:     Date;
    user_id:        string;
    last_login:     Date;
    last_ip:        string;
    logins_count:   number;
}

export interface Identity {
    provider:     string;
    access_token: string;
    expires_in:   number;
    user_id:      string;
    connection:   string;
    isSocial:     boolean;
}
