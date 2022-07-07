import db from "../models";
import { users } from "../seeders/users";
import { bets } from "../seeders/bets";
import { QueryTypes } from "sequelize";

interface user {
  id: number;
  name: string;
  balance: number;
}

interface bet {
  id: number;
  userId: number;
  betAmount: number;
  chance: number;
  payout: number;
  win: boolean;
}

export const createUsers = () => {
  users.map((user) => {
    db.User.create(user);
  });
};

export const createBets = () => {
  bets.map((bet) => {
    db.Bet.create(bet);
  });
};

export const getUserList = async (): Promise<user[]> => {
  const allUsers = await db.User.findAll();
  const users = await allUsers.map((user: user) => {
    return {
      id: user.id,
      name: user.name,
      balance: user.balance,
    };
  });
  return users;
};

export const getUser = async (id: number): Promise<user> => {
  const user = await db.User.findOne({ where: { id } });
  return {
    id: user.id,
    name: user.name,
    balance: user.balance,
  };
};

export const getBetList = async (): Promise<bet[]> => {
  const betdata = await db.Bet.findAll();
  const bets = await betdata.map((bet: bet) => {
    return {
      id: bet.id,
      userId: bet.userId,
      betAmount: bet.betAmount,
      chance: bet.chance,
      payout: bet.payout,
      win: bet.win,
    };
  });
  return bets;
};

export const getBet = async (id: number): Promise<bet> => {
  const betdata = await db.Bet.findOne({ where: { id } });
  return {
    id: betdata.id,
    userId: betdata.userId,
    betAmount: betdata.betAmount,
    chance: betdata.chance,
    payout: betdata.payout,
    win: betdata.win,
  };
};

export const createBet = async (args: any): Promise<bet> => {
  const multiplier = 1 / args.chance;
  const payout = multiplier * args.betAmount;
  const win = Math.random() < 0.5;
  const user = await db.User.findOne({ where: { id: args.userId } });
  const oldBalance = user.balance;
  if (args.betAmount > oldBalance) {
    return {
      id: 0,
      userId: 0,
      betAmount: 0,
      chance: 0,
      payout: 0,
      win: false,
    };
  }
  let newBalance = oldBalance - args.betAmount;

  if (win) {
    newBalance += payout;
  }

  await user.update({ balance: newBalance });
  const betdata = await db.Bet.create({
    userId: args.userId,
    betAmount: args.betAmount,
    chance: args.chance,
    payout: payout,
    win: win,
  });
  return {
    id: betdata.id,
    userId: betdata.userId,
    betAmount: betdata.betAmount,
    chance: betdata.chance,
    payout: betdata.payout,
    win: betdata.win,
  };
};

export const getBestBetPerUser = async (limit: number): Promise<bet[]> => {
  const betdata = await db.sequelize.query(
    'SELECT * FROM public."Bets" WHERE win = TRUE AND ("userId", payout) IN ' +
      '(SELECT "userId", MAX(payout) FROM public."Bets" WHERE win = TRUE GROUP BY "userId") LIMIT ?',
    { replacements: [limit], type: QueryTypes.SELECT }
  );
  const bets = await betdata.map((bet: bet) => {
    return {
      id: bet.id,
      userId: bet.userId,
      betAmount: bet.betAmount,
      chance: bet.chance,
      payout: bet.payout,
      win: bet.win,
    };
  });
  return bets;
};
