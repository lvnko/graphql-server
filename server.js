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
        email(masked: Boolean = true): String
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
    },
    User: {
        email: ({ email }, { masked }, context, info)=>{
            console.log('User => email => email ', email);
            console.log('User => email => masked ', masked);
            if (masked) {
                let result = [];
                const initMatches = email.match(/(\w{3})[\w.-]+@([\w.]+\w)/);
                // console.log('initMatches', initMatches);
                if (initMatches !== null) {
                    result = [
                        initMatches[1]
                    ];
                } else {
                    return email.split('@').map((p, index)=>index===0?p.replace(/\S/g,'*'):'@'+p);
                }
                
                const midMatches = initMatches[0].split('@')[0].replace(initMatches[1],'').match(/(\S{3})[\w.-]+/);
                if (midMatches !== null) {
                    // console.log('midMatches is not NULL', midMatches);
                    result = [
                        ...result,
                        midMatches[1].replace(/\S/g,"*")
                    ];

                    const lastMatches = midMatches[0].replace(midMatches[1],'').match(/^(.*)..$/);
                    // console.log('lastMatches is not NULL', lastMatches);
                    if (lastMatches !== null) {
                        result = [
                            ...result,
                            lastMatches[1].replace(/\S/g,"*"),
                            lastMatches[0].replace(lastMatches[1], ""),
                        ];
                    }
                } else {
                    result = [
                        ...result,
                        initMatches[0].replace(initMatches[1],'').replace('@'+initMatches[2],'').replace(/\S/g,'*')
                    ];
                }
                return [ ...result, '@', initMatches[2] ].join('');

                // return [
                //     initMatches[1],
                //     midMatches[1].replace(/\S/g,"*"),
                //     lastMatches[1].replace(/\S/g,"*"),
                //     lastMatches[0].replace(lastMatches[1], ""),
                //     '@',
                //     initMatches[0].split('@')[1]
                // ].join('');
            }
            return email;
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