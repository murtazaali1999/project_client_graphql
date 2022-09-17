//const { projects, clients } = require("./sampleData");

const Project = require("../models/project")
const Client = require("../models/clients")

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
} = require("graphql");
const project = require("../models/project");
const { findByIdAndDelete } = require("../models/project");


//TYPE
const clientType = new GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

const projectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: clientType,
            resolve(parent, args) {
                return Client.findOne(parent.clientId);
            }
        },
    })
});

//QUERY

const rootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        clients: {
            type: new GraphQLList(clientType),
            resolve(parent, args) {
                return Client.find();
            }
        },
        client: {
            type: clientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        },
        projects: {
            type: new GraphQLList(projectType),
            resolve(parent, args) {
                return Project.find();
            }
        },
        project: {
            type: projectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        }
    }
});

//MUTATION
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addProject: {
            type: projectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: "project0status",
                        values: {
                            "new": { value: "Not Started" },
                            "progress": { value: "In Progress" },
                            "completed": { value: "Completed" },
                        }
                    }),
                    default: "Not Started"
                },
                clientId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })

                const response = await (await project.save()).populate("clientId");
                console.log(response);

                return response;
            }
        },
        updateProject: {
            type: projectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: "projectStatusUpdate",
                        values: {
                            "new": { value: "Not Started" },
                            "progress": { value: "In Progress" },
                            "completed": { value: "Completed" },
                        }
                    }),
                },
                clientId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status
                    }
                },
                    { new: true }
                );
            }
        },
        deleteProject: {
            type: projectType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Project.findByIdAndDelete(args.id);
            }
        },

        addClient: {
            type: clientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })

                return client.save();
            }
        },
        updateClient: {
            type: clientType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Client.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone
                    }
                },
                    { new: true }
                )
            }
        },
        deleteClient: {
            type: clientType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Client.findByIdAndDelete(args.id);
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: rootQuery,
    mutation
})