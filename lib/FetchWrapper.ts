
import { userAccess } from './UserAccess';


async function get(url:string) {
    const requestOptions:RequestInit = {
        method: 'GET',
        headers: authHeader(url)
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
}

async function post(url:string, body:object) {
    const requestOptions:RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
}

async function put(url:string, body:object) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);    
}


function authHeader(url:string): HeadersInit {
    const access = userAccess.accessValue;
    const isLoggedIn = access && access.token;
    const isApiUrl = url.startsWith("/api");
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${access.token}` };
    } else {
        return {};
    }
}

async function handleResponse(response: Response) {
    const text = await response.text();
    const data = text && JSON.parse(text);
    if (!response.ok) {
        if ([401, 403].includes(response.status) && userAccess.accessValue) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            userAccess.logout();
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}

const _module = { get, post, put };

export default _module;

