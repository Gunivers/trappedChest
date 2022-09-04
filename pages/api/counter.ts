import { NextApiRequest, NextApiResponse } from 'next';
import { getDownloadNumber } from '../../lib/downloadCounter';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    return res.status(200).json({ download: await getDownloadNumber() })
};