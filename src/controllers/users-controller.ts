import {Request, Response} from 'express';

export const getUser = (req: Request, res: Response) => {
    res.status(200).json({nome: 'Fabio Silva', id: 1, cargo: 'Técnido de Enfermagem'});
};
