import axios from 'axios'
import { APIBASEURL } from '../../config.mjs'

const API_URL = "http://localhost:3000";

class AuthService {
    async login(email: string, password: string, deviceToken: string) {
        const response = await axios.post(`${API_URL}/api/auth/signin`, {
            email,
            password,
            deviceToken
        })
        return response.data
    }
}

const authService = new AuthService()
export default authService 