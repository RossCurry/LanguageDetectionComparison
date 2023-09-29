import fetch from 'node-fetch';
export default async (req, res, next) => {
    const text = req.query.text;
    if (!text || typeof text !== "string")
        throw new Error('Missing text query from params');
    try {
        const baseUrl = 'http://server-python:5000';
        const url = new URL(baseUrl);
        url.pathname = 'detect';
        url.searchParams.set('text', text);
        console.log('url.toString()', url.toString());
        const pyhtonResults = await fetch(url.toString(), {
            headers: {
                'Content-type': 'application/json'
            }
        });
        const asJson = await pyhtonResults.json();
        req.body = asJson;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    finally {
        next();
    }
};
