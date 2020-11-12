const axios = require('axios').default;
const User = require('../models/userModel');

const {
    CALENDLY_AUTH_BASE_URL,
    CALENDLY_API_BASE_URL,
    CLIENT_SECRET,
    CLIENT_ID
} = process.env;

class CalendlyService {
    constructor(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.request = axios.create({
            baseURL: CALENDLY_API_BASE_URL
        });

        this.requestInterceptor = this.request.interceptors.response.use(
            (res) => res,
            this._onCalendlyError
        );
    }

    getRequestConfiguration() {
        return {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        };
    }

    getUserInfo = async () => {
        const { data } = await this.request.get(
            '/users/me',
            this.getRequestConfiguration()
        );

        return data;
    };

    getUserEventTypes = async (userUri) => {
        const { data } = await this.request.get(
            `/event_types?user=${userUri}`,
            this.getRequestConfiguration()
        );

        return data;
    };

    getUserScheduledEvents = async (userUri, count, pageToken) => {
        let queryParams = [
            `user=${userUri}`,
            `count=${count || 10}`,
            `sort=start_time:desc`
        ].join('&');

        if (pageToken) queryParams += `&page_token=${pageToken}`;

        const url = `/scheduled_events?${queryParams}`;

        const { data } = await this.request.get(
            url,
            this.getRequestConfiguration()
        );

        return data;
    };

    requestNewAccessToken = () => {
        return axios.post(`${CALENDLY_AUTH_BASE_URL}/oauth/token`, {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken
        });
    };

    _onCalendlyError = async (error) => {
        if (error.response.status !== 401) return Promise.reject(error);

        this.request.interceptors.response.eject(this.requestInterceptor);

        try {
            const response = await this.requestNewAccessToken();
            const { access_token, refresh_token } = response.data;

            const user = await User.findByAccessToken(this.accessToken);

            await User.update(user.id, {
                accessToken: access_token,
                refreshToken: refresh_token
            });

            this.accessToken = access_token;
            this.refreshToken = refresh_token;

            error.response.config.headers.Authorization = `Bearer ${access_token}`;

            // retry original request with new access token
            return this.request(error.response.config);
        } catch (e) {
            return Promise.reject(e);
        }
    };
}

module.exports = CalendlyService;
