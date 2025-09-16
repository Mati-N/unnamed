import graphene

import api.schema


class Query(api.schema.Query, graphene.ObjectType):
    """Aggregate GraphQL queries."""


class Mutation(api.schema.Mutation, graphene.ObjectType):
    """Aggregate GraphQL mutations."""


schema = graphene.Schema(query=Query, mutation=Mutation)
