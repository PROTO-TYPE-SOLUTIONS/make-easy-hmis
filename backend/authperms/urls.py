from django.urls import path

# views
from .views import (
    GroupsAPIView,
    AddGroupAPIView,
    EditGroupNameAPIView,
    DeleteGroupAPIView,
    RemoveUserFromGroupAPIView,
    GroupAPIView,
    UserGroupsAPIView,
    AddUserToGroupAPIView,
    PermissionsAPIView,
    PermissionAPIView,
    AddPermissionAPIView,
    DeletePermissionAPIView,
    AddPermissionsToUserAPIView,
    EditPermissionAPIView,
    UserPermissionsAPIView,
    RemovePermissionsFromUserAPIView,
)

urlpatterns = [
    # groups
    path("groups", GroupsAPIView.as_view(), name="groups"),
    path("groups/<int:group_id>", GroupAPIView.as_view(), name="group"),
    path("groups/add", AddGroupAPIView.as_view(), name="add-group"),
    path("groups/<str:group_name>/edit", EditGroupNameAPIView.as_view(), name="edit-group"),
    path("groups/<str:group_name>/delete", DeleteGroupAPIView.as_view(), name="delete-group"),
    path("groups/add-user/<str:user_id>", AddUserToGroupAPIView.as_view(), name="add-user-to-group"),
    path("groups/user/<str:user_id>", UserGroupsAPIView.as_view(), name="user-groups"),
    path("groups/remove-user/<str:user_id>", RemoveUserFromGroupAPIView.as_view(), name="remove-user-from-group"),
    # permissions
    path("permissions", PermissionsAPIView.as_view(), name="permissions"),
    path("permissions/<int:permission_id>", PermissionAPIView.as_view(), name="permission"),
    path("permissions/add", AddPermissionAPIView.as_view(), name="add-permission"),
    path("permissions/<int:permission_id>/delete", DeletePermissionAPIView.as_view(), name="delete-permission"),
]