import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
import { type Interpolation, type Theme } from "@emotion/react";
import { type FC } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type * as TypesGen from "api/typesGenerated";
import { ChooseOne, Cond } from "components/Conditionals/ChooseOne";
import { AvatarData } from "components/AvatarData/AvatarData";
import { AvatarDataSkeleton } from "components/AvatarData/AvatarDataSkeleton";
import { EmptyState } from "components/EmptyState/EmptyState";
import {
  TableLoaderSkeleton,
  TableRowSkeleton,
} from "components/TableLoader/TableLoader";
import { EnterpriseBadge } from "components/Badges/Badges";
import HideSourceOutlined from "@mui/icons-material/HideSourceOutlined";
import KeyOutlined from "@mui/icons-material/KeyOutlined";
import GitHub from "@mui/icons-material/GitHub";
import PasswordOutlined from "@mui/icons-material/PasswordOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import { LastSeen } from "components/LastSeen/LastSeen";
import { UserRoleCell } from "./UserRoleCell";
import { type GroupsByUserId } from "api/queries/groups";
import { UserGroupsCell } from "./UserGroupsCell";
import {
  MoreMenu,
  MoreMenuTrigger,
  MoreMenuContent,
  MoreMenuItem,
  ThreeDotsButton,
} from "components/MoreMenu/MoreMenu";
import Divider from "@mui/material/Divider";

dayjs.extend(relativeTime);

interface UsersTableBodyProps {
  users: TypesGen.User[] | undefined;
  groupsByUserId: GroupsByUserId | undefined;
  authMethods?: TypesGen.AuthMethods;
  roles?: TypesGen.AssignableRoles[];
  isUpdatingUserRoles?: boolean;
  canEditUsers: boolean;
  isLoading: boolean;
  canViewActivity?: boolean;
  onSuspendUser: (user: TypesGen.User) => void;
  onDeleteUser: (user: TypesGen.User) => void;
  onListWorkspaces: (user: TypesGen.User) => void;
  onViewActivity: (user: TypesGen.User) => void;
  onActivateUser: (user: TypesGen.User) => void;
  onResetUserPassword: (user: TypesGen.User) => void;
  onUpdateUserRoles: (
    user: TypesGen.User,
    roles: TypesGen.Role["name"][],
  ) => void;
  isNonInitialPage: boolean;
  actorID: string;
  // oidcRoleSyncEnabled should be set to false if unknown.
  // This is used to determine if the oidc roles are synced from the oidc idp and
  // editing via the UI should be disabled.
  oidcRoleSyncEnabled: boolean;
}

export const UsersTableBody: FC<
  React.PropsWithChildren<UsersTableBodyProps>
