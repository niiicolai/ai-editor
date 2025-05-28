import JwtService from "../../services/jwt_service.js";

export const authentication = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = JwtService.verify(token);
    if (!decoded) throw new Error("decoded is undefined");
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: "Invalid token" });
  }
};
