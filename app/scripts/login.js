 var app = document.querySelector('#app');

    window.addEventListener('WebComponentsReady', function() {
      if (isLoggedIn()) {
        startChat()
        toggleLoginButton()
      } else {
        toggleLoginButton()
      }
    });

    function isLoggedIn() {
      return window.localStorage.getItem('userToken')
    }

    function toggleLoginButton() {
      var loginButton = document.querySelector('#login')
      if (isLoggedIn()) {
        loginButton.textContent = 'logout'
        loginButton.addEventListener('click', logOut);
        loginButton.removeEventListener('click', logIn);
      } else {
        loginButton.textContent = 'login'
        loginButton.addEventListener('click', logIn);
        loginButton.removeEventListener('click', logOut);
      }
    }

    function logIn() {
      var lock = new Auth0Lock(
        'uCxiKiGA49tLe3f9iXNsBp2XdzvBzImZ',
        'zellwk.auth0.com'
      )
      lock.show(function (err, profile, token) {
        if (err) {
          console.error('Something went wrong: ', err)
        } else {
          window.localStorage.setItem('userToken', token)
          window.localStorage.setItem('profile', JSON.stringify(profile))
          toggleLoginButton()
          startChat()
        }
      })
    }

    function logOut() {
      window.localStorage.removeItem('userToken')
      window.localStorage.removeItem('profile')
      toggleLoginButton()
    }

    function startChat() {
      var url = 'https://ga-webchat.herokuapp.com/'
      // var url = 'localhost:3000'
      app.socket = io.connect(url, {
        'query': 'token=' + window.localStorage.getItem('userToken')
      })
      app.username = JSON.parse(window.localStorage.getItem('profile')).name

      app.socket.on('connect', function(){
        app.fire('socket connected');
      });
    }
