const {
    graphql,
    GraphQLSchema, GraphQLObjectType, GraphQLList,
    GraphQLNonNull, GraphQLScalarType, GraphQLInterfaceType,
    GraphQLEnumType, 
    GraphQLString, GraphQLID, kind,
    GraphQLInputObjectType
} = require("graphql");

const stubUser = {
    id: 1,
    first_name: "Brian",
    last_name: "Kennedy",
    email: "bob.dylan@lorem.com",
    friends: ['Tom', 'Bob', 'Jade'],
    work_state: 2,
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

graphql(
    schema,
    `query {
        user(filter: {
            name: "Kennedy"
        }) {
            id
            first_name
            last_name
            email
            friends
            work_state
            created_at
            updated_at
        }
    }`
).then(res=>{
    console.log('res >>', res);
    const { user, updateUser } = res?.data;
    const dataObj = user || updateUser;
    console.log(' ⤷ id: ', dataObj?.id);
    console.log(' ⤷ friends: ', dataObj?.friends);
}).catch(err=>{
    console.error(err);
});

graphql(
    schema,
    `mutation {
        updateUser(input: {
            id: 1,
            first_name: "Kevin"
        }) {
            id
            first_name
            last_name
            email
            friends
            work_state
            created_at
            updated_at
        }
    }`
).then(res=>{
    console.log('res >>', res);
    const { user, updateUser } = res?.data;
    const dataObj = user || updateUser;
    console.log(' ⤷ id: ', dataObj?.id);
    console.log(' ⤷ friends: ', dataObj?.friends);
}).catch(err=>{
    console.error(err);
});