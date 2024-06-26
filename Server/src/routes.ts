import { FastifyInstance } from "fastify";
import AuthRoutes from "./routes/userAuthRoute.routes";
import AdminAuthRoutes from "./routes/adminAuth.route";
import CategoryRoutes from "./routes/category.route";
import SubCategoryRoutes from "./routes/subCategory.route";
import ClientLoveRoutes from "./routes/clientLove.route";
import flatRoutes from "./routes/sizetype/flat.route";
import fittedRoutes from "./routes/sizetype/fitted.route";
import customFittedRoutes from "./routes/sizetype/customFitted.route";
import inventoryRoutes from "./routes/inventory.route";
import colorRoutes from "./routes/color.route";
import productRoutes from "./routes/sizetype/sizechart.route";
import customerSideDataRoutes from "./routes/customer.route";
import WishlistRoutes from "./routes/wishlist.route";
import CartRoutes from "./routes/cart.route";

export default function registerRoutes(server: FastifyInstance) {
  server.register(AuthRoutes, { prefix: "/api/auth" });
  server.register(AdminAuthRoutes, { prefix: "/api/auth/admin" });
  server.register(CategoryRoutes, { prefix: "/api" });
  server.register(SubCategoryRoutes, { prefix: "/api" });
  server.register(ClientLoveRoutes, { prefix: "/api" });
  server.register(flatRoutes, { prefix: "/api/flat" });
  server.register(fittedRoutes, { prefix: "/api/fitted" });
  server.register(customFittedRoutes, { prefix: "/api/customfitted" });
  server.register(inventoryRoutes, { prefix: "/api/inventory" });
  server.register(colorRoutes, { prefix: "/api/color" });
  server.register(productRoutes, { prefix: "/api/sizechart" });
  server.register(customerSideDataRoutes, {
    prefix: "/api/customer-side-data",
  });
  server.register(WishlistRoutes, {
    prefix: "/api/wishlist",
  });
  server.register(CartRoutes, {
    prefix: "/api/cart",
  });
}
