import axios, { AxiosError, AxiosResponse } from "axios";
import { request } from "http";
import { toast } from "react-toastify";
import { Activity } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { router } from "../router/Routes";
import { store } from "../stores/store";

const sleep = (delay: number) => { //variable for "sleeping", will be passed to axios.interceptor
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token; //get the token from commonStore
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`; // this adds the token to the authorization header so we can auth
    }
    return config;
    
})

// This interceptor is used for RESPONSES back to server
axios.interceptors.response.use(async response => { // AXIOS INTERCEPTORS
        await sleep(1000); // loading screen
        return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse;

    switch (status) {
        case 400:
            if(config.method === 'get' && data.errors.hasOwnProperty('id')) {
                router.navigate('/not-found');
            }
            
            if (data.errors) {
                const modelStateErrors = []; 
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 403:
            toast.error('forbidden');
            break;
        case 404:
            router.navigate('/not-found'); //use the "router" obj from Routes.tsx and point it to this route
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
})

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody), 
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody), 
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody), 
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody), 
}

// ALL Actions you can do on the items (list, del, put)
const Activities = { 
    //ensure type safety
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post<void>('/activities', activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`)
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user), //passes 'user' upto API
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)

}

const agent = {
    Activities,
    Account
}

export default agent; //exported to other tsx files!