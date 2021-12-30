import axios from 'axios'

const API_URL = 'https://localhost:5001/api/Authenticate/'

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'Login', {
        username: user.username,
        password: user.password,
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data))
        }
        return response.data
      })
      .catch(err => console.log(err))
  }

  logout() {
    localStorage.removeItem('user')
  }

  register(user) {
    return axios.post(API_URL + 'register', {
      username: user.username,
      email: user.email,
      password: user.password,
    })
  }
}

export default new AuthService()
