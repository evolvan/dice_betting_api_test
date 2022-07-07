import {
  getUserList,
  getBetList,
  getUser,
  getBet,
  createBet,
  getBestBetPerUser,
} from "../utils";

export const resolvers = {
  Query: {
    getUser: (parent: any, { id }: any, { models }: any) => getUser(id),
    getUserList: () => getUserList(),
    getBet: (parent: any, { id }: any, { models }: any) => getBet(id),
    getBetList: () => getBetList(),
    getBestBetPerUser: (parent: any, { limit }: any, { models }: any) =>
      getBestBetPerUser(limit),
  },
  Mutation: {
    createBet: (
      parent: any,
      { userId, betAmount, chance }: any,
      { models }: any
    ) => createBet({ userId, betAmount, chance }),
  },
};
