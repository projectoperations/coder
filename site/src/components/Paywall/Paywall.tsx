import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { type FC, type ReactNode } from "react";
import { type Interpolation, type Theme } from "@emotion/react";
import { EnterpriseBadge } from "components/Badges/Badges";
import { Stack } from "components/Stack/Stack";

export interface PaywallProps {
  message: string;
  description?: string | React.ReactNode;
  cta?: ReactNode;
}

export const Paywall: FC<React.PropsWithChildren<PaywallProps>> = (props) => {
  const { message, description, cta } = props;

  return (
    <Box css={styles.root}>
      <div css={styles.header}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Typography variant="h5" css={styles.title}>
            {message}
          </Typography>
          <EnterpriseBadge />
        </Stack>

        {description && (
          <Typography
            variant="body2"
            color="textSecondary"
            css={styles.description}
          >
            {description}
          </Typography>
        )}
      </div>
      {cta}
    </Box>
  );
};

const styles = {
  root: (theme) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minHeight: 300,
    padding: 24,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
  }),
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 600,
    fontFamily: "inherit",
  },
  description: {
    marginTop: 8,
    fontFamily: "inherit",
    maxWidth: 420,
    lineHeight: "160%",
  },
  enterpriseChip: (theme) => ({
    background: theme.palette.success.dark,
    color: theme.palette.success.contrastText,
    border: `1px solid ${theme.palette.success.light}`,
    fontSize: 13,
  }),
} satisfies Record<string, Interpolation<Theme>>;
