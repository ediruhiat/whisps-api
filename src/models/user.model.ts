import DB from "../middlewares/database";
import dayjs from "dayjs";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

interface IUserData {
  name: string;
  date_of_birth?: string;
  address?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

interface IUser {
  id?: number;
  username: string;
  password?: string;
  email: string;
  is_active: number;
  name: string;
  date_of_birth: string;
  phone: string;
  address: string;
}

type TUserModel = {
  create: (user: IUser) => any;
  find: (query: object) => any;
  findOne: (field: string, value: any, view: boolean) => any;
  update: (query: object, data: object) => any;
  delete: (query: object) => any;
};

const UserModel: TUserModel = {
  create: async (user: IUser) => {
    const userdata: IUserData = {
      name: user.name,
      created_at: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
    };

    if (user.date_of_birth) userdata.date_of_birth = user.date_of_birth;
    if (user.address) userdata.address = user.address;
    if (user.phone) userdata.phone = user.phone;

    try {
      return await DB.transaction(async (trx) => {
        // Check existing email and username
        const emailExist = await DB("users")
          .where({ email: user.email })
          .select("email");

        const usernameExist = await DB("users")
          .where({ username: user.username })
          .select("username");

        if (emailExist.length > 0) {
          return {
            status: false,
            message: "email already registered",
          };
        }

        if (usernameExist.length > 0) {
          return {
            status: false,
            message: "username already used by other account",
          };
        }

        // Hash password before store to DB
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password!, salt);

        // Store to DB using transaction
        const user_result = await trx("users")
          .insert({
            username: user.username,
            password: hashedPassword,
            email: user.email,
            uuid: uuid(),
            is_active: 1,
            status: "Active",
            created_at: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
          })
          .onConflict(["email", "username"])
          .ignore()
          .then(async (user_id) => {
            if (user_id[0] === 0) {
              return { status: false, message: "unknown error" };
            }

            await trx("users_data")
              .insert(userdata)
              .then(async (userdata_id) => {
                await trx("users")
                  .where({ id: user_id[0] })
                  .update({ userdata_id: userdata_id[0] });
              });

            const result = await trx("users_view")
              .where("id", user_id[0])
              .first("*");

            return {
              status: result[0] !== 0,
              message:
                user_id[0] !== 0 && result[0] !== 0 ? "success" : "error",
              data: result,
            };
          });

        return user_result;
      });
    } catch (error) {
      return error;
    }
  },
  find: async (query?: object) => {
    try {
      if (query) {
        return await DB.where(query).select("*").from("users_view");
      } else {
        return await DB.select("*").from("users_view");
      }
    } catch (error) {
      return error;
    }
  },
  findOne: async (field: string, value: any, view: boolean = true) => {
    try {
      return await DB.where(field, value)
        .first("*")
        .from(view ? "users_view" : "users");
    } catch (error) {
      return error;
    }
  },
  update: async (query: object, data: object) => {
    try {
      return await DB.where(query).update({
        ...data,
        updated_at: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      });
    } catch (error) {
      return error;
    }
  },
  delete: async (query: object) => {
    try {
      return await DB.where(query).update({
        is_active: 0,
        status: "Deleted",
        deleted_at: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      });
    } catch (error) {
      return error;
    }
  },
};

export default UserModel;
