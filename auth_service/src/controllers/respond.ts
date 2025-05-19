import ClientError from '../errors/client_error';

export const respond = async (req: any, res: any, callback: () => Promise<any>) => {
    try {
        const data = await callback();
        const result = { data } as any;
        if (req._links) result._links = req._links;
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof ClientError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
