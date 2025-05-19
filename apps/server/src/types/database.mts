import { Generated } from "kysely";

export interface Database {
  user: UserTable;
}

export interface UserTable {
  id: Generated<number>;
  mobile_number: string;
  created_at: Generated<Date>;
  update_at: Generated<Date>;
}
