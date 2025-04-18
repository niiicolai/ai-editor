import JwtService from "../../services/jwt_service.js";

export const authentication = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).jso

  JwtService.verify(token)
    .then((decoded) => {
      req.user = decoded;
      next();
    })
    .catch(() => {
      res.status(401).json({ message: "Invalid token" });
    });
};

