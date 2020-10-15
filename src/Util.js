function getcsrftoken() {
    let cookiedata = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN'));
    return cookiedata.split('=')[1];
}

export { getcsrftoken };