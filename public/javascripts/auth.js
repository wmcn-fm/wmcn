$(document).ready(function() {
  if (localStorage) {
    if (tokenToStore) {
      storeToken(tokenToStore);
    }
  }
});

function storeToken(token) {
  localStorage.setItem('wmcn_token', token);
  console.log(localStorage);
}
