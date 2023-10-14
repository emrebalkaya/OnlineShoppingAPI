import { CustomerController } from "./controller/CustomerController";
import { OrderController } from "./controller/OrderController";
import { ProductController } from "./controller/ProductController";

export const Routes = [
    {
        method: "get",
        route: "/customers",
        controller: CustomerController,
        action: "getAll" 
    },
    {
        method: "post",
        route: "/register",
        controller: CustomerController,
        action: "register"
    },
    {
        method: "delete",
        route: "/customers/:id",
        controller: CustomerController,
        action: "remove"
    },
    {
        method: "post",
        route: "/login",
        controller: CustomerController,
        action: "login"
    },
    {
        method: "get",
        route: "/products",
        controller: ProductController,
        action: "getAll"
    },
    {
        method: "post",
        route: "/products",
        controller: ProductController,
        action: "add"
    },
    {
        method: "put",
        route: "/products/:id",
        controller: ProductController,
        action: "update"
    },
    {
        method: "delete",
        route: "/products/:id",
        controller: ProductController,
        action: "delete"
    },
    {
        method: "get",
        route: "/order",
        controller: OrderController,
        action: "getAll"
    },
    {
        method: "get",
        route: "/order/:id",
        controller: OrderController,
        action: "getByCustomer"
    },
    {
        method: "get",
        route: "/order-details",
        controller: OrderController,
        action: "getOrderDetails"
    },
    {
        method: "get",
        route: "/order-details/:id",
        controller: OrderController,
        action: "getOrderDetailsByCustomer"
    },
    {
        method: "post",
        route: "/order",
        controller: OrderController,
        action: "add"
    },
];
