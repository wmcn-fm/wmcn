function storeToken(token) {
  if (localStorage) {
    localStorage.setItem('wmcn_token', token);
    console.log(localStorage);
  } else {
    alert('Local storage is not supported on this browser');
  }

}
