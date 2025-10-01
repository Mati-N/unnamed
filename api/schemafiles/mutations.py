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
        comment_instance = Comment(user=info.context.user, post=Post.objects.get(
            pk=input["post"]), content=input["content"])
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
        title = (input.get("title") or "").strip()
        text = (input.get("text") or "").strip()

        if not title or not text:
            return CreatePost(ok=False, post=None)

        post_instance = Post(user=info.context.user, title=title, text=text)
        post_instance.save()

        return CreatePost(ok=True, post=post_instance)


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
        follow_instance = Following.objects.filter(
            follower=info.context.user, target=user_instance)
        if len(follow_instance) > 0:
            follow_instance[0].delete()
            return Follow(ok=ok, user=user_instance, message="Unfollowed")

        follow_instance = Following(
            follower=info.context.user, target=User.objects.get(id=id))
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
        like_instance = Like.objects.filter(
            user=info.context.user, post=post_instance)
        if len(like_instance) > 0:
            like_instance[0].delete()
            return LikePost(ok=ok, post=post_instance, like=None)

        like_instance = Like(user=info.context.user, post=post_instance)
        like_instance.save()

        return LikePost(ok=ok, post=post_instance, like=like_instance)


# A mutation used to create a user
class CreateUser(graphene.relay.ClientIDMutation):
    class Input:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        image = Upload()
        bio = graphene.String()

    ok = graphene.Boolean()
    user = graphene.Field(UserNode)
    message = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        username = (input.get("username") or "").strip()
        password = input.get("password") or ""
        image = input.get("image")
        bio = input.get("bio")

        if not username or not password:
            return CreateUser(ok=False, user=None, message="Username and password are required")

        if info.context.user.is_authenticated:
            return CreateUser(ok=False, user=info.context.user, message="Already logged in")

        if User.objects.filter(username__iexact=username).exists():
            return CreateUser(ok=False, user=None, message="Username is already in use")

        user_instance = User(username=username)
        user_instance.set_password(password)
        if bio is not None:
            user_instance.bio = bio.strip()
        if image is not None:
            user_instance.profile_image = image
        user_instance.save()

        return CreateUser(ok=True, user=user_instance, message="Account created successfully")


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
                notif = Notification.objects.get(
                    pk=id, recipient=info.context.user)
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
        password = graphene.String(required=True)
        newP = graphene.String()
        image = Upload()
        bio = graphene.String()

    ok = graphene.Boolean()
    user = graphene.Field(UserNode)
    message = graphene.String()

    @classmethod
    @login_required
    def mutate_and_get_payload(cls, root, info, **input):
        password = input.get("password")
        username = input.get("username")
        new_password = input.get("newP")
        image = input.get("image")
        bio = input.get("bio")
        user_instance = info.context.user

        if not user_instance.check_password(password):
            return UpdateUser(ok=False, user=user_instance, message="Password is invalid")

        updates = []

        if new_password:
            if len(new_password) < 8:
                return UpdateUser(ok=False, user=user_instance, message="Password is too short")
            user_instance.set_password(new_password)
            updates.append("password")

        if username is not None and username != user_instance.username:
            if User.objects.filter(username__iexact=username).exclude(pk=user_instance.pk).exists():
                return UpdateUser(ok=False, user=user_instance, message="Username is already in use")
            user_instance.username = username.strip()
            updates.append("username")

        if image is not None:
            user_instance.profile_image = image
            updates.append("profile picture")

        if bio is not None:
            user_instance.bio = bio.strip()
            updates.append("bio")

        if not updates:
            return UpdateUser(ok=False, user=user_instance, message="No updates were applied")

        user_instance.save()

        friendly = {
            "password": "Password",
            "username": "Username",
            "profile picture": "Profile picture",
            "bio": "Bio",
        }

        nice_updates = [friendly[item] for item in updates]
        if len(nice_updates) == 1:
            message = f"{nice_updates[0]} updated"
        else:
            message = "Updated " + ", ".join(nice_updates[:-1]) + f" and {nice_updates[-1]}"

        return UpdateUser(ok=True, user=user_instance, message=message)
