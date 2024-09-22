import { Request, Response } from 'express';
import { getUser } from '../services/getUser';

export const getUserControle = async (req: Request, res: Response) => {
    try {
        const { name, email, cpf } = req.body;

        const user = await getUser({ name, email, cpf });
        res.send(user.displayName());
    } catch (e: unknown) {

        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send('Erro desconhecido.');
        }
    }
};
