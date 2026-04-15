import { Request, Response } from 'express';
import * as DemandesService from '../services/demandes.service';

export const submitDemande = async (req: Request, res: Response) => {
  const payload = req.body;
  const created = await DemandesService.createDemande(payload);
  res.status(201).json(created);
};
