import * as yup from "yup";

type ValidationResult<T> = { error?: string; values?: T };

export const yupValidate = async <T extends object>(
  schema: yup.Schema,
  value: T
): Promise<ValidationResult<T>> => {
  try {
    const data = await schema.validate(value);
    return { values: data };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { error: error.message };
    } else {
      return { error: (error as any).message };
    }
  }
};

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

yup.addMethod(yup.string, "email", function validateEmail(message) {
  return this.matches(emailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

const EmailAndPassValidation = {
  email: yup
    .string()
    .email("Email không hợp lệ!")
    .required("Email không được để trống!"),
  password: yup
    .string()
    .required("Mật khẩu không được để trống!")
    .min(8, "Mật khẩu nên có ít nhất 8 kí tự!")
    .matches(passwordRegex, "Mật khẩu quá dễ đoán."),
};

export const newUserSchema = yup.object({
  name: yup.string().required("Tên không được để trống!"),
  ...EmailAndPassValidation,
});
export const signInSchema = yup.object({
  ...EmailAndPassValidation,
});
export const newProductSchema = yup.object({
  name: yup.string().required("Tên sản phẩm không được để trống!"),
  description: yup.string().required("Mô tả sản phẩm không được để trống!"),
  category: yup.string().required("Danh mục sản phẩm không được để trống!"),
  price: yup
    .string()
    .transform((value) => {
      if (isNaN(+value)) return "";
      return value;
    })
    .required("Giá sản phẩm không được để trống!"),
  purchasingDate: yup.date().required("Ngày mua sản phẩm không được để trống!"),
});
