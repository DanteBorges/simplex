import Card from "@mui/material/Card";

import {  CardActions } from "@mui/material";
import { FormCreateProblem } from "./FormCreateProblem";
import styles from "./Card.module.css";

export function CardProblem() {
  return (
    <Card className={styles.card}>
      <CardActions>
        <FormCreateProblem />
      </CardActions>
    </Card>
  );
}
