import { Router } from "express";
import { isAuth } from "middleware/auth";
import filePaser from "middleware/fileParser";
import validate from "middleware/validator";
import {
  deleteProduct,
  listNewProduct,
  updateProduct,
} from "controllers/product";
import { newProductSchema } from "utils/validationSchema";

const productRouter = Router();

productRouter.post(
  "/list",
  isAuth,
  filePaser,
  validate(newProductSchema),
  listNewProduct
);

productRouter.patch(
  "/:id",
  isAuth,
  filePaser,
  validate(newProductSchema),
  updateProduct
);
productRouter.delete("/:id", isAuth, deleteProduct);

export default productRouter;
