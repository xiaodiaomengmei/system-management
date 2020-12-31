import request from '../utils/request';
import service from '../utils/request';

//url: './useraccount_table.json'  user_account,
export const fetchUserData = query => {
    return request({
        url: '/api/user_account',
        //url: './useraccount_table.json',
        method: 'get',
        params: query
    });
};
export const fetchUserNowTraceData = query => {
    return request({
        url: '/api/usernowtrace',
        method: 'get',
        params: query
    });
};
export const fetchUserHistoryTraceData = query => {
    return request({
        url: '/api/userhistorytrace',
        method: 'get',
        params: query
    });
};
export const fetchDeviceData = query => {
    return request({
        url: '/api/ap',
        //url: './device_table.json',
        method: 'get',
        params: query
    });
};

export const fetchEmailData = query => {
    return request({
        url: '/api/email_cfg',
        method: 'get',
        params: query
    });
};

export const fetchssidData = query => {
    return request({
        url: '/api/get_allssid',
        method: 'get',
        params: query
    });
};