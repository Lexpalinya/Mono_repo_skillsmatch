import { Hono } from "hono";
import { LoginMember, RegisterMember } from "./services/auth";
import { setCookie } from "hono/cookie";
import { MemberCreateDto, MemberLoginDtoType } from "@skillsmatch/dto";

const memberRoute = new Hono();
memberRoute.post("/register", async (c) => {
  const body = await c.req.json();
  const input = MemberCreateDto.parse(body);
  console.log('input :>> ', input);
  // Set cookie using Hono's context
  const result = await RegisterMember(input);
  setCookie(c, "token", result.token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return c.json({ message: "Registration successful", token: result.token });
})
memberRoute.post("/login", async (c) => {
  const body = await c.req.json();
  const input = MemberLoginDtoType.parse(body);
  const result = await LoginMember(input);

  setCookie(c, "token", result.token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return c.json({ message: "Login successful", token: result.token, data: { ...result.member, password: undefined } });
});


export default memberRoute;
console.log('meberRoute. :>> ', memberRoute.routes);