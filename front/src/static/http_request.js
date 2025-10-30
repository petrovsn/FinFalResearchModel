import { store } from "./storage/storage"
import { logout } from "./storage/slices/authSlice"

class CustomError extends Error {
  constructor(error_data) {
    super(error_data);
    this.content = error_data
  }
}

export async function http_auth_request(url, username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  // Если нужно, добавьте grant_type (обычно не требуется для OAuth2PasswordRequestForm)
  // formData.append('grant_type', 'password');



  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Auth failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch auth error:', error);
    throw error; // Пробрасываем ошибку для обработки в вызывающем коде
  }
}



export async function http_request(endpoint, method, header, body) {
  //let url = server_url_http+endpoint
  let url = endpoint


  var myInit = {
    method: method,
    headers: Object.assign({
      'Cache-Control': 'no-cache'
    }, header),
  }

  if (Object.keys(body).length > 0) {
    myInit["body"] = JSON.stringify(body)
    myInit["headers"]['Content-Type'] = 'application/json'
  }


  console.log("http_request", url, myInit)

  let response = await fetch(url, myInit)
  let data = null
  switch (response.status) {
    case 200:
      data = await response.json();
      //console.log("success", myInit, myInit, data)
      return data
    case 510:
      data = await response.json();
      console.log("Logic error", endpoint, method, myInit, response, data)
      throw new CustomError(data);
    case 401:
      store.dispatch(logout)
    case 404:
      data = await response.json();
      console.log("Logic error", endpoint, method, myInit, response, data)
      throw new CustomError(data);
    case 422:
      data = await response.json();
      console.log("validation", endpoint, method, myInit, response, data)
      if (!("object" in data)) {
        data = {
          "code": 422,
          "message": "invalid data format"
        }
      }

      throw new CustomError(data);
      break
    default:
      console.log("error", endpoint, method, myInit, response)
      throw new CustomError('Data validation error', response.status);
  }
}

