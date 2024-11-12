import { createStyles, Paper, Group, Button, Text, Image } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.gray[0],
    position: "absolute",
    top: "50%",
    left: "40%",
    transform: "translate(-30%,-50%)",
    padding: 20,

    [theme.fn.smallerThan("lg")]: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    },
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    [theme.fn.largerThan("lg")]: {
      flexDirection: "row",
    },
  },

  ctaText: {
    fontWeight: 700,
    textAlign: "center",
    marginTop: 8,
    fontSize: 20,
    [theme.fn.largerThan("sm")]: {
      fontSize: 30,
      marginTop: 20,
    },
  },

  messageText: {
    fontSize: 18,
    [theme.fn.largerThan("sm")]: {
      fontSize: 25,
    },
  },

  emptyImage: {
    height: 220,
    width: 220,
    objectFit: "fill",
  },
}));

export function EmptyPage(props: {
  messageLine1: string;
  messageLine2: string;
  messageLine3: string;
  ctaText: string;
  imagePath: string;
  onCTAClick: () => void;
}) {
  const { classes } = useStyles();
  return (
    <Paper shadow={"xl"} className={classes.root}>
      <Group className={classes.innerContainer}>
        <div style={{ flex: 1 }}>
          <Text className={classes.messageText}>{props.messageLine1}</Text>
          <Text className={classes.messageText}>{props.messageLine2}</Text>
          <Text className={classes.ctaText}>{props.messageLine3}</Text>
          <Button fullWidth size="lg" onClick={props.onCTAClick}>
            {props.ctaText}
          </Button>
        </div>
        <img className={classes.emptyImage} src={props.imagePath}></img>
      </Group>
    </Paper>
  );
}
