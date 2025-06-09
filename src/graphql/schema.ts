import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInterfaceType,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { getUser } from '@/controllers/users.js';

const users = [
  { id: 1, name: 'Alice', password: 'alice123' },
  { id: 2, name: 'Bob', password: 'bob456' },
  { id: 3, name: 'Charlie', password: 'charlie789' },
  { id: 4, name: 'Diana', password: 'diana321' },
];
// const userInterface: GraphQLInterfaceType = new GraphQLInterfaceType({
//   name: 'user',
//   fields: () => ({
//     id: {
//       type: new GraphQLNonNull(GraphQLInt),
//     },
//     name: {
//       type: GraphQLString,
//     },
//     password: {
//       type: GraphQLString,
//     },
//   }),
//   resolveType(character) {
//     switch (character.type) {
//       case 'User':
//         return UserType.name;
//     }
//   },
// });

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A humanoid creature in the Star Wars universe.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  }),
  // interfaces: [userInterface],
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: () => users,
    },
    user: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        console.log(parent, args);
        return users.find((user: any) => {
          const [key] = Object.keys(user);
          return user[key] === args[key];
        });
      },
    },
  },
});

const querySchema = new GraphQLSchema({
  query: queryType,
  types: [UserType],
});

const res = await graphql({
  schema: querySchema,
  source: '{user(id:1){name}}',
});
console.log(res);
