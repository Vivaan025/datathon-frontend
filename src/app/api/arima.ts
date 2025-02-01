import { NextApiRequest, NextApiResponse } from 'next';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json([
        { date: "2024-01-01", actual: 100, predicted: 98 },
        { date: "2024-01-02", actual: 102, predicted: 101 },
        { date: "2024-01-03", actual: 105, predicted: 103 },
        { date: "2024-01-04", actual: 110, predicted: 107 },
      ]);
}