> = ({
  users,
  authMethods,
  roles,
  onSuspendUser,
  onDeleteUser,
  onListWorkspaces,
  onViewActivity,
  onActivateUser,
  onResetUserPassword,
  onUpdateUserRoles,
  isUpdatingUserRoles,
  canEditUsers,
  canViewActivity,
  isLoading,
  isNonInitialPage,
  actorID,
  oidcRoleSyncEnabled,
  groupsByUserId,
}) => {
  return (
    <ChooseOne>
      <Cond condition={Boolean(isLoading)}>
        <TableLoaderSkeleton>
          <TableRowSkeleton>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AvatarDataSkeleton />
              </Box>
            </TableCell>

            <TableCell>
              <Skeleton variant="text" width="25%" />
            </TableCell>

            <TableCell>
              <Skeleton variant="text" width="25%" />
            </TableCell>

            <TableCell>
              <Skeleton variant="text" width="25%" />
            </TableCell>

            <TableCell>
              <Skeleton variant="text" width="25%" />
            </TableCell>

            {canEditUsers && (
              <TableCell>
                <Skeleton variant="text" width="25%" />
              </TableCell>
            )}
          </TableRowSkeleton>
        </TableLoaderSkeleton>
      </Cond>

      <Cond condition={!users || users.length === 0}>
        <ChooseOne>
          <Cond condition={isNonInitialPage}>
            <TableRow>
              <TableCell colSpan={999}>
                <Box p={4}>
                  <EmptyState message="No users found on this page" />
                </Box>
              </TableCell>
            </TableRow>
          </Cond>

          <Cond>
            <TableRow>
              <TableCell colSpan={999}>
                <Box p={4}>
                  <EmptyState message="No users found" />
                </Box>
              </TableCell>
            </TableRow>
          </Cond>
        </ChooseOne>
      </Cond>

      <Cond>
        {users?.map((user) => (
          <TableRow key={user.id} data-testid={`user-${user.id}`}>
            <TableCell>
              <AvatarData
                title={user.username}
                subtitle={user.email}
                src={user.avatar_url}
              />
            </TableCell>

            <UserRoleCell
              canEditUsers={canEditUsers}
              allAvailableRoles={roles}
              user={user}
              oidcRoleSyncEnabled={oidcRoleSyncEnabled}
              isLoading={Boolean(isUpdatingUserRoles)}
              onUserRolesUpdate={onUpdateUserRoles}
            />

            <UserGroupsCell userGroups={groupsByUserId?.get(user.id)} />

            <TableCell>
              <LoginType authMethods={authMethods!} value={user.login_type} />
            </TableCell>

            <TableCell
              css={[
                styles.status,
                user.status === "suspended" && styles.suspended,
              ]}
            >
              <Box>{user.status}</Box>
              <LastSeen value={user.last_seen_at} sx={{ fontSize: 12 }} />
            </TableCell>

            {canEditUsers && (
              <TableCell>
                <MoreMenu>
                  <MoreMenuTrigger>
                    <ThreeDotsButton />
                  </MoreMenuTrigger>
                  <MoreMenuContent>
                    {user.status === "active" || user.status === "dormant" ? (
                      <MoreMenuItem
                        data-testid="suspend-button"
                        onClick={() => {
                          onSuspendUser(user);
                        }}
                      >
                        Suspend&hellip;
                      </MoreMenuItem>
                    ) : (
                      <MoreMenuItem onClick={() => onActivateUser(user)}>
                        Activate&hellip;
                      </MoreMenuItem>
                    )}
                    <MoreMenuItem onClick={() => onListWorkspaces(user)}>
                      View workspaces
                    </MoreMenuItem>
                    <MoreMenuItem
                      onClick={() => onViewActivity(user)}
                      disabled={!canViewActivity}
                    >
                      View activity
                      {!canViewActivity && <EnterpriseBadge />}
                    </MoreMenuItem>
                    <MoreMenuItem
                      onClick={() => onResetUserPassword(user)}
                      disabled={user.login_type !== "password"}
                    >
                      Reset password&hellip;
                    </MoreMenuItem>
                    <Divider />
                    <MoreMenuItem
                      onClick={() => onDeleteUser(user)}
                      disabled={user.id === actorID}
                      danger
                    >
                      Delete&hellip;
                    </MoreMenuItem>
                  </MoreMenuContent>
                </MoreMenu>
              </TableCell>
            )}
          </TableRow>
        ))}
      </Cond>
    </ChooseOne>
  );
};

const LoginType = ({
  authMethods,
  value,
}: {
  authMethods: TypesGen.AuthMethods;
  value: TypesGen.LoginType;
}) => {
  let displayName: string = value;
  let icon = <></>;
  const iconStyles = { width: 14, height: 14 };

  if (value === "password") {
    displayName = "Password";
    icon = <PasswordOutlined sx={iconStyles} />;
  } else if (value === "none") {
    displayName = "None";
    icon = <HideSourceOutlined sx={iconStyles} />;
  } else if (value === "github") {
    displayName = "GitHub";
    icon = <GitHub sx={iconStyles} />;
  } else if (value === "token") {
    displayName = "Token";
    icon = <KeyOutlined sx={iconStyles} />;
  } else if (value === "oidc") {
    displayName =
      authMethods.oidc.signInText === "" ? "OIDC" : authMethods.oidc.signInText;
    icon =
      authMethods.oidc.iconUrl === "" ? (
        <ShieldOutlined sx={iconStyles} />
      ) : (
        <Box
          component="img"
          alt="Open ID Connect icon"
          src={authMethods.oidc.iconUrl}
          sx={iconStyles}
        />
      );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 14 }}>
      {icon}
      {displayName}
    </Box>
  );
};

const styles = {
  status: {
    textTransform: "capitalize",
  },
  suspended: (theme) => ({
    color: theme.palette.text.secondary,
  }),
} satisfies Record<string, Interpolation<Theme>>;
