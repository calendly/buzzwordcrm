const axios = require('axios').default;
const User = require('../models/userModel');

const {
  CALENDLY_AUTH_BASE_URL,
  CALENDLY_API_BASE_URL,
  CLIENT_SECRET,
  CLIENT_ID,
} = process.env;

class CalendlyService {
  constructor(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.request = axios.create({
      baseURL: CALENDLY_API_BASE_URL,
    });

    this.requestInterceptor = this.request.interceptors.response.use(
      (res) => res,
      this._onCalendlyError
    );
  }

  requestConfiguration() {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }

  getUserInfo = async () => {
    const { data } = await this.request.get(
      '/users/me',
      this.requestConfiguration()
    );

    return data;
  };

  getUserEventTypes = async (userUri) => {
    const { data } = await this.request.get(
      `/event_types?user=${userUri}`,
      this.requestConfiguration()
    );

    return data;
  };

  getUserEventType = async (uuid) => {
    const { data } = await this.request.get(
      `/event_types/${uuid}`,
      this.requestConfiguration()
    );

    return data;
  };

  getUserScheduledEvents = async (
    userUri,
    count,
    pageToken,
    status,
    maxStartTime,
    minStartTime
  ) => {
    let queryParams = [
      `user=${userUri}`,
      `count=${count || 10}`,
      `sort=start_time:asc`,
    ].join('&');

    if (pageToken) queryParams += `&page_token=${pageToken}`;
    if (status) queryParams += `&status=${status}`;
    if (maxStartTime) queryParams += `&max_start_time=${maxStartTime}`;
    if (minStartTime) queryParams += `&min_start_time=${minStartTime}`;

    const url = `/scheduled_events?${queryParams}`;

    const { data } = await this.request.get(url, this.requestConfiguration());

    return data;
  };

  getUserScheduledEvent = async (uuid) => {
    const { data } = await this.request.get(
      `/scheduled_events/${uuid}`,
      this.requestConfiguration()
    );

    return data;
  };

  getUserScheduledEventInvitees = async (uuid, count, pageToken) => {
    let queryParams = [`count=${count || 10}`].join('&');

    if (pageToken) queryParams += `&page_token=${pageToken}`;

    const url = `/scheduled_events/${uuid}/invitees?${queryParams}`;

    const { data } = await this.request.get(url, this.requestConfiguration());

    return data;
  };

  getUserEventTypeAvailTimes = async (eventUri, startTime, endTime) => {
    let queryParams = [
      `start_time=${startTime}`,
      `end_time=${endTime}`,
      `event_type=${eventUri}`,
    ].join('&');

    const url = `/event_type_available_times?${queryParams}`;

    const { data } = await this.request.get(url, this.requestConfiguration());

    return data;
  };

  getUserBusyTimes = async (userUri, startTime, endTime) => {
    let queryParams = [
      `user=${userUri}`,
      `start_time=${startTime}`,
      `end_time=${endTime}`,
    ].join('&');

    const url = `/user_busy_times?${queryParams}`;

    const { data } = await this.request.get(url, this.requestConfiguration());

    return data;
  };

  getUserAvailabilitySchedules = async (userUri) => {
    const url = `/user_availability_schedules?user=${userUri}`;

    const { data } = await this.request.get(url, this.requestConfiguration());

    return data;
  };

  getUser = async (userUri) => {
    const url = `/users/${userUri}`;

    const { data } = await this.request.get(url, this.requestConfiguration());

    return data;
  };

  markAsNoShow = async (uri) => {
    const { data } = await this.request.post(
      '/invitee_no_shows',
      {
        invitee: uri,
      },
      this.requestConfiguration()
    );

    return data;
  };

  undoNoShow = async (inviteeUuid) => {
    await this.request.delete(
      `/invitee_no_shows/${inviteeUuid}`,
      this.requestConfiguration()
    );
  };

  cancelEvent = async (uuid, reason) => {
    const { data } = await this.request.post(
      `/scheduled_events/${uuid}/cancellation`,
      {
        reason: reason,
      },
      this.requestConfiguration()
    );

    return data;
  };

  requestNewAccessToken = () => {
    return axios.post(`${CALENDLY_AUTH_BASE_URL}/oauth/token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
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
        refreshToken: refresh_token,
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
