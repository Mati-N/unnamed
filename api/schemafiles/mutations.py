import graphene
import graphql_jwt
from graphql_jwt.decorators import login_required
from graphene_file_upload.scalars import Upload
from ..models import *
from .Nodes import *

# JSON Web token generator which stores the user object
class ObtainJSONWebToken(graphql_jwt.relay.JSONWebTokenMutation):
    user = graphene.Field(UserNode)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)

# The mutation which create a comment
class CreateComment(graphene.relay.ClientIDMutation):
    class Input:
        post = graphene.ID()
        content = graphene.String()

    ok = graphene.Boolean()
    comment = graphene.Field(CommentNode)

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **input):
        ok = True
        comment_instance = Comment(user=info.context.user, post=Post.objects.get(pk=input["post"]), content=input["content"])
        comment_instance.save()

        return CreateComment(ok=ok, comment=comment_instance)

# The mustation which creates a post
class CreatePost(graphene.relay.ClientIDMutation):
    class Input:
        title = graphene.String()
        text = graphene.String()

    ok = graphene.Boolean()
    post = graphene.Field(PostNode)

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **input):
        ጥሩ = False
        title = input["title"]
        text = input["text"]
        post_instance = Post(user=info.context.user, title=title, text=text)
        post_instance.save()
        ጥሩ = True

        return CreatePost(ok=ጥሩ, post=post_instance)


class Follow(graphene.relay.ClientIDMutation):
    class Input:
        id = graphene.ID()

    ok = graphene.Boolean()
    user = graphene.Field(UserNode)
    message = graphene.String()

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **input):
        ok = False
        id = input["id"]
        user_instance = User.objects.get(id=id)
        if (user_instance == info.context.user):
            return Follow(ok=ok, user=info.context.user, message="Can't follow your self")
        ok = True
        follow_instance = Following.objects.filter(follower=info.context.user, target=user_instance)
        if len(follow_instance) > 0:
            follow_instance[0].delete()
            return Follow(ok=ok, user=user_instance, message="Unfollowed")

        follow_instance = Following(follower=info.context.user, target=User.objects.get(id=id))
        follow_instance.save()

        return Follow(ok=ok, user=user_instance, message="Followed")


class LikePost(graphene.relay.ClientIDMutation):
    class Input:
        post_id = graphene.ID()

    ok = graphene.Boolean()
    like = graphene.Field(LikeNode)
    post = graphene.Field(PostNode)

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **input):
        ok = True
        post_id = input["post_id"]
        post_instance = Post.objects.get(pk=post_id)
        like_instance = Like.objects.filter(user=info.context.user, post=post_instance)
        if len(like_instance) > 0:
            like_instance[0].delete()
            return LikePost(ok=ok, post=post_instance, like=None)

        like_instance = Like(user=info.context.user, post=post_instance)
        like_instance.save()

        return LikePost(ok=ok, post=post_instance,like=like_instance)


# A mutation used to create a user
class CreateUser(graphene.relay.ClientIDMutation):
    class Input:
        username = graphene.String()
        password = graphene.String()
        image = Upload()

    ok = graphene.Boolean()
    user = graphene.Field(UserNode)
    message = graphene.String()


    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        ok = False
        username = input["username"]
        password = input["password"]
        image = input["image"]
        if info.context.user.is_authenticated:
            return CreateUser(ok=ok, user=info.context.user, message="Already logged in")

        if User.objects.filter(username=username):
            return CreateUser(ok=ok, user=None, message="Username is already in use")

        ok = True
        user_instance = User(username=username)
        user_instance.set_password(password)
        if image is not None:
            user_instance.image = image
        user_instance.save()

        return CreateUser(ok=ok, user=user_instance)

class ReadNotification(graphene.relay.ClientIDMutation):
    class Input:
        id = graphene.ID()

    ok = graphene.Boolean()
    notification = graphene.Field(NotificationNode)

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **input):
        id = input["id"]
        ok = True
        notif = None
        
        if id is not None:
            try:
                notif = Notification.objects.get(pk=id, recipient=info.context.user)
                if notif.read == True:
                    notif.read = False
                else:
                    notif.read = True
                notif.save()
            except Notification.DoesNotExist:
                ok = False
        else:
            notif = Notification.objects.filter(recipient=info.context.user)
            notif.update(read=True)

        return ReadNotification(ok=ok, notification=notif)


# A mutation used to update a user's properties
class UpdateUser(graphene.relay.ClientIDMutation):
    class Input:
        username = graphene.String()
        password = graphene.String()
        newP = graphene.String()
        image = Upload()

    ok = graphene.Boolean()
    user = graphene.Field(UserNode)
    message = graphene.String()

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **input):
        password = input["password"]
        username = input["username"]
        newP = input["newP"]
        image = input["image"]
        ok = False
        message = None
        user_instance = info.context.user

        if not user_instance.check_password(password):
            return UpdateUser(ok=ok, user=user_instance, message="Password is invalid")


        if newP is not None:
            if len(newP) < 8:
                return UpdateUser(ok=ok, user=user_instance, message="Password is too short")
            user_instance.set_password(newP)
            message = "Password Changed"

        if username is not None:
            if (User.objects.filter(username=username).count() > 0):
                return UpdateUser(ok=ok, user=user_instance, message="Username is already in use")
            user_instance.username = username
            message = "Username Changed"

        if image is not None:
            user_instance.image = image
            message = "Profile Pic Changed"

        ok = True

        num = 0
        for el in [newP, username, image]:
            if el is not None:
                num += 1

        if num > 1:
            message == "Account Updated"

        user_instance.save()

        return UpdateUser(ok=ok, user=user_instance, message=message)
                
