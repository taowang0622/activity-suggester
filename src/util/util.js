const logger = require("./logger");

async function fetchWrapper(url) {
    logger.debug(`sending a request to ${url}`)
    let response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed getting data from '${url}';HTTP status code: ${response.status}`);
    }

    return await response.json();
}

module.exports = {
    fetchWrapper
}