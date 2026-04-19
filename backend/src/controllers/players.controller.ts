import { Request, Response, NextFunction } from "express";
import * as playersService from "../services/players.service";
import { PlayersQuery } from "../schemas/players.schema";

export async function getPlayers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await playersService.findPlayers(
      req.query as unknown as PlayersQuery
    );
    res.json({ data: result.players, meta: result.meta, error: null });
  } catch (err) {
    next(err);
  }
}

export async function getPlayerById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id as string);
    const player = await playersService.findPlayerById(id);
    res.json({ data: player, error: null });
  } catch (err) {
    next(err);
  }
}

export async function comparePlayers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ids = (req.query.ids as string)
      .split(",")
      .map((id) => parseInt(id));
    const players = await playersService.findPlayersToCompare(ids);
    res.json({ data: players, error: null });
  } catch (err) {
    next(err);
  }
}

export async function getPositions(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const positions = await playersService.findPositions();
    res.json({ data: positions, error: null });
  } catch (err) {
    next(err);
  }
}

export async function getNationalities(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const nationalities = await playersService.findNationalities();
    res.json({ data: nationalities, error: null });
  } catch (err) {
    next(err);
  }
}