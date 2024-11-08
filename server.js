const {
    graphql, GraphQLScalarType, kind,
    buildSchema
} = require("graphql");
const { ApolloServer, gql } = require("apollo-server");

const stubUser = {
    id: 1,
    first_name: "Brian",
    last_name: "Kennedy",
    email: "bob.dylan@lorem.com",
    friends: ['Tom', 'Bob', 'Jade'],
    gender: "M",
    work_state: 'PROGRESS',
    created_at: new Date(),
    updated_at: new Date()
};

const typeDefs = gql`
    enum WorkState {
        STOP
        PROGRESS
        COMPLETED
    }
    enum Gender {
        M
        F
    }
    type User {
        id: ID!
        first_name: String
        last_name: String
        email: String
        gender: Gender
        friends: [String]
        work_state: WorkState
    }
    type Query {
        user: User
    }
    input UpdateUserInputType {
        id: ID!
        first_name: String
        last_name: String
        email: String
        gender: Gender
        friends: [String]
        work_state: WorkState
    }
    type UpdateUserPayload {
        status: String
        payload: User
        message: String
        errors: [String]
    }
    type Mutation {
        updateUser(input: UpdateUserInputType): UpdateUserPayload
    }
`;

const resolvers = {
    Query: {
        user: (root, args, context, info)=>{
            return stubUser;
        }
    },
    Mutation: {
        updateUser: (root, args, context, info)=>{
            const { id, ...fields } = args.input;
            console.log('mutation => fields ', fields);
            let result = null;
            if (parseInt(id, 10) === stubUser.id) {
                Object.keys(fields).forEach((field)=>{
                    stubUser[field] = fields[field];
                });
                result = {
                    ...stubUser,
                };
            }
            return {
                payload: result,
                status: 200,
                message: result ? "Success" : "User cannot be found with the id given...",
                errors: null
            }
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen(8891, ()=>{
    console.log(`Apollo GraphQL Server run on port 8891!`);
});

// const DateType = new GraphQLScalarType({
//     name: 'Date',
//     parseValue(value) {
//         return new Date(value);
//     },
//     serialize(value) {
//         return value.getTime();
//     },
//     parseLiteral(ast) {
//         if (ast.kind === kind.INT) {
//             return new Date(+ast.value);
//         }
//         return null;
//     }
// });

// const sdlSchema = buildSchema(`
//     type Query {
//         user(filter: UserFilterInput): User
//     }
//     type User {
//         id: ID!
//         first_name: String
//         last_name: String
//         email: String
//         gender: String
//         friends: [String]
//         work_state: WorkState
//     }
//     enum WorkState {
//         STOP
//         PROGRESS
//         COMPLETED
//     }
//     type Mutation {
//         updateUser(input: UpdateUserInput): UpdateUserPayload
//     }
//     input UpdateUserInput {
//         id: ID!
//         first_name: String
//         last_name: String
//         email: String
//         gender: String
//         friends: [String]
//         work_state: WorkState
//     }
//     input UserFilterInput {
//         id: ID
//         name: String
//         email: String
//         gender: String
//         friends: [String]
//         work_state: WorkState
//     }
//     type UpdateUserPayload {
//         success: Boolean!
//         result: User
//     }
// `);

// const root = {
//     user: ({filter: {id, ...options}}) => {
//         // console.log('root => options', Object.keys(options).length);
//         if (id !== undefined) {
//             if (parseInt(id, 10) === stubUser.id)
//                 return stubUser;
//         }
//         if (Object.keys(options).length) {
//             const { name, gender, email, friends, work_state } = options;
//             if (name) {
//                 const { first_name, last_name } = stubUser;
//                 if (first_name.indexOf(name) >= 0 || last_name.indexOf(name) >= 0)
//                     return stubUser;
//             }
//             if (gender && gender === stubUser.gender)
//                 return stubUser;
//             if (email && email === stubUser.email)
//                 return stubUser;
//             if (friends && friends.length > 0 && stubUser.friends.length > 0)
//                 return friends.some(friend => stubUser.friends.includes(friend)) ? stubUser : null;
//             if (work_state && work_state === stubUser.work_state)
//                 return stubUser;
//         }
//         return null;
//     },
//     updateUser: ({input}) => {
//         console.log('root => input', input);
//         const { id, fields } = input;
//         if (id !== undefined) {
//             if (parseInt(id, 10) === stubUser.id)
//                 return {
//                     success: true,
//                     result:  {
//                         ...stubUser,
//                         ...fields
//                     }
//                 };
//         }
//         return {
//             success: false,
//             result: null
//         };
//     }
// };

// const queryResHandler = (res) => {
//     console.log('res >>', res);
//     const { user } = res?.data;
//     console.log(' ⤷ id: ', user?.id);
//     console.log(' ⤷ friends: ', user?.friends);
// }

// const mutateResHandler = (res) => {
//     const { updateUser: { success, result: dataObj } } = res?.data;
//     console.log('result >>', dataObj);
//     console.log(' ⤷ id: ', dataObj?.id);
//     console.log(' ⤷ friends: ', dataObj?.friends);
// }

// graphql(
//     sdlSchema,
//     `query {
//         user(filter: { work_state: PROGRESS }) {
//             id
//             first_name
//             last_name
//             email
//             friends
//             work_state
//         }
//     }`,
//     root
// ).then(queryResHandler).catch(err=>{
//     console.error(err);
// });

// graphql(
//     sdlSchema,
//     `mutation {
//         updateUser(input: {
//             id: 1,
//             first_name: "Kevin"
//         }) {
//             success
//             result {
//                 id
//                 first_name
//                 last_name
//                 email
//                 friends
//                 work_state
//             }
//         }
//     }`,
//     root
// ).then(mutateResHandler).catch(err=>{
//     console.error(err);
// });