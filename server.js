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