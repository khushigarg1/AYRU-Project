"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userAuthRoute_routes_1 = __importDefault(require("./routes/userAuthRoute.routes"));
const adminAuth_route_1 = __importDefault(require("./routes/adminAuth.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const subCategory_route_1 = __importDefault(require("./routes/subCategory.route"));
const clientLove_route_1 = __importDefault(require("./routes/clientLove.route"));
const flat_route_1 = __importDefault(require("./routes/sizetype/flat.route"));
const fitted_route_1 = __importDefault(require("./routes/sizetype/fitted.route"));
// import customFittedRoutes from "./routes/sizetype/customFitted.route";
const inventory_route_1 = __importDefault(require("./routes/inventory.route"));
const color_route_1 = __importDefault(require("./routes/color.route"));
const sizechart_route_1 = __importDefault(require("./routes/sizetype/sizechart.route"));
const customer_route_1 = __importDefault(require("./routes/customer.route"));
const wishlist_route_1 = __importDefault(require("./routes/wishlist.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const order_router_1 = __importDefault(require("./routes/order.router"));
const availability_route_1 = require("./routes/availability.route");
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const config_route_1 = __importDefault(require("./routes/config.route"));
function registerRoutes(server) {
    server.register(userAuthRoute_routes_1.default, { prefix: "/api/auth" });
    server.register(adminAuth_route_1.default, { prefix: "/api/auth/admin" });
    server.register(category_route_1.default, { prefix: "/api" });
    server.register(subCategory_route_1.default, { prefix: "/api" });
    server.register(clientLove_route_1.default, { prefix: "/api" });
    server.register(flat_route_1.default, { prefix: "/api/flat" });
    server.register(config_route_1.default, { prefix: "/api/config" });
    server.register(fitted_route_1.default, { prefix: "/api/fitted" });
    server.register(order_router_1.default, { prefix: "/api/order" });
    // server.register(customFittedRoutes, { prefix: "/api/customfitted" });
    server.register(inventory_route_1.default, { prefix: "/api/inventory" });
    server.register(color_route_1.default, { prefix: "/api/color" });
    server.register(sizechart_route_1.default, { prefix: "/api/sizechart" });
    server.register(availability_route_1.availabilityRoutes, { prefix: "/api/availability" });
    server.register(dashboard_route_1.default, { prefix: "/api/dashboard" });
    server.register(customer_route_1.default, {
        prefix: "/api/customer-side-data",
    });
    server.register(wishlist_route_1.default, {
        prefix: "/api/wishlist",
    });
    server.register(cart_route_1.default, {
        prefix: "/api/cart",
    });
}
exports.default = registerRoutes;
