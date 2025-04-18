import ClientError from '../errors/clientError.js';

export const respond = async (req, res, callback) => {
    try {
        const data = await callback();
        const result = { data };
        if (req._links) result._links = req._links;
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof ClientError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error(error); // Log the error for debugging
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
