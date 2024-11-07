const {
    graphql,
    GraphQLSchema, GraphQLObjectType, GraphQLList,
    GraphQLNonNull, GraphQLScalarType, GraphQLInterfaceType,
    GraphQLEnumType, 
    GraphQLString, GraphQLID, kind,
    GraphQLInputObjectType,
    buildSchema
} = require("graphql");

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

const DateType = new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
        return new Date(value);
    },
    serialize(value) {
        return value.getTime();
    },
    parseLiteral(ast) {
        if (ast.kind === kind.INT) {
            return new Date(+ast.value);
        }
        return null;
    }
});

const DateTimeInterface = new GraphQLInterfaceType({
    name: 'DateTimeInterface',
    fields: {
        created_at: {
            type: DateType
        },
        updated_at: {
            type: DateType
        }
    }
});

const WorkStateType = new GraphQLEnumType({
    name: "WrokState",
    values: {
        STOP: {
            value: 0
        },
        PROGRESS: {
            value: 1
        },
        COMPLETED: {
            value: 2
        }
    }
});

const UserGeneralFields = {
    id: {
        type: GraphQLNonNull(GraphQLID)
    },
    email: {
        type: GraphQLString
    },
    first_name: {
        type: GraphQLString
    },
    last_name: {
        type: GraphQLString
    },
    gender: {
        type: GraphQLString
    },
    friends: {
        type: GraphQLList(GraphQLString) // ['Tom', 'Bob', 'Jade']
    },
    work_state: {
        type: WorkStateType
    },
};

const UserType = new GraphQLObjectType({
    name: `User`,
    interfaces: [DateTimeInterface],
    fields: {
        ...UserGeneralFields,
        created_at: {
            type: DateType
        },
        updated_at: {
            type: DateType
        }
    }
});

const UserFilterInputType = new GraphQLInputObjectType({
    name: 'UserFilterInput',
    fields: {
        name: {
            type: GraphQLString
        }
    }
});

const UpdateUserInputType = new GraphQLInputObjectType({
    name: "UpdateUserInput",
    fields: {
        ...UserGeneralFields
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: UserType,
                resolve: (parent, args)=>{
                    console.log("args => ", args);
                    const { id, filter: { name } } = args;
                    if (
                        (
                            name && (
                                name === stubUser.first_name ||
                                name === stubUser.last_name
                            ) 
                        ) ||
                        id !== undefined && id === String(stubUser.id)
                    ) {
                        return stubUser;
                    }
                    return null;
                },
                args: {
                    id: {
                        type: GraphQLID
                    },
                    filter: {
                        type: UserFilterInputType
                    }
                }
            },
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            updateUser: {
                type: UserType,
                resolve: (root, { input }) => {
                    console.log('UpdateUserInputType : input => ', input);
                    const { id, ...values } = input;
                    if (parseInt(id, 10) === stubUser.id) {

                        return {
                            ...stubUser,
                            ...values
                        };
                    }
                    return null;
                },
                args: {
                    input: {
                        type: UpdateUserInputType
                    }
                }
            }
        }
    })
});

const sdlSchema = buildSchema(`
    type Query {
        user(filter: UserFilterInput): User
    }
    type User {
        id: ID!
        first_name: String
        last_name: String
        email: String
        gender: String
        friends: [String]
        work_state: WorkState
    }
    enum WorkState {
        STOP
        PROGRESS
        COMPLETED
    }
    type Mutation {
        updateUser(input: UpdateUserInput): UpdateUserPayload
    }
    input UpdateUserInput {
        id: ID!
        first_name: String
        last_name: String
        email: String
        gender: String
        friends: [String]
        work_state: WorkState
    }
    input UserFilterInput {
        id: ID
        name: String
        email: String
        gender: String
        friends: [String]
        work_state: WorkState
    }
    type UpdateUserPayload {
        success: Boolean!
        result: User
    }
`);

const root = {
    user: ({filter: {id, ...options}}) => {
        // console.log('root => options', Object.keys(options).length);
        if (id !== undefined) {
            if (parseInt(id, 10) === stubUser.id)
                return stubUser;
        }
        if (Object.keys(options).length) {
            const { name, gender, email, friends, work_state } = options;
            if (name) {
                const { first_name, last_name } = stubUser;
                if (first_name.indexOf(name) >= 0 || last_name.indexOf(name) >= 0)
                    return stubUser;
            }
            if (gender && gender === stubUser.gender)
                return stubUser;
            if (email && email === stubUser.email)
                return stubUser;
            if (friends && friends.length > 0 && stubUser.friends.length > 0)
                return friends.some(friend => stubUser.friends.includes(friend)) ? stubUser : null;
            if (work_state && work_state === stubUser.work_state)
                return stubUser;
        }
        return null;
    },
    updateUser: ({input}) => {
        console.log('root => input', input);
        const { id, fields } = input;
        if (id !== undefined) {
            if (parseInt(id, 10) === stubUser.id)
                return {
                    success: true,
                    result:  {
                        ...stubUser,
                        ...fields
                    }
                };
        }
        return {
            success: false,
            result: null
        };
    }
};

const queryResHandler = (res) => {
    console.log('res >>', res);
    const { user } = res?.data;
    console.log(' ⤷ id: ', user?.id);
    console.log(' ⤷ friends: ', user?.friends);
}

const mutateResHandler = (res) => {
    const { updateUser: { success, result: dataObj } } = res?.data;
    console.log('result >>', dataObj);
    console.log(' ⤷ id: ', dataObj?.id);
    console.log(' ⤷ friends: ', dataObj?.friends);
}

graphql(
    sdlSchema,
    `query {
        user(filter: { work_state: PROGRESS }) {
            id
            first_name
            last_name
            email
            friends
            work_state
        }
    }`,
    root
).then(queryResHandler).catch(err=>{
    console.error(err);
});

graphql(
    sdlSchema,
    `mutation {
        updateUser(input: {
            id: 1,
            first_name: "Kevin"
        }) {
            success
            result {
                id
                first_name
                last_name
                email
                friends
                work_state
            }
        }
    }`,
    root
).then(mutateResHandler).catch(err=>{
    console.error(err);
});