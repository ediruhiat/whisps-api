import Joi from "joi";

interface IValidationStatus {
  status: boolean;
  message: string | object | Joi.ValidationError;
}

interface IAuthController {
  validate: (data: object, type: string) => IValidationStatus;
}

const AuthController: IAuthController = {
  validate: (data: object, type: string) => {
    const validateRegister = (values: object) => {
      const registerSchema = Joi.object({
        name: Joi.string().min(2).required(),
        username: Joi.string().min(4).required(),
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required(),
        address: Joi.string().optional(),
        date_of_birth: Joi.string().optional(),
        phone: Joi.string().optional(),
      });

      const { error } = registerSchema.validate(values);

      return {
        status: error ? false : true,
        message: error ? error : "success",
      };
    };

    const validateLogin = (values: object) => {
      const loginSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        remember: Joi.boolean().optional(),
      });

      const { error } = loginSchema.validate(values);

      return {
        status: error ? false : true,
        message: error ? error : "success",
      };
    };

    switch (type) {
      case "REGISTER":
        return validateRegister(data);

      case "LOGIN":
        return validateLogin(data);

      default:
        return {
          status: false,
          message: "type cannot be null or undefined.",
        };
    }
  },
};

export default AuthController;
