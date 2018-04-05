const graphQL = require("graphql");
// This library are usefull to load fake data at the beginin of projects.
const lodash = require("lodash");
// This library take ability to send http request from api (GET|POST|PUT...).
const axios = require("axios");

// @todo usage of APOLLO to refactor this part.s
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphQL;

/* 
Example to found a companies details and associated users worked on :
To avoid query duplication we use Fragments and two alliases to isolate each, 
companies we need to see.

 @code
    {
    Buldee: company(id: "2") {
        ...CompanyDetails
        user {
        ...UserDetails
        }
    }
    Neolynk: company(id: "1") {
        ...CompanyDetails
        user {
        ...UserDetails
        }
    }
    }

    fragment CompanyDetails on company {
    name
    id
    }

    fragment UserDetails on User {
    id
    firstName
    age
    }
@endcode
*/
const CompanyType = new GraphQLObjectType({
  name: "company",
  // That () = ({}) syntax take ability to load CompanyType when,
  // compile of code are completed. in our case we have a bi-directional,
  // references between user & companies.
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    user: {
      // Verry important to define a new List type here because lot of users,
      // can match with that request.
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(response => {
            return response.data;
          });
      }
    }
  })
});

/* 
Example to found a user from API :

 @code
{
  Buldee: user(id: "2") {
    ...UserDetails
    company {
      ...CompanyDetails
    }
  }
}

fragment CompanyDetails on company {
  name
  id
}

fragment UserDetails on User {
  id
  firstName
  age
}
@endcode
*/
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(response => {
            return response.data;
          });
      }
    }
  })
});

/*
To use these mutation you must use mutation first. 

Then you can use all of mutation provided by MutationType object like :

Adding user in API : 
@code
    mutation {
    addUser(
        firstName: "annonymous 2",
        age: 36,
        companyId: "1"
    ) {
        id
    }
    }
@endcode

Delete user in API :
(In that example the API are verry simple ATM because that's a fake api and that simple,
api can't return any data when you DELETE this is why all fields return 'null' but if,
you see your API the user id given are correctly deleted.)
@code
    mutation {
    deleteUser(id: "XXXXX")
    {
        id
        firstName
    }
    }
@endcode
*/
const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    // Add new users from API.
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .post(`http://localhost:3000/users`, {
            firstName: args.firstName,
            age: args.age,
            companyId: args.companyId
          })
          .then(response => {
            return response.data;
          });
      }
    },

    // Delete user from API.
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios
          .delete(`http://localhost:3000/users/${args.id}`)
          .then(response => {
            return response.data;
          });
      }
    }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(response => {
            return response.data;
          });
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(response => {
            return response.data;
          });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: MutationType
});
