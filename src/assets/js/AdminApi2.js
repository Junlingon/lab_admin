import {
    request
} from './http.js';
class Service {

    //老年大学-学院档案-列表
    static async courseregistratio(data) {
        return request('home/Teachers/course_registratio', data)
    }
}

export default {
    Service
}
