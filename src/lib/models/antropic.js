const options = {
  method: 'GET',
  headers: {'x-api-key': '<x-api-key>', 'anthropic-version': '<anthropic-version>'}
};

fetch('https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));