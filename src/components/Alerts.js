import {Alert} from "@material-ui/lab";
import React from "react";

export const LimitReachedAlert = () =>
  <Alert severity="info">You have reached the maximum number of records we can show you; however, there is likely more data available.<br />Please refine your search criteria.</Alert>;
